package com.globalbooking.auth.service;

import com.globalbooking.auth.common.error.ErrorCode;
import com.globalbooking.auth.common.exception.ResourceNotFoundException;
import com.globalbooking.auth.common.exception.UnauthorizedException;
import com.globalbooking.auth.domain.RefreshToken;
import com.globalbooking.auth.domain.User;
import com.globalbooking.auth.dto.response.AuthResponse;
import com.globalbooking.auth.infrastructure.jwt.JwtService;
import com.globalbooking.auth.mapper.AuthMapper;
import com.globalbooking.auth.repository.RefreshTokenRepository;
import com.globalbooking.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 64;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Creates and persists a new refresh token for a user.
     * Only the SHA-256 hash is stored; the raw token is returned to the caller.
     */
    @Transactional
    public String createRefreshToken(User user) {
        revokeActiveTokens(user);

        UUID tokenId = UUID.randomUUID();
        String rawToken = generateSecureToken();
        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshTokenExpiration());

        RefreshToken refreshToken = new RefreshToken(
                tokenId,
                hashToken(rawToken),
                user,
                expiresAt
        );

        refreshTokenRepository.save(refreshToken);

        log.atDebug()
                .setMessage("Refresh token created for user")
                .addKeyValue("user_id", user.getPublicId())
                .log();
        return rawToken;
    }

    /**
     * Validates the supplied refresh token, rotates it and issues a new access token.
     */
    @Transactional
    public AuthResponse refresh(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw invalidRefreshToken();
        }

        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(this::invalidRefreshToken);

        validateRefreshToken(refreshToken);

        User user = refreshToken.getUser();

        if (user.isDeleted()) {
            throw new UnauthorizedException(
                    ErrorCode.AUTHENTICATION_FAILED,
                    "User account is no longer active"
            );
        }

        // Rotation – the used token can never be reused
        UUID newTokenId = UUID.randomUUID();
        refreshToken.revokeAndReplaceWith(newTokenId);

        String newRawRefreshToken = generateSecureToken();
        Instant expiresAt = Instant.now().plusMillis(jwtService.getRefreshTokenExpiration());

        RefreshToken newRefreshToken = new RefreshToken(
                newTokenId,
                hashToken(newRawRefreshToken),
                user,
                expiresAt
        );
        refreshTokenRepository.save(newRefreshToken);

        String accessToken = jwtService.generateAccessToken(user);

        log.atDebug()
                .setMessage("Refresh token rotated for user")
                .addKeyValue("user_id", user.getPublicId())
                .log();

        return AuthMapper.toAuthResponse(
                user,
                accessToken,
                newRawRefreshToken,
                jwtService.getAccessTokenExpiration()
        );
    }

    /**
     * Revokes a single refresh token (idempotent).
     */
    @Transactional
    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }

        String tokenHash = hashToken(rawToken);

        refreshTokenRepository
                .findByTokenHash(tokenHash)
                .ifPresent(token -> {
                    if (!token.isRevoked()) {
                        token.revoke();
                        log.atDebug()
                                .setMessage("Refresh token revoked for user")
                                .addKeyValue("user_id", token.getUser().getPublicId())
                                .log();
                    }
                });
    }

    /**
     * Revokes all active refresh tokens of a user (logout-all-devices, password change, etc.).
     */
    @Transactional
    public void revokeAll(User user) {
        int revoked = refreshTokenRepository.revokeAllActiveByUser(
                user,
                Instant.now(),
                Instant.now()
        );
        log.atDebug()
                .setMessage("Revoked {} refresh tokens for user")
                .addKeyValue("revoked", revoked)
                .addKeyValue("user_id", user.getPublicId())
                .log();
    }

    @Transactional
    public void revokeAll(UUID publicId) {
        User user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.USER_NOT_FOUND,
                        "User not found"
                ));
        revokeAll(user);
    }

    /**
     * Removes expired tokens (can be called by a scheduled job).
     */
    @Transactional
    public int deleteExpiredTokens() {
        int deleted = refreshTokenRepository.deleteExpiredTokens(Instant.now());
        log.atDebug()
                .setMessage("Deleted {} expired refresh tokens")
                .addKeyValue("deleted", deleted)
                .log();
        return deleted;
    }

    // ──────────────────── private helpers ────────────────────

    private void validateRefreshToken(RefreshToken refreshToken) {
        if (refreshToken.isRevoked()) {
            log.atWarn()
                    .setMessage("Attempt to reuse revoked refresh token")
                    .addKeyValue("event", "token_refresh_failed")
                    .addKeyValue("user_id", refreshToken.getUser().getPublicId())
                    .log();
            throw invalidRefreshToken();
        }
        if (refreshToken.isExpired()) {
            throw invalidRefreshToken();
        }
        if (refreshToken.getUser().isDeleted()) {
            throw new UnauthorizedException(
                    ErrorCode.AUTHENTICATION_FAILED,
                    "User account is no longer active"
            );
        }
    }

    private void revokeActiveTokens(User user) {
        refreshTokenRepository.revokeAllActiveByUser(
                user,
                Instant.now(),
                Instant.now()
        );
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 algorithm is not available", ex);
        }
    }

    private UnauthorizedException invalidRefreshToken() {
        return new UnauthorizedException(
                ErrorCode.AUTHENTICATION_FAILED,
                "Invalid refresh token"
        );
    }
}