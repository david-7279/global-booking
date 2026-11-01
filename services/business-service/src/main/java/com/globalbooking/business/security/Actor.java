package com.globalbooking.business.security;

import org.springframework.security.core.Authentication;

import java.util.UUID;

public record Actor(UUID userId, String role) {
    public static Actor from(Authentication authentication) {
        return (Actor) authentication.getPrincipal();
    }

    public boolean isAdmin() {
        return "ADMIN".equals(role) || "SUPERVISOR".equals(role);
    }

    public boolean canManage() {
        return isAdmin() || "OPERATOR".equals(role);
    }
}
