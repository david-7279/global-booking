package com.globalbooking.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Request used to invalidate the current refresh-token session.
 */
public record LogoutRequest(
        @NotBlank(message = "Refresh token must not be blank")
        String refreshToken
) {
}