package com.globalbooking.business.service;

import com.globalbooking.business.common.error.ErrorCode;
import com.globalbooking.business.common.exception.ForbiddenException;
import com.globalbooking.business.common.exception.ResourceNotFoundException;
import com.globalbooking.business.domain.*;
import com.globalbooking.business.dto.request.BookingServiceRequest;
import com.globalbooking.business.dto.request.BusinessRequest;
import com.globalbooking.business.dto.request.EstablishmentRequest;
import com.globalbooking.business.dto.request.ResourceRequest;
import com.globalbooking.business.dto.response.BookingServiceResponse;
import com.globalbooking.business.dto.response.BusinessResponse;
import com.globalbooking.business.dto.response.EstablishmentResponse;
import com.globalbooking.business.dto.response.ResourceResponse;
import com.globalbooking.business.mapper.BookingServiceMapper;
import com.globalbooking.business.mapper.BusinessMapper;
import com.globalbooking.business.mapper.EstablishmentMapper;
import com.globalbooking.business.mapper.ResourceMapper;
import com.globalbooking.business.repository.BookingServiceRepository;
import com.globalbooking.business.repository.BusinessRepository;
import com.globalbooking.business.repository.EstablishmentRepository;
import com.globalbooking.business.repository.ResourceRepository;
import com.globalbooking.business.security.Actor;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BusinessDomainService {
    private final BusinessRepository businessRepository;
    private final EstablishmentRepository establishmentRepository;
    private final BookingServiceRepository bookingServiceRepository;
    private final ResourceRepository resourceRepository;
    private final BusinessMapper businessMapper;
    private final EstablishmentMapper establishmentMapper;
    private final BookingServiceMapper bookingServiceMapper;
    private final ResourceMapper resourceMapper;
    private final MeterRegistry meterRegistry;

    @Transactional(readOnly = true)
    public List<BusinessResponse> listBusinesses(Actor actor) {
        List<Business> businesses = actor.isAdmin()
                ? businessRepository.findAll()
                : businessRepository.findAllByOwnerUserIdAndStatusNot(actor.userId(), Status.DELETED);
        return businesses.stream()
                .filter(business -> business.getStatus() != Status.DELETED)
                .map(businessMapper::toResponse)
                .toList();
    }

    @Transactional
    public BusinessResponse createBusiness(Actor actor, BusinessRequest request) {
        requireManager(actor);
        Business saved = businessRepository.save(new Business(actor.userId(), request.name(), request.description()));
        count("business.created");
        return businessMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public BusinessResponse getBusiness(Actor actor, UUID id) {
        Business business = findBusiness(id);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
        return businessMapper.toResponse(business);
    }

    @Transactional
    public BusinessResponse updateBusiness(Actor actor, UUID id, BusinessRequest request) {
        Business business = findBusiness(id);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
        business.update(request.name(), request.description());
        count("business.updated");
        return businessMapper.toResponse(business);
    }

    @Transactional
    public void deleteBusiness(Actor actor, UUID id) {
        Business business = findBusiness(id);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
        business.delete();
        count("business.deleted");
    }

    @Transactional
    public EstablishmentResponse createEstablishment(Actor actor, UUID businessId, EstablishmentRequest request) {
        Business business = findBusiness(businessId);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
        Establishment saved = establishmentRepository.save(
                new Establishment(businessId, request.name(), request.address(), request.timezone()));
        return establishmentMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EstablishmentResponse> listEstablishments(Actor actor, UUID businessId) {
        Business business = findBusiness(businessId);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
        return establishmentRepository.findAllByBusinessIdAndStatusNot(businessId, Status.DELETED)
                .stream().map(establishmentMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EstablishmentResponse getEstablishment(Actor actor, UUID id) {
        Establishment establishment = findEstablishment(id);
        requireBusinessAccess(actor, establishment.getBusinessId());
        return establishmentMapper.toResponse(establishment);
    }

    @Transactional
    public EstablishmentResponse updateEstablishment(Actor actor, UUID id, EstablishmentRequest request) {
        Establishment establishment = findEstablishment(id);
        requireBusinessAccess(actor, establishment.getBusinessId());
        establishment.update(request.name(), request.address(), request.timezone());
        return establishmentMapper.toResponse(establishment);
    }

    @Transactional
    public void deleteEstablishment(Actor actor, UUID id) {
        Establishment establishment = findEstablishment(id);
        requireBusinessAccess(actor, establishment.getBusinessId());
        establishment.delete();
    }

    @Transactional
    public BookingServiceResponse createBookingService(Actor actor, UUID establishmentId, BookingServiceRequest request) {
        Establishment establishment = findEstablishment(establishmentId);
        requireBusinessAccess(actor, establishment.getBusinessId());
        BookingService saved = bookingServiceRepository.save(new BookingService(
                establishmentId, request.name(), request.description(), request.durationMinutes(),
                request.priceCents(), request.currency()));
        return bookingServiceMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingServiceResponse> listBookingServices(Actor actor, UUID establishmentId) {
        Establishment establishment = findEstablishment(establishmentId);
        requireBusinessAccess(actor, establishment.getBusinessId());
        return bookingServiceRepository.findAllByEstablishmentIdAndStatusNot(establishmentId, Status.DELETED)
                .stream().map(bookingServiceMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BookingServiceResponse getBookingService(Actor actor, UUID id) {
        BookingService service = findBookingService(id);
        requireEstablishmentAccess(actor, service.getEstablishmentId());
        return bookingServiceMapper.toResponse(service);
    }

    @Transactional
    public BookingServiceResponse updateBookingService(Actor actor, UUID id, BookingServiceRequest request) {
        BookingService service = findBookingService(id);
        requireEstablishmentAccess(actor, service.getEstablishmentId());
        service.update(request.name(), request.description(), request.durationMinutes(), request.priceCents(), request.currency());
        return bookingServiceMapper.toResponse(service);
    }

    @Transactional
    public void deleteBookingService(Actor actor, UUID id) {
        BookingService service = findBookingService(id);
        requireEstablishmentAccess(actor, service.getEstablishmentId());
        service.delete();
    }

    @Transactional
    public ResourceResponse createResource(Actor actor, UUID establishmentId, ResourceRequest request) {
        Establishment establishment = findEstablishment(establishmentId);
        requireBusinessAccess(actor, establishment.getBusinessId());
        Resource saved = resourceRepository.save(new Resource(
                establishmentId, request.name(), request.resourceType(), request.capacity()));
        return resourceMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> listResources(Actor actor, UUID establishmentId) {
        Establishment establishment = findEstablishment(establishmentId);
        requireBusinessAccess(actor, establishment.getBusinessId());
        return resourceRepository.findAllByEstablishmentIdAndStatusNot(establishmentId, Status.DELETED)
                .stream().map(resourceMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ResourceResponse getResource(Actor actor, UUID id) {
        Resource resource = findResource(id);
        requireEstablishmentAccess(actor, resource.getEstablishmentId());
        return resourceMapper.toResponse(resource);
    }

    @Transactional
    public ResourceResponse updateResource(Actor actor, UUID id, ResourceRequest request) {
        Resource resource = findResource(id);
        requireEstablishmentAccess(actor, resource.getEstablishmentId());
        resource.update(request.name(), request.resourceType(), request.capacity());
        return resourceMapper.toResponse(resource);
    }

    @Transactional
    public void deleteResource(Actor actor, UUID id) {
        Resource resource = findResource(id);
        requireEstablishmentAccess(actor, resource.getEstablishmentId());
        resource.delete();
    }

    private Business findBusiness(UUID id) {
        return businessRepository.findById(id)
                .filter(business -> business.getStatus() != Status.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BUSINESS_NOT_FOUND, "Business not found."));
    }

    private Establishment findEstablishment(UUID id) {
        return establishmentRepository.findById(id)
                .filter(establishment -> establishment.getStatus() != Status.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ESTABLISHMENT_NOT_FOUND, "Establishment not found."));
    }

    private BookingService findBookingService(UUID id) {
        return bookingServiceRepository.findById(id)
                .filter(service -> service.getStatus() != Status.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.BOOKING_SERVICE_NOT_FOUND, "Booking service not found."));
    }

    private Resource findResource(UUID id) {
        return resourceRepository.findById(id)
                .filter(resource -> resource.getStatus() != Status.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Resource not found."));
    }

    private void requireManager(Actor actor) {
        if (!actor.canManage())
            throw new ForbiddenException("Only operators and administrators can manage businesses.");
    }

    private void requireOwnerOrAdmin(Actor actor, UUID ownerUserId) {
        if (!actor.isAdmin() && !actor.userId().equals(ownerUserId)) {
            throw new ForbiddenException("You do not have access to this resource.");
        }
    }

    private void requireBusinessAccess(Actor actor, UUID businessId) {
        Business business = findBusiness(businessId);
        requireOwnerOrAdmin(actor, business.getOwnerUserId());
    }

    private void requireEstablishmentAccess(Actor actor, UUID establishmentId) {
        Establishment establishment = findEstablishment(establishmentId);
        requireBusinessAccess(actor, establishment.getBusinessId());
    }

    private void count(String operation) {
        meterRegistry.counter("business_domain_operations", "operation", operation).increment();
    }
}
