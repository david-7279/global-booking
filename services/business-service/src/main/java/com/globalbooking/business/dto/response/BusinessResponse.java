package com.globalbooking.business.dto.response;

import java.time.Instant;
import java.util.UUID;

public record BusinessResponse(
        UUID id,
        UUID ownerUserId,
        String name,
        String description,
        String status,
        Instant createdAt,
        Instant updatedAt) {
}
