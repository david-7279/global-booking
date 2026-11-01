package com.globalbooking.business.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BusinessRequest(
        @NotBlank @Size(max = 160)
        String name,

        @Size(max = 1000)
        String description) {
}