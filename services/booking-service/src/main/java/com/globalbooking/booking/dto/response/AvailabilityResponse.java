package com.globalbooking.booking.dto.response;

import java.time.Instant;

public record AvailabilityResponse(
        Instant startAt,
        Instant endAt,
        boolean available
) {
}