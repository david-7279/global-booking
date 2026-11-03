package com.globalbooking.business.dto.response;

import java.time.Instant;
import java.util.UUID;

public record BookingServiceResponse(
        UUID id,
        UUID establishmentId,
        String name,
        String description,
        int durationMinutes,
        long priceCents,
        String currency,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}