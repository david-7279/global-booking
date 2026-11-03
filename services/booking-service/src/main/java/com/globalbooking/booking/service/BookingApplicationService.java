package com.globalbooking.booking.service;

import com.globalbooking.booking.dto.request.AvailabilityRequest;
import com.globalbooking.booking.dto.request.CreateBookingRequest;
import com.globalbooking.booking.dto.response.AvailabilityResponse;
import com.globalbooking.booking.dto.response.BookingResponse;
import com.globalbooking.booking.shared.common.BookingExceptions.CatalogValidationException;
import com.globalbooking.booking.shared.common.BookingExceptions.ConflictException;
import com.globalbooking.booking.shared.common.BookingExceptions.ForbiddenException;
import com.globalbooking.booking.shared.common.BookingExceptions.NotFoundException;
import com.globalbooking.booking.domain.*;
import com.globalbooking.booking.mapper.BookingMapper;
import com.globalbooking.booking.repository.*;
import com.globalbooking.booking.security.Actor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingApplicationService {
    private final BookingRepository bookingRepository;
    private final BookingHistoryRepository historyRepository;
    private final IdempotencyRecordRepository idempotencyRepository;
    private final OutboxEventRepository outboxRepository;
    private final CatalogClient catalogClient;
    private final BookingMapper mapper;
    private final ObjectMapper objectMapper;

    @Transactional
    public BookingResponse create(Actor actor, CreateBookingRequest request, String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank() || idempotencyKey.length() > 200)
            throw new ConflictException("A valid Idempotency-Key header is required.");
        String hash = hash(request.toString());
        var existing = idempotencyRepository.findByKeyAndUserId(idempotencyKey, actor.userId());
        if (existing.isPresent()) {
            if (!existing.get().getRequestHash().equals(hash))
                throw new ConflictException("Idempotency-Key was already used with a different request.");
            return mapper.toResponse(find(existing.get().getBookingId()));
        }

        CatalogClient.CatalogItem service = catalogClient.getService(request.bookingServiceId());
        catalogClient.validate(request.businessId(), request.establishmentId(), request.bookingServiceId(), request.resourceId());
        long durationSeconds = request.endAt().getEpochSecond() - request.startAt().getEpochSecond();
        if (service.durationMinutes() != null && durationSeconds != service.durationMinutes() * 60L)
            throw new CatalogValidationException("Booking period must match the catalog service duration.");
        if (!bookingRepository.findOverlaps(request.resourceId(), request.startAt(), request.endAt(), List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)).isEmpty())
            throw new ConflictException("The resource is not available for the requested period.");

        Booking booking = bookingRepository.save(new Booking(actor.userId(), request.businessId(), request.establishmentId(), request.bookingServiceId(), request.resourceId(), request.startAt(), request.endAt(), request.notes()));
        historyRepository.save(new BookingHistory(booking.getId(), null, BookingStatus.PENDING, actor.userId(), "Booking created"));
        idempotencyRepository.save(new IdempotencyRecord(idempotencyKey, actor.userId(), hash, booking.getId()));
        appendEvent(booking, "BookingCreated", "booking.created");
        return mapper.toResponse(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> list(Actor actor, Pageable pageable) {
        Page<Booking> page = actor.isAdmin() ? bookingRepository.findAll(pageable) : bookingRepository.findByUserId(actor.userId(), pageable);
        return page.map(mapper::toResponse);
    }

    @Transactional(readOnly = true)
    public BookingResponse get(Actor actor, UUID id) {
        Booking booking = find(id);
        checkRead(actor, booking);
        return mapper.toResponse(booking);
    }

    @Transactional
    public BookingResponse cancel(Actor actor, UUID id, String reason) {
        return transition(actor, id, BookingStatus.CANCELLED, reason, "BookingCancelled", "booking.cancelled");
    }

    @Transactional
    public BookingResponse confirm(Actor actor, UUID id, String reason) {
        return transition(actor, id, BookingStatus.CONFIRMED, reason, "BookingConfirmed", "booking.confirmed");
    }

    @Transactional
    public BookingResponse reject(Actor actor, UUID id, String reason) {
        return transition(actor, id, BookingStatus.REJECTED, reason, "BookingRejected", "booking.rejected");
    }

    @Transactional
    public BookingResponse complete(Actor actor, UUID id, String reason) {
        return transition(actor, id, BookingStatus.COMPLETED, reason, "BookingCompleted", "booking.completed");
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse availability(AvailabilityRequest request) {
        if (!request.to().isAfter(request.from())) throw new IllegalArgumentException("to must be after from");
        catalogClient.validateCatalogForAvailability(request.establishmentId(), request.bookingServiceId(), request.resourceId());
        boolean available = bookingRepository.findOverlaps(request.resourceId(), request.from(), request.to(), List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)).isEmpty();
        return new AvailabilityResponse(request.from(), request.to(), available);
    }

    private BookingResponse transition(Actor actor, UUID id, BookingStatus target, String reason, String eventType, String routingKey) {
        Booking booking = find(id);
        if (target == BookingStatus.CANCELLED) {
            if (!actor.isAdmin() && !actor.userId().equals(booking.getUserId()))
                throw new ForbiddenException("Only the booking owner or an administrator may cancel it.");
        } else if (!actor.isAdmin() && !actor.userId().equals(booking.getUserId())) {
            if (!canManageCatalog(actor, booking.getBusinessId()))
                throw new ForbiddenException("You cannot manage this booking.");
        }
        BookingStatus previous = booking.getStatus();
        switch (target) {
            case CANCELLED -> booking.cancel();
            case CONFIRMED -> booking.confirm();
            case REJECTED -> booking.reject();
            case COMPLETED -> booking.complete();
            default -> throw new IllegalArgumentException("Unsupported transition");
        }
        historyRepository.save(new BookingHistory(id, previous, target, actor.userId(), reason));
        appendEvent(booking, eventType, routingKey);
        return mapper.toResponse(booking);
    }

    private boolean canManageCatalog(Actor actor, UUID businessId) {
        return actor.isOperator() && actor.userId().equals(catalogClient.getBusiness(businessId).ownerUserId());
    }

    private void checkRead(Actor actor, Booking b) {
        if (!actor.isAdmin() && !actor.userId().equals(b.getUserId()) && !canManageCatalog(actor, b.getBusinessId()))
            throw new ForbiddenException("You cannot access this booking.");
    }

    private Booking find(UUID id) {
        return bookingRepository.findById(id).orElseThrow(() -> new NotFoundException("Booking not found."));
    }

    private void appendEvent(Booking booking, String eventType, String routingKey) {
        try {
            String payload = objectMapper.writeValueAsString(new EventEnvelope(UUID.randomUUID(), eventType, 1, booking.getId(), Instant.now(), booking.getUserId(), mapper.toResponse(booking)));
            outboxRepository.save(new OutboxEvent(eventType, routingKey, booking.getId(), payload));
        } catch (Exception exception) {
            throw new IllegalStateException("Could not serialize booking event.", exception);
        }
    }

    private String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private record EventEnvelope(UUID eventId, String eventType, int eventVersion, UUID aggregateId, Instant occurredAt,
                                 UUID userId, BookingResponse data) {
    }
}
