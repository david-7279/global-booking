package com.globalbooking.booking.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public record CreateBookingRequest(
        @NotNull
        UUID businessId,

        @NotNull
        UUID establishmentId,

        @NotNull
        UUID bookingServiceId,

        @NotNull
        UUID resourceId,

        @NotNull
        @Future
        Instant startAt,

        @NotNull
        @Future
        Instant endAt,

        @Size(max = 1000)
        String notes
) {
}