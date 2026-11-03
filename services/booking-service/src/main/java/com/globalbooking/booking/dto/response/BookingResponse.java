package com.globalbooking.booking.dto.response;

import com.globalbooking.booking.domain.BookingStatus;

import java.time.Instant;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        UUID userId,
        UUID businessId,
        UUID establishmentId,
        UUID bookingServiceId,
        UUID resourceId,
        Instant startAt,
        Instant endAt,
        BookingStatus status,
        String notes,
        Instant createdAt,
        Instant updatedAt,
        Instant cancelledAt
) {
}
