package com.globalbooking.booking.security;

import org.springframework.security.core.Authentication;

import java.util.UUID;

public record Actor(UUID userId, String role) {
    public static Actor from(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Actor actor))
            throw new IllegalStateException("Authenticated actor is required");
        return actor;
    }

    public boolean isAdmin() {
        return "ADMIN".equals(role) || "SUPERVISOR".equals(role);
    }

    public boolean isOperator() {
        return "OPERATOR".equals(role);
    }
}
