package com.globalbooking.auth.controller;

import com.globalbooking.auth.dto.request.LoginRequest;
import com.globalbooking.auth.dto.request.RegisterRequest;
import com.globalbooking.auth.dto.response.AuthResponse;
import com.globalbooking.auth.dto.response.UserResponse;
import com.globalbooking.auth.service.AuthService;
import com.globalbooking.auth.service.SecurityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for user authentication and account access.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final SecurityService securityService;

    /**
     * Creates a new user account and authenticates the user.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Authenticates a user and returns an access token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    /**
     * Logs out the current user.
     * <p>
     * JWT access tokens are stateless and cannot be invalidated directly.
     * Refresh-token revocation should be handled once refresh tokens are persisted.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logout();

        return ResponseEntity.noContent().build();
    }

    /**
     * Returns the currently authenticated user's public profile.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        return ResponseEntity.ok(
                securityService.getAuthenticatedUserResponse()
        );
    }
}