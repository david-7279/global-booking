package com.globalbooking.auth.dto.response;

import lombok.Builder;

/*
 * Response DTO representing the access token envelope returned to the client
 * after successful authentication or token renewal.
 * The response includes the access token, the token type, and the time until the token expires.
 *
 * Embedded within {LoginResponse} and returned directly by the refresh token endpoint.
 *
 * Factory Method:
 *  - {TokenResponse.of(String, String, long)}: It accepts the raw expiration value in milliseconds
 *    and converts it to seconds, ensuring the contract with RC6750 is always respected
 *    without requiring callers to perform the conversion manually.
 */

@Builder
public record TokenResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn
) {
    private static final String BEARER = "Bearer";

    public static TokenResponse of(
            String accessToken,
            String refreshToken,
            long expiresInMs
    ) {
        return new TokenResponse(
                accessToken,
                refreshToken,
                BEARER,
                expiresInMs / 1000
        );
    }
}