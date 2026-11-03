package com.globalbooking.booking.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record AvailabilityRequest(
        @NotNull
        UUID establishmentId,

        @NotNull
        UUID bookingServiceId,

        @NotNull
        UUID resourceId,

        @NotNull
        @Future
        Instant from,

        @NotNull
        @Future
        Instant to
) {
}