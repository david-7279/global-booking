package com.globalbooking.booking.service;

import com.globalbooking.booking.domain.*;
import com.globalbooking.booking.dto.request.AvailabilityRequest;
import com.globalbooking.booking.dto.request.BookingFilter;
import com.globalbooking.booking.dto.request.CreateBookingRequest;
import com.globalbooking.booking.dto.response.AvailabilityResponse;
import com.globalbooking.booking.dto.response.BookingResponse;
import com.globalbooking.booking.dto.response.CatalogItem;
import com.globalbooking.booking.mapper.BookingMapper;
import com.globalbooking.booking.repository.*;
import com.globalbooking.booking.security.Actor;
import com.globalbooking.booking.shared.common.error.ErrorCode;
import com.globalbooking.booking.shared.common.exception.CatalogValidationException;
import com.globalbooking.booking.shared.common.exception.ConflictException;
import com.globalbooking.booking.shared.common.exception.ForbiddenException;
import com.globalbooking.booking.shared.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private static final List<BookingStatus> BLOCKING_STATUSES = List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED);
    private final BookingRepository bookingRepository;
    private final BookingHistoryRepository historyRepository;
    private final IdempotencyRecordRepository idempotencyRepository;
    private final OutboxEventRepository outboxRepository;
    private final CatalogClient catalogClient;
    private final ScheduleService scheduleService;
    private final BookingMapper mapper;
    private final ObjectMapper objectMapper;

    @Transactional
    public BookingResponse create(Actor actor, CreateBookingRequest request, String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank() || idempotencyKey.length() > 200)
            throw new ConflictException(ErrorCode.INVALID_REQUEST, "A valid Idempotency-Key header is required.");
        String hash = hash(request.toString());
        var existing = idempotencyRepository.findByKeyAndUserId(idempotencyKey, actor.userId());
        if (existing.isPresent()) {
            if (!existing.get().getRequestHash().equals(hash))
                throw new ConflictException(ErrorCode.INVALID_REQUEST, "Idempotency-Key was already used with a different request.");
            return mapper.toResponse(find(existing.get().getBookingId()));
        }

        CatalogItem service = catalogClient.getService(request.bookingServiceId());
        CatalogItem establishment = catalogClient.getEstablishment(request.establishmentId());
        CatalogItem resource = catalogClient.getResource(request.resourceId());
        catalogClient.validate(request.businessId(), request.establishmentId(), request.bookingServiceId(), request.resourceId());
        validateDuration(service, request.startAt(), request.endAt());
        scheduleService.validate(request.establishmentId(), establishment.timezone(), request.startAt(), request.endAt());
        int allocationSlot = findAvailableSlot(request.resourceId(), resource.capacity(), request.startAt(), request.endAt());
        Booking booking = bookingRepository.save(mapper.toDomain(actor.userId(), request, allocationSlot));
        historyRepository.save(new BookingHistory(booking.getId(), null, BookingStatus.PENDING, actor.userId(), "Booking created"));
        idempotencyRepository.save(new IdempotencyRecord(idempotencyKey, actor.userId(), hash, booking.getId()));
        appendEvent(booking, "BookingCreated", "booking.created");
        return mapper.toResponse(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> list(Actor actor, BookingFilter filter, Pageable pageable) {
        Specification<Booking> specification = actor.isAdmin() ? (root, query, criteriaBuilder) -> criteriaBuilder.conjunction() : BookingSpecifications.user(actor.userId());
        if (filter != null) {
            if (filter.status() != null)
                specification = specification.and(BookingSpecifications.status(filter.status()));
            if (filter.establishmentId() != null)
                specification = specification.and(BookingSpecifications.establishment(filter.establishmentId()));
            if (filter.bookingServiceId() != null)
                specification = specification.and(BookingSpecifications.bookingService(filter.bookingServiceId()));
            if (filter.resourceId() != null)
                specification = specification.and(BookingSpecifications.resource(filter.resourceId()));
            if (filter.from() != null)
                specification = specification.and(BookingSpecifications.endsAfter(filter.from()));
            if (filter.to() != null) specification = specification.and(BookingSpecifications.startsBefore(filter.to()));
        }
        return bookingRepository.findAll(specification, pageable).map(mapper::toResponse);
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
        CatalogItem establishment = catalogClient.getEstablishment(request.establishmentId());
        CatalogItem resource = catalogClient.getResource(request.resourceId());
        catalogClient.validateCatalogForAvailability(request.establishmentId(), request.bookingServiceId(), request.resourceId());
        scheduleService.validate(request.establishmentId(), establishment.timezone(), request.from(), request.to());
        boolean available;
        try {
            available = findAvailableSlot(request.resourceId(), resource.capacity(), request.from(), request.to()) >= 0;
        } catch (ConflictException occupied) {
            available = false;
        }
        return new AvailabilityResponse(request.from(), request.to(), available);
    }

    private int findAvailableSlot(UUID resourceId, Integer capacity, Instant startAt, Instant endAt) {
        int slots = capacity == null ? 1 : capacity;
        if (slots < 1) throw new CatalogValidationException("Resource capacity must be at least 1.");
        for (int slot = 0; slot < slots; slot++)
            if (bookingRepository.findOverlaps(resourceId, slot, startAt, endAt, BLOCKING_STATUSES).isEmpty())
                return slot;
        if (startAt != null)
            throw new ConflictException(ErrorCode.INVALID_REQUEST, "The resource has no available capacity for the requested period.");
        return -1;
    }

    private void validateDuration(CatalogItem service, Instant start, Instant end) {
        long seconds = end.getEpochSecond() - start.getEpochSecond();
        if (service.durationMinutes() != null && seconds != service.durationMinutes() * 60L)
            throw new CatalogValidationException("Booking period must match the catalog service duration.");
    }

    private BookingResponse transition(Actor actor, UUID id, BookingStatus target, String reason, String eventType, String routingKey) {
        Booking booking = find(id);
        if (target == BookingStatus.CANCELLED) {
            if (!actor.isAdmin() && !actor.userId().equals(booking.getUserId()))
                throw new ForbiddenException("Only the booking owner or an administrator may cancel it.");
        } else if (!actor.isAdmin() && !actor.userId().equals(booking.getUserId()) && !canManageCatalog(actor, booking.getBusinessId()))
            throw new ForbiddenException("You cannot manage this booking.");
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
        return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found."));
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
