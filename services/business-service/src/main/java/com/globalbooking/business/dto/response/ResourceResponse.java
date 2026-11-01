package com.globalbooking.business.dto.response;

import java.time.Instant;
import java.util.UUID;

public record ResourceResponse(
        UUID id,
        UUID establishmentId,
        String name,
        String resourceType,
        int capacity,
        String status,
        Instant createdAt,
        Instant updatedAt) {
}