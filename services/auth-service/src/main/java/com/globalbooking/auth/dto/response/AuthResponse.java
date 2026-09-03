package com.globalbooking.auth.dto.response;

/**
 * Authentication response containing the issued token and user profile.
 */
public record AuthResponse(
        TokenResponse tokens,
        UserResponse user
) {
}