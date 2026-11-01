package com.globalbooking.business.dto.response;

import java.time.Instant;
import java.util.UUID;

public record EstablishmentResponse(
            UUID id,
            UUID businessId,
            String name,
            String address,
            String timezone,
            String status,
            Instant createdAt,
            Instant updatedAt) {
    }