package com.globalbooking.booking.dto.response;

import com.globalbooking.booking.domain.BookingStatus;

import java.time.Instant;
import java.util.UUID;

public record BookingFilterResponse(
        BookingStatus status,
        UUID establishmentId,
        UUID bookingServiceId,
        UUID resourceId,
        Instant from,
        Instant to
) {
}