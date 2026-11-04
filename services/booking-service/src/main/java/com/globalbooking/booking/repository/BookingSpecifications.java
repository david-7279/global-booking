package com.globalbooking.booking.repository;

import com.globalbooking.booking.domain.Booking;
import com.globalbooking.booking.domain.BookingStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.UUID;

public final class BookingSpecifications {
    private BookingSpecifications() {
    }

    public static Specification<Booking> user(UUID userId) {
        return (root, q, cb) -> cb.equal(root.get("userId"), userId);
    }

    public static Specification<Booking> status(BookingStatus status) {
        return (root, q, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Booking> establishment(UUID id) {
        return (root, q, cb) -> cb.equal(root.get("establishmentId"), id);
    }

    public static Specification<Booking> bookingService(UUID id) {
        return (root, q, cb) -> cb.equal(root.get("bookingServiceId"), id);
    }

    public static Specification<Booking> resource(UUID id) {
        return (root, q, cb) -> cb.equal(root.get("resourceId"), id);
    }

    public static Specification<Booking> startsBefore(Instant value) {
        return (root, q, cb) -> cb.lessThan(root.get("startAt"), value);
    }

    public static Specification<Booking> endsAfter(Instant value) {
        return (root, q, cb) -> cb.greaterThan(root.get("endAt"), value);
    }
}
