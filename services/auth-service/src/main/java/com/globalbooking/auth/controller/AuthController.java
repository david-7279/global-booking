package com.globalbooking.auth.controller;

import com.globalbooking.auth.dto.request.LoginRequest;
import com.globalbooking.auth.dto.request.LogoutRequest;
import com.globalbooking.auth.dto.request.RefreshRequest;
import com.globalbooking.auth.dto.request.RegisterRequest;
import com.globalbooking.auth.dto.response.AuthResponse;
import com.globalbooking.auth.dto.response.UserResponse;
import com.globalbooking.auth.service.AuthService;
import com.globalbooking.auth.service.RefreshTokenService;
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
    private final RefreshTokenService refreshTokenService;

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
     * Authenticates a user and returns access and refresh tokens.
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
     * Revokes the supplied refresh token.
     * The access token remains technically valid until its expiration,
     * since access tokens are stateless JWTs.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @Valid @RequestBody LogoutRequest request
    ) {
        authService.logout(request.refreshToken());

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

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @Valid @RequestBody RefreshRequest request
    ) {
        return ResponseEntity.ok(
                refreshTokenService.refresh(request.refreshToken())
        );
    }
}