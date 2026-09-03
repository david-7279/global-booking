package com.globalbooking.auth.service;

import com.globalbooking.auth.common.error.ErrorCode;
import com.globalbooking.auth.common.exception.ConflictException;
import com.globalbooking.auth.common.exception.ResourceNotFoundException;
import com.globalbooking.auth.common.exception.UnauthorizedException;
import com.globalbooking.auth.domain.Role;
import com.globalbooking.auth.domain.Status;
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
    private final RefreshTokenService refreshTokenService;

    /**
     * Registers a new user account and creates an authentication session.
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

        String passwordHash = passwordEncoder.encode(
                request.password()
        );

        User user = new User(
                username,
                email,
                passwordHash,
                Role.USER,
                Status.ACTIVE
        );

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);

        String refreshToken =
                refreshTokenService.createRefreshToken(user);

        log.info(
                "User registered successfully: {}",
                user.getPublicId()
        );

        return AuthMapper.toAuthResponse(
                user,
                accessToken,
                refreshToken,
                jwtService.getAccessTokenExpiration()
        );
    }

    /**
     * Authenticates a user using email and password.
     */
    @Transactional
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

        String accessToken =
                jwtService.generateAccessToken(user);

        String refreshToken =
                refreshTokenService.createRefreshToken(user);

        log.info(
                "User authenticated successfully: {}",
                user.getPublicId()
        );

        return AuthMapper.toAuthResponse(
                user,
                accessToken,
                refreshToken,
                jwtService.getAccessTokenExpiration()
        );
    }

    /**
     * Updates mutable user account fields.
     * A new access and refresh token pair is issued after
     * a successful account update.
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

        String accessToken =
                jwtService.generateAccessToken(user);

        String refreshToken =
                refreshTokenService.createRefreshToken(user);

        log.info(
                "User updated successfully: {}",
                user.getPublicId()
        );

        return AuthMapper.toAuthResponse(
                user,
                accessToken,
                refreshToken,
                jwtService.getAccessTokenExpiration()
        );
    }

    /**
     * Soft-deletes a user account and revokes all refresh tokens.
     */
    @Transactional
    public void delete(UUID publicId) {
        User user = findByPublicId(publicId);

        /*
         * Revoke all refresh tokens before deleting the account.
         * This prevents existing sessions from being refreshed.
         */
        refreshTokenService.revokeAll(user);

        userRepository.delete(user);

        log.info(
                "User account deleted successfully: {}",
                publicId
        );
    }

    /**
     * Logs out the current session by revoking the supplied refresh token.
     * Access tokens are stateless JWTs and cannot be invalidated directly.
     * They remain valid until their configured expiration time.
     * The refresh token, however, is persisted and can be revoked immediately.
     */
    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenService.revoke(rawRefreshToken);

        log.info("User logout successfully processed");
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