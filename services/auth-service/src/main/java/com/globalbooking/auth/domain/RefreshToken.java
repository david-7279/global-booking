package com.globalbooking.auth.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Represents a persisted refresh token session.
 * Only the SHA-256 hash of the raw refresh token is persisted.
 * The raw token must never be stored in the database.
 * Refresh tokens are rotated after successful use. The previous token
 * is revoked and points to the replacement token through {@code replacedBy}.
 */
@Entity
@Table(name = "refresh_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    /**
     * Internal database identifier.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * JWT ID (jti) of this refresh token.
     * Each refresh token receives a unique identifier. This identifier
     * allows the token to be correlated with its persisted session and
     * its rotation chain without storing the raw JWT.
     */
    @Column(name = "token_id", nullable = false, unique = true, updatable = false)
    private UUID tokenId;

    /**
     * SHA-256 hash of the raw refresh token.
     * The raw refresh token must never be persisted. Since refresh tokens
     * are generated using cryptographically secure randomness, SHA-256
     * is appropriate for deterministic lookup without requiring a
     * password-style adaptive hash.
     */
    @Column(name = "token_hash", nullable = false, unique = true, updatable = false, length = 64)
    private String tokenHash;

    /**
     * User who owns this refresh token.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_refresh_tokens_user"))
    private User user;

    /**
     * Absolute expiration time of the refresh token.
     */
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    /**
     * Time at which this token was revoked.
     * {@code null} means the token has not been revoked.
     */
    @Column(name = "revoked_at")
    private Instant revokedAt;

    /**
     * JWT ID of the refresh token that replaced this token.
     * This is populated during refresh-token rotation.
     */
    @Column(name = "replaced_by")
    private UUID replacedBy;

    /**
     * Token creation timestamp.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * Creates a new persisted refresh-token session.
     *
     * @param tokenId   JWT ID (jti) of the refresh token
     * @param tokenHash SHA-256 hash of the raw refresh token
     * @param user      token owner
     * @param expiresAt token expiration timestamp
     */
    public RefreshToken(
            UUID tokenId,
            String tokenHash,
            User user,
            Instant expiresAt
    ) {
        if (tokenId == null) {
            throw new IllegalArgumentException(
                    "Token ID must not be null"
            );
        }

        if (tokenHash == null || tokenHash.isBlank()) {
            throw new IllegalArgumentException(
                    "Token hash must not be blank"
            );
        }

        if (user == null) {
            throw new IllegalArgumentException(
                    "User must not be null"
            );
        }

        if (expiresAt == null) {
            throw new IllegalArgumentException(
                    "Expiration must not be null"
            );
        }

        Instant now = Instant.now();

        if (!expiresAt.isAfter(now)) {
            throw new IllegalArgumentException(
                    "Expiration must be in the future"
            );
        }

        this.tokenId = tokenId;
        this.tokenHash = tokenHash;
        this.user = user;
        this.expiresAt = expiresAt;
        this.createdAt = now;
    }

    // ──────────────────── DOMAIN STATE ────────────────────

    /**
     * Returns whether this refresh token has expired.
     */
    public boolean isExpired() {
        return !expiresAt.isAfter(Instant.now());
    }

    /**
     * Returns whether this refresh token has been revoked.
     */
    public boolean isRevoked() {
        return revokedAt != null;
    }

    /**
     * Returns whether this refresh token can currently be used.
     */
    public boolean isActive() {
        return !isRevoked() && !isExpired();
    }

    // ──────────────────── DOMAIN OPERATIONS ────────────────────

    /**
     * Revokes this refresh token.
     * The operation is idempotent. Calling it multiple times does not
     * modify an already revoked token.
     */
    public void revoke() {
        if (isRevoked()) {
            return;
        }

        this.revokedAt = Instant.now();
    }

    /**
     * Revokes this token as part of refresh-token rotation.
     *
     * @param replacementTokenId JWT ID of the newly issued refresh token
     */
    public void revokeAndReplaceWith(UUID replacementTokenId) {
        if (replacementTokenId == null) {
            throw new IllegalArgumentException(
                    "Replacement token ID must not be null"
            );
        }

        if (replacementTokenId.equals(this.tokenId)) {
            throw new IllegalArgumentException(
                    "A refresh token cannot replace itself"
            );
        }

        if (isRevoked()) {
            throw new IllegalStateException(
                    "Refresh token has already been revoked"
            );
        }

        this.revokedAt = Instant.now();
        this.replacedBy = replacementTokenId;
    }
}