package com.globalbooking.business.api;

import jakarta.validation.constraints.*;

import java.time.Instant;
import java.util.UUID;

public final class BusinessDtos {
    private BusinessDtos() {
    }

    public record BusinessRequest(
            @NotBlank @Size(max = 160) String name,
            @Size(max = 1000) String description) {
    }

    public record EstablishmentRequest(
            @NotBlank @Size(max = 160) String name,
            @Size(max = 500) String address,
            @NotBlank @Size(max = 80) String timezone) {
    }

    public record BookingServiceRequest(
            @NotBlank @Size(max = 160) String name,
            @Size(max = 1000) String description,
            @Min(1) @Max(1440) int durationMinutes,
            @Min(0) long priceCents,
            @Pattern(regexp = "[A-Z]{3}") String currency) {
    }

    public record ResourceRequest(
            @NotBlank @Size(max = 160) String name,
            @NotBlank @Size(max = 80) String resourceType,
            @Min(1) @Max(100000) int capacity) {
    }

    public record BusinessResponse(
            UUID id,
            UUID ownerUserId,
            String name,
            String description,
            String status,
            Instant createdAt,
            Instant updatedAt) {
    }

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
            Instant updatedAt) {
    }

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
}
