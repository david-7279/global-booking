package com.globalbooking.auth.dto.response;

import com.globalbooking.auth.domain.Role;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Public representation of an authenticated user.
 */
public record UserResponse(
        UUID publicId,
        String username,
        String email,
        Role role,
        LocalDateTime createdAt
) {
}