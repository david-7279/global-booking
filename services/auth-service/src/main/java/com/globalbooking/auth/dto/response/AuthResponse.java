package com.globalbooking.auth.dto.response;

import java.util.UUID;

/**
 * Authentication response returned after successful authentication
 * or account registration.
 */
public record AuthResponse(
        TokenResponse token,
        UUID publicId,
        String username,
        String email,
        String role
) {
}