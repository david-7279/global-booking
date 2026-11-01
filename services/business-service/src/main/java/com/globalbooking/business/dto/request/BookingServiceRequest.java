package com.globalbooking.business.dto.request;

import jakarta.validation.constraints.*;

public record BookingServiceRequest(
        @NotBlank @Size(max = 160)
        String name,

        @Size(max = 1000)
        String description,

        @Min(1)
        @Max(1440)
        int durationMinutes,

        @Min(0)
        long priceCents,

        @Pattern(regexp = "[A-Z]{3}")
        String currency) {
}
