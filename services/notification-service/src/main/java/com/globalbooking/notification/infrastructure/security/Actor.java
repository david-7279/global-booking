package com.globalbooking.notification.infrastructure.security;

import org.springframework.security.core.Authentication;

import java.util.UUID;

/**
 * Authenticated caller, built from the JWT claims issued by the auth-service.
 */
public record Actor(UUID userId, String role) {

    public static Actor from(Authentication authentication) {
        return (Actor) authentication.getPrincipal();
    }

    public boolean isAdmin() {
        return "ADMIN".equals(role) || "SUPERVISOR".equals(role);
    }

    public boolean isOperator() {
        return "BUSINESS_OWNER".equals(role);
    }

    public boolean canManage() {
        return isAdmin() || isOperator();
    }
}
