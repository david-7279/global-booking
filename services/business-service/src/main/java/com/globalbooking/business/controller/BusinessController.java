package com.globalbooking.business.controller;

import com.globalbooking.business.dto.request.BookingServiceRequest;
import com.globalbooking.business.dto.request.BusinessRequest;
import com.globalbooking.business.dto.request.EstablishmentRequest;
import com.globalbooking.business.dto.request.ResourceRequest;
import com.globalbooking.business.dto.response.BookingServiceResponse;
import com.globalbooking.business.dto.response.BusinessResponse;
import com.globalbooking.business.dto.response.EstablishmentResponse;
import com.globalbooking.business.dto.response.ResourceResponse;
import com.globalbooking.business.security.Actor;
import com.globalbooking.business.service.BusinessDomainService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BusinessController {
    private final BusinessDomainService service;

    @GetMapping("/businesses")
    public List<BusinessResponse> listBusinesses(Authentication authentication) {
        return service.listBusinesses(actor(authentication));
    }

    @PostMapping("/businesses")
    public ResponseEntity<BusinessResponse> createBusiness(Authentication authentication, @Valid @RequestBody BusinessRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createBusiness(actor(authentication), request));
    }

    @GetMapping("/businesses/{id}")
    public BusinessResponse getBusiness(Authentication authentication, @PathVariable UUID id) {
        return service.getBusiness(actor(authentication), id);
    }

    @PutMapping("/businesses/{id}")
    public BusinessResponse updateBusiness(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody BusinessRequest request) {
        return service.updateBusiness(actor(authentication), id, request);
    }

    @DeleteMapping("/businesses/{id}")
    public ResponseEntity<Void> deleteBusiness(Authentication authentication, @PathVariable UUID id) {
        service.deleteBusiness(actor(authentication), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/businesses/{businessId}/establishments")
    public List<EstablishmentResponse> listEstablishments(Authentication authentication, @PathVariable UUID businessId) {
        return service.listEstablishments(actor(authentication), businessId);
    }

    @PostMapping("/businesses/{businessId}/establishments")
    public ResponseEntity<EstablishmentResponse> createEstablishment(Authentication authentication, @PathVariable UUID businessId, @Valid @RequestBody EstablishmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createEstablishment(actor(authentication), businessId, request));
    }

    @GetMapping("/establishments/{id}")
    public EstablishmentResponse getEstablishment(Authentication authentication, @PathVariable UUID id) {
        return service.getEstablishment(actor(authentication), id);
    }

    @PutMapping("/establishments/{id}")
    public EstablishmentResponse updateEstablishment(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody EstablishmentRequest request) {
        return service.updateEstablishment(actor(authentication), id, request);
    }

    @DeleteMapping("/establishments/{id}")
    public ResponseEntity<Void> deleteEstablishment(Authentication authentication, @PathVariable UUID id) {
        service.deleteEstablishment(actor(authentication), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/establishments/{establishmentId}/services")
    public List<BookingServiceResponse> listServices(Authentication authentication, @PathVariable UUID establishmentId) {
        return service.listBookingServices(actor(authentication), establishmentId);
    }

    @PostMapping("/establishments/{establishmentId}/services")
    public ResponseEntity<BookingServiceResponse> createService(Authentication authentication, @PathVariable UUID establishmentId, @Valid @RequestBody BookingServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createBookingService(actor(authentication), establishmentId, request));
    }

    @GetMapping("/services/{id}")
    public BookingServiceResponse getService(Authentication authentication, @PathVariable UUID id) {
        return service.getBookingService(actor(authentication), id);
    }

    @PutMapping("/services/{id}")
    public BookingServiceResponse updateService(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody BookingServiceRequest request) {
        return service.updateBookingService(actor(authentication), id, request);
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(Authentication authentication, @PathVariable UUID id) {
        service.deleteBookingService(actor(authentication), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/establishments/{establishmentId}/resources")
    public List<ResourceResponse> listResources(Authentication authentication, @PathVariable UUID establishmentId) {
        return service.listResources(actor(authentication), establishmentId);
    }

    @PostMapping("/establishments/{establishmentId}/resources")
    public ResponseEntity<ResourceResponse> createResource(Authentication authentication, @PathVariable UUID establishmentId, @Valid @RequestBody ResourceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createResource(actor(authentication), establishmentId, request));
    }

    @GetMapping("/resources/{id}")
    public ResourceResponse getResource(Authentication authentication, @PathVariable UUID id) {
        return service.getResource(actor(authentication), id);
    }

    @PutMapping("/resources/{id}")
    public ResourceResponse updateResource(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody ResourceRequest request) {
        return service.updateResource(actor(authentication), id, request);
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(Authentication authentication, @PathVariable UUID id) {
        service.deleteResource(actor(authentication), id);
        return ResponseEntity.noContent().build();
    }

    private Actor actor(Authentication authentication) {
        return Actor.from(authentication);
    }
}
