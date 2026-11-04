package com.globalbooking.booking.dto.response;

import java.util.UUID;

/**
 * Read model returned by the business-service catalog API.
 */
public record CatalogItem(
        UUID id,
        UUID ownerUserId,
        UUID businessId,
        UUID establishmentId,
        Integer durationMinutes,
        Integer capacity,
        String timezone,
        String status
) {
}
