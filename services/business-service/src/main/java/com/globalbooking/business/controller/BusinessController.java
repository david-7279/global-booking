package com.globalbooking.business.controller;

import com.globalbooking.business.api.BusinessDtos.*;
import com.globalbooking.business.security.Actor;
import com.globalbooking.business.service.BusinessDomainService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BusinessController {
    private final BusinessDomainService service;

    private Actor actor(Authentication authentication) {
        return Actor.from(authentication);
    }

    @GetMapping("/businesses")
    public List<BusinessResponse> listBusinesses(Authentication a) {
        return service.listBusinesses(actor(a));
    }

    @PostMapping("/businesses")
    public ResponseEntity<BusinessResponse> createBusiness(Authentication a, @Valid @RequestBody BusinessRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createBusiness(actor(a), r));
    }

    @GetMapping("/businesses/{id}")
    public BusinessResponse getBusiness(Authentication a, @PathVariable UUID id) {
        return service.getBusiness(actor(a), id);
    }

    @PutMapping("/businesses/{id}")
    public BusinessResponse updateBusiness(Authentication a, @PathVariable UUID id, @Valid @RequestBody BusinessRequest r) {
        return service.updateBusiness(actor(a), id, r);
    }

    @DeleteMapping("/businesses/{id}")
    public ResponseEntity<Void> deleteBusiness(Authentication a, @PathVariable UUID id) {
        service.deleteBusiness(actor(a), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/businesses/{businessId}/establishments")
    public List<EstablishmentResponse> listEstablishments(Authentication a, @PathVariable UUID businessId) {
        return service.listEstablishments(actor(a), businessId);
    }

    @PostMapping("/businesses/{businessId}/establishments")
    public ResponseEntity<EstablishmentResponse> createEstablishment(Authentication a, @PathVariable UUID businessId, @Valid @RequestBody EstablishmentRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createEstablishment(actor(a), businessId, r));
    }

    @GetMapping("/establishments/{id}")
    public EstablishmentResponse getEstablishment(Authentication a, @PathVariable UUID id) {
        return service.getEstablishment(actor(a), id);
    }

    @PutMapping("/establishments/{id}")
    public EstablishmentResponse updateEstablishment(Authentication a, @PathVariable UUID id, @Valid @RequestBody EstablishmentRequest r) {
        return service.updateEstablishment(actor(a), id, r);
    }

    @DeleteMapping("/establishments/{id}")
    public ResponseEntity<Void> deleteEstablishment(Authentication a, @PathVariable UUID id) {
        service.deleteEstablishment(actor(a), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/establishments/{establishmentId}/services")
    public List<BookingServiceResponse> listServices(Authentication a, @PathVariable UUID establishmentId) {
        return service.listBookingServices(actor(a), establishmentId);
    }

    @PostMapping("/establishments/{establishmentId}/services")
    public ResponseEntity<BookingServiceResponse> createService(Authentication a, @PathVariable UUID establishmentId, @Valid @RequestBody BookingServiceRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createBookingService(actor(a), establishmentId, r));
    }

    @GetMapping("/services/{id}")
    public BookingServiceResponse getService(Authentication a, @PathVariable UUID id) {
        return service.getBookingService(actor(a), id);
    }

    @PutMapping("/services/{id}")
    public BookingServiceResponse updateService(Authentication a, @PathVariable UUID id, @Valid @RequestBody BookingServiceRequest r) {
        return service.updateBookingService(actor(a), id, r);
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(Authentication a, @PathVariable UUID id) {
        service.deleteBookingService(actor(a), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/establishments/{establishmentId}/resources")
    public List<ResourceResponse> listResources(Authentication a, @PathVariable UUID establishmentId) {
        return service.listResources(actor(a), establishmentId);
    }

    @PostMapping("/establishments/{establishmentId}/resources")
    public ResponseEntity<ResourceResponse> createResource(Authentication a, @PathVariable UUID establishmentId, @Valid @RequestBody ResourceRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createResource(actor(a), establishmentId, r));
    }

    @GetMapping("/resources/{id}")
    public ResourceResponse getResource(Authentication a, @PathVariable UUID id) {
        return service.getResource(actor(a), id);
    }

    @PutMapping("/resources/{id}")
    public ResourceResponse updateResource(Authentication a, @PathVariable UUID id, @Valid @RequestBody ResourceRequest r) {
        return service.updateResource(actor(a), id, r);
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(Authentication a, @PathVariable UUID id) {
        service.deleteResource(actor(a), id);
        return ResponseEntity.noContent().build();
    }
}
