package com.globalbooking.auth.infrastructure.jwt;

import com.globalbooking.auth.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private static final String CLAIM_TOKEN_TYPE = "type";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_STATUS = "status";

    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";

    private final JwtProperties jwtProperties;
    private final SecretKey secretKey;

    // ──────────────────── TOKEN GENERATION ────────────────────

    /**
     * Generates a short-lived JWT access token for the given user.
     *
     * The token contains:
     * - subject: user's public ID
     * - jti: unique token identifier
     * - role: user's current role
     * - status: user's status at token creation time
     * - token type: access
     * - issuer
     * - audience
     * - issued-at timestamp
     * - expiration timestamp
     */
    public String generateAccessToken(User user) {
        validateUser(user);

        return generateToken(
                user.getPublicId(),
                user.getRole().name(),
                user.getStatus().name(),
                ACCESS_TOKEN_TYPE,
                jwtProperties.getAccessTokenExpiration()
        );
    }

    /**
     * Generates a long-lived JWT refresh token for the given user.
     *
     * Refresh tokens intentionally contain no role or status claims.
     * The user's current state must be resolved from the database when
     * the refresh token is used.
     */
    public String generateRefreshToken(User user) {
        validateUser(user);

        return generateToken(
                user.getPublicId(),
                null,
                null,
                REFRESH_TOKEN_TYPE,
                jwtProperties.getRefreshTokenExpiration()
        );
    }

    /**
     * Generates a signed JWT.
     */
    private String generateToken(
            UUID publicId,
            String role,
            String status,
            String tokenType,
            long expirationMs
    ) {
        if (publicId == null) {
            throw new IllegalArgumentException(
                    "Public ID must not be null"
            );
        }

        if (tokenType == null || tokenType.isBlank()) {
            throw new IllegalArgumentException(
                    "Token type must not be blank"
            );
        }

        if (expirationMs <= 0) {
            throw new IllegalArgumentException(
                    "Token expiration must be greater than zero"
            );
        }

        Instant issuedAt = Instant.now();
        Instant expiration = issuedAt.plusMillis(expirationMs);

        UUID tokenId = UUID.randomUUID();

        var builder = Jwts.builder()
                .id(tokenId.toString())
                .subject(publicId.toString())
                .claim(CLAIM_TOKEN_TYPE, tokenType)
                .issuer(jwtProperties.getIssuer())
                .audience()
                .add(jwtProperties.getAudience())
                .and()
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(expiration))
                .signWith(secretKey, Jwts.SIG.HS256);

        if (role != null && !role.isBlank()) {
            builder.claim(CLAIM_ROLE, role);
        }

        if (status != null && !status.isBlank()) {
            builder.claim(CLAIM_STATUS, status);
        }

        return builder.compact();
    }

    // ──────────────────── TOKEN PARSING ────────────────────

    /**
     * Parses and cryptographically validates a JWT.
     *
     * Validation includes:
     * - signature
     * - issuer
     * - audience
     * - expiration
     * - JWT structure
     *
     * The returned Claims object should be reused by callers whenever
     * multiple claims need to be read from the same token.
     */
    private Claims extractAllClaims(String token) {
        if (token == null || token.isBlank()) {
            throw new JwtException("JWT must not be blank");
        }

        return Jwts.parser()
                .verifyWith(secretKey)
                .requireIssuer(jwtProperties.getIssuer())
                .requireAudience(jwtProperties.getAudience())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Parses and validates an access token.
     *
     * The JWT is cryptographically validated and its token type is
     * verified before the claims are returned.
     */
    public Claims parseAndValidateAccessToken(String token) {
        Claims claims = extractAllClaims(token);

        requireAccessToken(claims);

        return claims;
    }

    // ──────────────────── CLAIM EXTRACTION ────────────────────

    /**
     * Extracts the user's public identifier from a validated JWT.
     */
    public UUID extractPublicId(Claims claims) {
        String subject = claims.getSubject();

        if (subject == null || subject.isBlank()) {
            throw new JwtException("JWT subject is missing");
        }

        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException ex) {
            throw new JwtException(
                    "JWT subject is invalid",
                    ex
            );
        }
    }

    /**
     * Extracts the JWT ID (jti).
     */
    public UUID extractTokenId(Claims claims) {
        String tokenId = claims.getId();

        if (tokenId == null || tokenId.isBlank()) {
            throw new JwtException("JWT ID is missing");
        }

        try {
            return UUID.fromString(tokenId);
        } catch (IllegalArgumentException ex) {
            throw new JwtException(
                    "JWT ID is invalid",
                    ex
            );
        }
    }

    /**
     * Extracts the token type from validated claims.
     */
    public String extractTokenType(Claims claims) {
        String tokenType = claims.get(
                CLAIM_TOKEN_TYPE,
                String.class
        );

        if (tokenType == null || tokenType.isBlank()) {
            throw new JwtException(
                    "JWT token type is missing"
            );
        }

        return tokenType;
    }

    /**
     * Extracts the role from an access token.
     */
    public String extractRole(Claims claims) {
        requireTokenType(
                claims,
                ACCESS_TOKEN_TYPE
        );

        String role = claims.get(
                CLAIM_ROLE,
                String.class
        );

        if (role == null || role.isBlank()) {
            throw new JwtException(
                    "JWT role claim is missing"
            );
        }

        return role;
    }

    /**
     * Extracts the status from an access token.
     *
     * Important:
     * This represents the status when the token was issued.
     * It must NOT be treated as the authoritative source of the
     * user's current account status.
     */
    public String extractStatus(Claims claims) {
        requireTokenType(
                claims,
                ACCESS_TOKEN_TYPE
        );

        String status = claims.get(
                CLAIM_STATUS,
                String.class
        );

        if (status == null || status.isBlank()) {
            throw new JwtException(
                    "JWT status claim is missing"
            );
        }

        return status;
    }

    /**
     * Returns the expiration timestamp from validated claims.
     */
    public Instant extractExpiration(Claims claims) {
        Date expiration = claims.getExpiration();

        if (expiration == null) {
            throw new JwtException(
                    "JWT expiration is missing"
            );
        }

        return expiration.toInstant();
    }

    // ──────────────────── TOKEN VALIDATION ────────────────────

    /**
     * Validates an access token.
     */
    public boolean isAccessTokenValid(String token) {
        return isTokenValid(
                token,
                ACCESS_TOKEN_TYPE
        );
    }

    /**
     * Validates a refresh token.
     *
     * This validates the JWT itself only.
     * Persistence-level checks such as:
     * - revocation
     * - rotation
     * - user status
     * - token existence
     *
     * are handled by RefreshTokenService.
     */
    public boolean isRefreshTokenValid(String token) {
        return isTokenValid(
                token,
                REFRESH_TOKEN_TYPE
        );
    }

    /**
     * Validates a JWT and verifies its expected token type.
     */
    private boolean isTokenValid(
            String token,
            String expectedTokenType
    ) {
        if (token == null || token.isBlank()) {
            return false;
        }

        if (expectedTokenType == null
                || expectedTokenType.isBlank()) {
            return false;
        }

        try {
            Claims claims = extractAllClaims(token);

            String subject = claims.getSubject();
            String tokenId = claims.getId();
            String tokenType = extractTokenType(claims);
            Date expiration = claims.getExpiration();

            return subject != null
                    && !subject.isBlank()
                    && tokenId != null
                    && !tokenId.isBlank()
                    && expectedTokenType.equals(tokenType)
                    && expiration != null
                    && expiration.after(new Date());

        } catch (ExpiredJwtException ex) {
            log.atWarn()
                    .setMessage("JWT validation failed")
                    .addKeyValue("event", "invalid_jwt")
                    .addKeyValue("reason", "expired")
                    .log();
        } catch (JwtException | IllegalArgumentException ex) {
            log.atWarn()
                    .setMessage("JWT validation failed")
                    .addKeyValue("event", "invalid_jwt")
                    .addKeyValue("reason", "invalid")
                    .log();
        }

        return false;
    }

    // ──────────────────── TOKEN TYPE REQUIREMENTS ────────────────────

    /**
     * Requires the supplied JWT claims to represent a refresh token.
     */
    public void requireRefreshToken(Claims claims) {
        requireTokenType(
                claims,
                REFRESH_TOKEN_TYPE
        );
    }

    /**
     * Requires the supplied JWT claims to represent an access token.
     */
    public void requireAccessToken(Claims claims) {
        requireTokenType(
                claims,
                ACCESS_TOKEN_TYPE
        );
    }

    /**
     * Verifies the token type contained in already validated claims.
     */
    private void requireTokenType(
            Claims claims,
            String expectedTokenType
    ) {
        String actualTokenType = extractTokenType(claims);

        if (!expectedTokenType.equals(actualTokenType)) {
            throw new JwtException(
                    "JWT is not a " + expectedTokenType + " token"
            );
        }
    }

    // ──────────────────── CONFIGURATION ────────────────────

    public long getAccessTokenExpiration() {
        return jwtProperties.getAccessTokenExpiration();
    }

    public long getRefreshTokenExpiration() {
        return jwtProperties.getRefreshTokenExpiration();
    }

    // ──────────────────── INTERNAL VALIDATION ────────────────────

    private void validateUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException(
                    "User must not be null"
            );
        }

        if (user.getPublicId() == null) {
            throw new IllegalArgumentException(
                    "User public ID must not be null"
            );
        }

        if (user.getRole() == null) {
            throw new IllegalArgumentException(
                    "User role must not be null"
            );
        }

        if (user.getStatus() == null) {
            throw new IllegalArgumentException(
                    "User status must not be null"
            );
        }
    }
}