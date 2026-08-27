package com.globalbooking.auth.mapper;

import com.globalbooking.auth.domain.User;
import com.globalbooking.auth.dto.response.AuthResponse;
import com.globalbooking.auth.dto.response.TokenResponse;

public final class AuthMapper {

    private AuthMapper() {
    }

    public static AuthResponse toAuthResponse(
            User user,
            String accessToken,
            long expiresInMs
    ) {
        return new AuthResponse(
                TokenResponse.of(accessToken, expiresInMs),
                user.getPublicId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}