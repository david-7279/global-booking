package com.globalbooking.booking.dto.request;

import com.globalbooking.booking.domain.BookingStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * Query criteria used by the booking list endpoint.
 */
public record BookingFilter(
        BookingStatus status,
        UUID establishmentId,
        UUID bookingServiceId,
        UUID resourceId,
        Instant from,
        Instant to
) {
}
