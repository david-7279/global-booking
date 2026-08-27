package com.globalbooking.auth.mapper;

import com.globalbooking.auth.domain.User;
import com.globalbooking.auth.dto.response.AuthResponse;
import com.globalbooking.auth.dto.response.TokenResponse;
import com.globalbooking.auth.dto.response.UserResponse;

/**
 * Maps authentication domain objects to API response DTOs.
 */
public final class AuthMapper {

    private AuthMapper() {
    }

    public static AuthResponse toAuthResponse(
            User user,
            String accessToken,
            String refreshToken,
            long expiresInMs
    ) {
        return new AuthResponse(
                TokenResponse.of(accessToken, refreshToken, expiresInMs),
                toUserResponse(user)
        );
    }

    public static UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getPublicId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}