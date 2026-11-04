package com.globalbooking.notification.infrastructure.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.Instant;
import java.util.UUID;

/**
 * Booking snapshot published by the booking-service inside {@code data}.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record BookingEventData(
        UUID id,
        UUID userId,
        UUID businessId,
        UUID establishmentId,
        UUID bookingServiceId,
        UUID resourceId,
        Instant startAt,
        Instant endAt,
        String status,
        String notes,
        Instant createdAt,
        Instant updatedAt,
        Instant cancelledAt
) {
}
