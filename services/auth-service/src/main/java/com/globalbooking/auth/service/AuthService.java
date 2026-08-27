package com.globalbooking.auth.service;

import com.globalbooking.auth.common.error.ErrorCode;
import com.globalbooking.auth.common.exception.ConflictException;
import com.globalbooking.auth.common.exception.ResourceNotFoundException;
import com.globalbooking.auth.common.exception.UnauthorizedException;
import com.globalbooking.auth.domain.Role;
import com.globalbooking.auth.domain.User;
import com.globalbooking.auth.dto.request.LoginRequest;
import com.globalbooking.auth.dto.request.RegisterRequest;
import com.globalbooking.auth.dto.response.AuthResponse;
import com.globalbooking.auth.infrastructure.jwt.JwtService;
import com.globalbooking.auth.mapper.AuthMapper;
import com.globalbooking.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Registers a new user account.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String username = request.username().trim();
        String email = normalizeEmail(request.email());

        if (userRepository.existsByUsername(username)) {
            throw new ConflictException(
                    ErrorCode.USER_ALREADY_EXISTS,
                    "Username is already in use"
            );
        }

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException(
                    ErrorCode.USER_ALREADY_EXISTS,
                    "Email is already in use"
            );
        }

        String passwordHash = passwordEncoder.encode(request.password());

        User user = new User(
                username,
                email,
                passwordHash,
                Role.USER
        );

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);

        log.info("User registered successfully");

        return AuthMapper.toAuthResponse(
                user,
                accessToken,
                jwtService.getAccessTokenExpiration()
        );
    }

    /**
     * Authenticates a user using email and password.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UnauthorizedException(
                                ErrorCode.INVALID_CREDENTIALS,
                                "Invalid credentials"
                        )
                );

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        )) {
            throw new UnauthorizedException(
                    ErrorCode.INVALID_CREDENTIALS,
                    "Invalid credentials"
            );
        }

        String accessToken = jwtService.generateAccessToken(user);

        log.info("User authenticated successfully");

        return AuthMapper.toAuthResponse(
                user,
                accessToken,
                jwtService.getAccessTokenExpiration()
        );
    }

    /**
     * Updates mutable user account fields.
     */
    @Transactional
    public AuthResponse update(
            UUID publicId,
            String username,
            String email,
            String password
    ) {
        User user = findByPublicId(publicId);

        if (username != null && !username.isBlank()) {
            String normalizedUsername = username.trim();

            if (!normalizedUsername.equals(user.getUsername())
                    && userRepository.existsByUsername(normalizedUsername)) {
                throw new ConflictException(
                        ErrorCode.USER_ALREADY_EXISTS,
                        "Username is already in use"
                );
            }

            user.updateUsername(normalizedUsername);
        }

        if (email != null && !email.isBlank()) {
            String normalizedEmail = normalizeEmail(email);

            if (!normalizedEmail.equals(user.getEmail())
                    && userRepository.existsByEmail(normalizedEmail)) {
                throw new ConflictException(
                        ErrorCode.USER_ALREADY_EXISTS,
                        "Email is already in use"
                );
            }

            user.updateEmail(normalizedEmail);
        }

        if (password != null && !password.isBlank()) {
            user.updatePasswordHash(
                    passwordEncoder.encode(password)
            );
        }

        String accessToken = jwtService.generateAccessToken(user);

        log.info("User updated successfully");

        return AuthMapper.toAuthResponse(
                user,
                accessToken,
                jwtService.getAccessTokenExpiration()
        );
    }

    /**
     * Soft-deletes a user account.
     */
    @Transactional
    public void delete(UUID publicId) {
        User user = findByPublicId(publicId);

        userRepository.delete(user);

        log.info("User account deleted successfully");
    }

    /**
     * Logs out the current user.
     *
     * Access tokens are stateless and remain valid until expiration.
     * Token revocation will be handled when refresh-token persistence is introduced.
     */
    @Transactional(readOnly = true)
    public void logout() {
        log.info("User logout requested - Refresh token in development");
    }

    private User findByPublicId(UUID publicId) {
        return userRepository.findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                ErrorCode.USER_NOT_FOUND,
                                "User not found"
                        )
                );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}