package com.globalbooking.business.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EstablishmentRequest(
        @NotBlank
        @Size(max = 160)
        String name,

        @Size(max = 500)
        String address,

        @NotBlank
        @Size(max = 80)
        String timezone) {
}