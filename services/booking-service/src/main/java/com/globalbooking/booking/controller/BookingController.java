package com.globalbooking.booking.controller;

import com.globalbooking.booking.dto.BookingDtos.*;
import com.globalbooking.booking.security.Actor;
import com.globalbooking.booking.service.BookingApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BookingController {
    private final BookingApplicationService service;

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> create(Authentication authentication, @RequestHeader(value = "Idempotency-Key", required = false) String key, @Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(Actor.from(authentication), request, key));
    }

    @GetMapping("/bookings")
    public Page<BookingResponse> list(Authentication authentication, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return service.list(Actor.from(authentication), PageRequest.of(Math.min(page, 1000), Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    @GetMapping("/bookings/{id}")
    public BookingResponse get(Authentication authentication, @PathVariable UUID id) {
        return service.get(Actor.from(authentication), id);
    }

    @PostMapping("/bookings/{id}/cancel")
    public BookingResponse cancel(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody(required = false) TransitionRequest request) {
        return service.cancel(Actor.from(authentication), id, request == null ? null : request.reason());
    }

    @PostMapping("/bookings/{id}/confirm")
    public BookingResponse confirm(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody(required = false) TransitionRequest request) {
        return service.confirm(Actor.from(authentication), id, request == null ? null : request.reason());
    }

    @PostMapping("/bookings/{id}/reject")
    public BookingResponse reject(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody(required = false) TransitionRequest request) {
        return service.reject(Actor.from(authentication), id, request == null ? null : request.reason());
    }

    @PostMapping("/bookings/{id}/complete")
    public BookingResponse complete(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody(required = false) TransitionRequest request) {
        return service.complete(Actor.from(authentication), id, request == null ? null : request.reason());
    }

    @GetMapping("/availability")
    public AvailabilityResponse availability(@Valid AvailabilityRequest request) {
        return service.availability(request);
    }
}
