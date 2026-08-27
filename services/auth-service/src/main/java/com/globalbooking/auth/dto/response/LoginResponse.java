package com.globalbooking.auth.dto.response;

import java.util.UUID;

/*
 * Response DTO returned by the login endpoint.
 *
 * Combines issue access token with the essential user profile fields.
 *
 * Fields:
 *  - token - access token envelope containing the signed JWT,
 *    token type and expiration time.
 *  - publicId - the user's public UUID, safe to expose in URLs and client state;
 *    never the internal database ID.
 *  - username - display name of the authenticated user
 *  - email - email address of the authenticated user
 *  - role - string representation of the user's role.
 */

public record LoginResponse(
        TokenResponse token,
        UUID publicId,
        String username,
        String email,
        String role
) {
}
