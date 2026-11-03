package com.globalbooking.booking.dto.request;

import jakarta.validation.constraints.Size;

public record TransitionRequest(
        @Size(max = 500)
        String reason
) {
}
