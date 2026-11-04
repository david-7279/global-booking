package com.globalbooking.booking.controller;

import com.globalbooking.booking.domain.BookingStatus;
import com.globalbooking.booking.dto.request.AvailabilityRequest;
import com.globalbooking.booking.dto.request.BookingFilter;
import com.globalbooking.booking.dto.request.CreateBookingRequest;
import com.globalbooking.booking.dto.request.TransitionRequest;
import com.globalbooking.booking.dto.response.AvailabilityResponse;
import com.globalbooking.booking.dto.response.BookingResponse;
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

import java.time.Instant;
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
    public Page<BookingResponse> list(Authentication authentication, @RequestParam(required = false) BookingStatus status, @RequestParam(required = false) UUID establishmentId, @RequestParam(required = false) UUID bookingServiceId, @RequestParam(required = false) UUID resourceId, @RequestParam(required = false) Instant from, @RequestParam(required = false) Instant to, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, @RequestParam(defaultValue = "createdAt,desc") String sort) {
        String[] sortParts = sort.split(",", 2);
        String property = switch (sortParts[0]) {
            case "createdAt", "updatedAt", "startAt", "endAt", "status" -> sortParts[0];
            default -> "createdAt";
        };
        Sort.Direction direction = sortParts.length == 2 && "asc".equalsIgnoreCase(sortParts[1]) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return service.list(Actor.from(authentication), new BookingFilter(status, establishmentId, bookingServiceId, resourceId, from, to), PageRequest.of(Math.min(Math.max(page, 0), 1000), Math.min(Math.max(size, 1), 100), Sort.by(direction, property)));
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
