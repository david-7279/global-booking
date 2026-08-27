package com.globalbooking.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/*
 * Request DTO for login
 *
 * This DTO is used to receive login requests from the client.
 *
 * Validate via @Valid in the controller before reaching the application layer -
 * malformed request are rejected by GlobalExceptionHandler before any
 * authentication logic is invoked.
 *
 * Validation rules:
 *      - Email is required and must be in a valid format
 *      - Password is required
 */

public record LoginRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}
