package com.globalbooking.booking.dto;

import com.globalbooking.booking.domain.BookingStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public final class BookingDtos {
    private BookingDtos() {
    }

    public record CreateBookingRequest(
            @NotNull UUID businessId,
            @NotNull UUID establishmentId,
            @NotNull UUID bookingServiceId,
            @NotNull UUID resourceId,
            @NotNull @Future Instant startAt,
            @NotNull @Future Instant endAt,
            @Size(max = 1000) String notes) {
    }

    public record TransitionRequest(@Size(max = 500) String reason) {
    }

    public record BookingResponse(UUID id, UUID userId, UUID businessId, UUID establishmentId,
                                  UUID bookingServiceId, UUID resourceId, Instant startAt, Instant endAt,
                                  BookingStatus status, String notes, Instant createdAt, Instant updatedAt,
                                  Instant cancelledAt) {
    }

    public record AvailabilityRequest(@NotNull UUID establishmentId, @NotNull UUID bookingServiceId,
                                      @NotNull UUID resourceId, @NotNull @Future Instant from,
                                      @NotNull @Future Instant to) {
    }

    public record AvailabilityResponse(Instant startAt, Instant endAt, boolean available) {
    }
}
