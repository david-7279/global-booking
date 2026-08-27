package com.globalbooking.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/*
 * Request DTO for register
 *
 * This DTO Is used to transfer data from the client to the server when a user registers.
 *
 * Valida via @Valid in the controller before the application layer -
 * malformed request are reject by GlobalExceptionHandler before any processing.
 *
 * Validation rules:
 *      - Username is required and must be between 3 and 120 characters
 *      - Email is required and must be a valid email address
 *      - Password is required and must be between 6 and 72 characters
 *        and must contain at least one uppercase letter and one number
 */

public record RegisterRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 120, message = "The username must be between 3 and 120 characters")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "The email must be a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 72, message = "The password must be between 6 and 72 characters")
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*\\d).{6,}$",
                message = "The password must contain at least one uppercase letter and one number"
        )
        String password
) {
}
