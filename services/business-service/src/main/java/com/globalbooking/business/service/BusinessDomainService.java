package com.globalbooking.business.service;

import com.globalbooking.business.api.BusinessDtos.*;
import com.globalbooking.business.domain.*;
import com.globalbooking.business.repository.*;
import com.globalbooking.business.security.Actor;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusinessDomainService {
    private static final String ACTIVE = "ACTIVE";
    private static final String DELETED = "DELETED";
    private final BusinessRepository businessRepository;
    private final EstablishmentRepository establishmentRepository;
    private final BookingServiceRepository bookingServiceRepository;
    private final ResourceRepository resourceRepository;
    private final MeterRegistry meterRegistry;

    @Transactional(readOnly = true)
    public List<BusinessResponse> listBusinesses(Actor actor) {
        List<Business> businesses = actor.isAdmin()
                ? businessRepository.findAll()
                : businessRepository.findAllByOwnerUserIdAndStatusNot(actor.userId(), DELETED);
        return businesses.stream().filter(b -> !DELETED.equals(b.getStatus())).map(this::toResponse).toList();
    }

    @Transactional
    public BusinessResponse createBusiness(Actor actor, BusinessRequest request) {
        requireManager(actor);
        Business business = businessRepository.save(new Business(actor.userId(), request.name(), request.description()));
        metric("business.created");
        return toResponse(business);
    }

    @Transactional(readOnly = true)
    public BusinessResponse getBusiness(Actor actor, UUID id) {
        Business business = business(id);
        requireAccess(actor, business.getOwnerUserId());
        return toResponse(business);
    }

    @Transactional
    public BusinessResponse updateBusiness(Actor actor, UUID id, BusinessRequest request) {
        Business business = business(id);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
        business.update(request.name(), request.description());
        metric("business.updated");
        return toResponse(business);
    }

    @Transactional
    public void deleteBusiness(Actor actor, UUID id) {
        Business business = business(id);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
        business.delete();
        metric("business.deleted");
    }

    @Transactional
    public EstablishmentResponse createEstablishment(Actor actor, UUID businessId, EstablishmentRequest request) {
        Business business = business(businessId);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
        return toResponse(establishmentRepository.save(new Establishment(businessId, request.name(), request.address(), request.timezone())));
    }

    @Transactional(readOnly = true)
    public List<EstablishmentResponse> listEstablishments(Actor actor, UUID businessId) {
        Business business = business(businessId);
        requireAccess(actor, business.getOwnerUserId());
        return establishmentRepository.findAllByBusinessIdAndStatusNot(businessId, DELETED).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EstablishmentResponse getEstablishment(Actor actor, UUID id) {
        Establishment e = establishment(id);
        requireBusinessAccess(actor, e.getBusinessId());
        return toResponse(e);
    }

    @Transactional
    public EstablishmentResponse updateEstablishment(Actor actor, UUID id, EstablishmentRequest request) {
        Establishment e = establishment(id);
        requireBusinessAccess(actor, e.getBusinessId());
        e.update(request.name(), request.address(), request.timezone());
        return toResponse(e);
    }

    @Transactional
    public void deleteEstablishment(Actor actor, UUID id) {
        Establishment e = establishment(id);
        requireBusinessAccess(actor, e.getBusinessId());
        e.delete();
    }

    @Transactional
    public BookingServiceResponse createBookingService(Actor actor, UUID establishmentId, BookingServiceRequest request) {
        Establishment e = establishment(establishmentId);
        requireBusinessAccess(actor, e.getBusinessId());
        return toResponse(bookingServiceRepository.save(new BookingService(establishmentId, request.name(), request.description(), request.durationMinutes(), request.priceCents(), request.currency())));
    }

    @Transactional(readOnly = true)
    public List<BookingServiceResponse> listBookingServices(Actor actor, UUID establishmentId) {
        Establishment e = establishment(establishmentId);
        requireBusinessAccess(actor, e.getBusinessId());
        return bookingServiceRepository.findAllByEstablishmentIdAndStatusNot(establishmentId, DELETED).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BookingServiceResponse getBookingService(Actor actor, UUID id) {
        BookingService s = bookingService(id);
        requireEstablishmentAccess(actor, s.getEstablishmentId());
        return toResponse(s);
    }

    @Transactional
    public BookingServiceResponse updateBookingService(Actor actor, UUID id, BookingServiceRequest request) {
        BookingService s = bookingService(id);
        requireEstablishmentAccess(actor, s.getEstablishmentId());
        s.update(request.name(), request.description(), request.durationMinutes(), request.priceCents(), request.currency());
        return toResponse(s);
    }

    @Transactional
    public void deleteBookingService(Actor actor, UUID id) {
        BookingService s = bookingService(id);
        requireEstablishmentAccess(actor, s.getEstablishmentId());
        s.delete();
    }

    @Transactional
    public ResourceResponse createResource(Actor actor, UUID establishmentId, ResourceRequest request) {
        Establishment e = establishment(establishmentId);
        requireBusinessAccess(actor, e.getBusinessId());
        return toResponse(resourceRepository.save(new Resource(establishmentId, request.name(), request.resourceType(), request.capacity())));
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> listResources(Actor actor, UUID establishmentId) {
        Establishment e = establishment(establishmentId);
        requireBusinessAccess(actor, e.getBusinessId());
        return resourceRepository.findAllByEstablishmentIdAndStatusNot(establishmentId, DELETED).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ResourceResponse getResource(Actor actor, UUID id) {
        Resource r = resource(id);
        requireEstablishmentAccess(actor, r.getEstablishmentId());
        return toResponse(r);
    }

    @Transactional
    public ResourceResponse updateResource(Actor actor, UUID id, ResourceRequest request) {
        Resource r = resource(id);
        requireEstablishmentAccess(actor, r.getEstablishmentId());
        r.update(request.name(), request.resourceType(), request.capacity());
        return toResponse(r);
    }

    @Transactional
    public void deleteResource(Actor actor, UUID id) {
        Resource r = resource(id);
        requireEstablishmentAccess(actor, r.getEstablishmentId());
        r.delete();
    }

    private void requireManager(Actor actor) {
        if (!actor.canManage()) throw forbidden();
    }

    private void requireOwnerOrAdmin(Actor actor, UUID owner) {
        if (!actor.isAdmin() && !actor.userId().equals(owner)) throw forbidden();
    }

    private void requireAccess(Actor actor, UUID owner) {
        requireOwnerOrAdmin(actor, owner);
    }

    private void requireBusinessAccess(Actor actor, UUID businessId) {
        Business b = business(businessId);
        requireOwnerOrAdmin(actor, b.getOwnerUserId());
    }

    private void requireEstablishmentAccess(Actor actor, UUID establishmentId) {
        Establishment e = establishment(establishmentId);
        requireBusinessAccess(actor, e.getBusinessId());
    }

    private void metric(String name) {
        meterRegistry.counter("business_domain_operations", "operation", name).increment();
    }

    private Business business(UUID id) {
        return businessRepository.findById(id).orElseThrow(() -> notFound("Business not found"));
    }

    private Establishment establishment(UUID id) {
        return establishmentRepository.findById(id).orElseThrow(() -> notFound("Establishment not found"));
    }

    private BookingService bookingService(UUID id) {
        return bookingServiceRepository.findById(id).orElseThrow(() -> notFound("Booking service not found"));
    }

    private Resource resource(UUID id) {
        return resourceRepository.findById(id).orElseThrow(() -> notFound("Resource not found"));
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }

    private ResponseStatusException forbidden() {
        return new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    private BusinessResponse toResponse(Business b) {
        return new BusinessResponse(b.getId(), b.getOwnerUserId(), b.getName(), b.getDescription(), b.getStatus(), b.getCreatedAt(), b.getUpdatedAt());
    }

    private EstablishmentResponse toResponse(Establishment e) {
        return new EstablishmentResponse(e.getId(), e.getBusinessId(), e.getName(), e.getAddress(), e.getTimezone(), e.getStatus(), e.getCreatedAt(), e.getUpdatedAt());
    }

    private BookingServiceResponse toResponse(BookingService s) {
        return new BookingServiceResponse(s.getId(), s.getEstablishmentId(), s.getName(), s.getDescription(), s.getDurationMinutes(), s.getPriceCents(), s.getCurrency(), s.getStatus(), s.getCreatedAt(), s.getUpdatedAt());
    }

    private ResourceResponse toResponse(Resource r) {
        return new ResourceResponse(r.getId(), r.getEstablishmentId(), r.getName(), r.getResourceType(), r.getCapacity(), r.getStatus(), r.getCreatedAt(), r.getUpdatedAt());
    }
}
