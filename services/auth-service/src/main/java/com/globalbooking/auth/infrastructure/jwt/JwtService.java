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

    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";

    private final JwtProperties jwtProperties;
    private final SecretKey secretKey;

    /**
     * Generates a JWT access token for the given user.
     * Access tokens are short-lived and contain the user's public ID
     * and role.
     */
    public String generateAccessToken(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User must not be null");
        }

        return generateToken(
                user.getPublicId(),
                user.getRole().name(),
                ACCESS_TOKEN_TYPE,
                jwtProperties.getAccessTokenExpiration()
        );
    }

    /**
     * Generates a JWT refresh token for the given user.
     * Refresh tokens are long-lived and contain only the information
     * required to identify the user and the token itself.
     */
    public String generateRefreshToken(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User must not be null");
        }

        return generateToken(
                user.getPublicId(),
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
            String tokenType,
            long expirationMs
    ) {
        if (publicId == null) {
            throw new IllegalArgumentException("Public ID must not be null");
        }

        if (tokenType == null || tokenType.isBlank()) {
            throw new IllegalArgumentException("Token type must not be blank");
        }

        if (expirationMs <= 0) {
            throw new IllegalArgumentException(
                    "Token expiration must be greater than zero"
            );
        }

        Instant now = Instant.now();
        Instant expiration = now.plusMillis(expirationMs);
        UUID tokenId = UUID.randomUUID();

        var builder = Jwts.builder()
                .id(tokenId.toString())
                .subject(publicId.toString())
                .claim(CLAIM_TOKEN_TYPE, tokenType)
                .issuer(jwtProperties.getIssuer())
                .audience()
                .add(jwtProperties.getAudience())
                .and()
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(secretKey, Jwts.SIG.HS256);

        if (role != null && !role.isBlank()) {
            builder.claim(CLAIM_ROLE, role);
        }

        return builder.compact();
    }

    /**
     * Parses and validates a signed JWT.
     * The signature, issuer, audience and standard JWT structure are
     * validated by JJWT.
     *
     * @throws JwtException if the token is invalid, expired or malformed
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
     * Extracts the user's public identifier from the JWT subject.
     */
    public UUID extractPublicId(String token) {
        Claims claims = extractAllClaims(token);

        String subject = claims.getSubject();

        if (subject == null || subject.isBlank()) {
            throw new JwtException("JWT subject is missing");
        }

        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException ex) {
            throw new JwtException("JWT subject is invalid", ex);
        }
    }

    /**
     * Extracts the JWT ID (jti).
     * The JTI uniquely identifies an individual token and is used
     * for refresh-token persistence and rotation.
     */
    public UUID extractTokenId(String token) {
        Claims claims = extractAllClaims(token);

        String tokenId = claims.getId();

        if (tokenId == null || tokenId.isBlank()) {
            throw new JwtException("JWT ID is missing");
        }

        try {
            return UUID.fromString(tokenId);
        } catch (IllegalArgumentException ex) {
            throw new JwtException("JWT ID is invalid");
        }
    }

    /**
     * Extracts the token type.
     * Valid values are:
     * - access
     * - refresh
     */
    public String extractTokenType(String token) {
        String tokenType = extractAllClaims(token)
                .get(CLAIM_TOKEN_TYPE, String.class);

        if (tokenType == null || tokenType.isBlank()) {
            throw new JwtException("JWT token type is missing");
        }

        return tokenType;
    }

    /**
     * Extracts the user's role from an access token.
     */
    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);

        String tokenType = getTokenType(claims);

        if (!ACCESS_TOKEN_TYPE.equals(tokenType)) {
            throw new JwtException(
                    "Role is only available for access tokens"
            );
        }

        String role = claims.get(CLAIM_ROLE, String.class);

        if (role == null || role.isBlank()) {
            throw new JwtException("JWT role claim is missing");
        }

        return role;
    }

    /**
     * Returns the token expiration timestamp.
     */
    public Instant extractExpiration(String token) {
        Date expiration = extractAllClaims(token).getExpiration();

        if (expiration == null) {
            throw new JwtException("JWT expiration is missing");
        }

        return expiration.toInstant();
    }

    /**
     * Returns the configured access-token lifetime in milliseconds.
     */
    public long getAccessTokenExpiration() {
        return jwtProperties.getAccessTokenExpiration();
    }

    /**
     * Returns the configured refresh-token lifetime in milliseconds.
     */
    public long getRefreshTokenExpiration() {
        return jwtProperties.getRefreshTokenExpiration();
    }

    /**
     * Validates an access token.
     * This method is intended for authentication filters.
     * It does not expose validation details to the caller.
     */
    public boolean isAccessTokenValid(String token) {
        return isTokenValid(token, ACCESS_TOKEN_TYPE);
    }

    /**
     * Validates a refresh token.
     * This validates the JWT itself. Persistence-level checks such as
     * revocation and rotation are handled separately by the refresh-token
     * service.
     */
    public boolean isRefreshTokenValid(String token) {
        return isTokenValid(token, REFRESH_TOKEN_TYPE);
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

        try {
            Claims claims = extractAllClaims(token);

            String subject = claims.getSubject();
            String tokenId = claims.getId();
            String tokenType = getTokenType(claims);
            Date expiration = claims.getExpiration();

            return subject != null
                    && !subject.isBlank()
                    && tokenId != null
                    && !tokenId.isBlank()
                    && expectedTokenType.equals(tokenType)
                    && expiration != null
                    && expiration.after(new Date());

        } catch (ExpiredJwtException ex) {
            log.debug("JWT validation failed: token expired");
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("JWT validation failed: invalid token");
        }

        return false;
    }

    /**
     * Verifies that a JWT is a refresh token.
     * This method throws a JwtException instead of returning false,
     * making it useful when processing /refresh.
     */
    public void requireRefreshToken(String token) {
        Claims claims = extractAllClaims(token);

        String tokenType = getTokenType(claims);

        if (!REFRESH_TOKEN_TYPE.equals(tokenType)) {
            throw new JwtException("JWT is not a refresh token");
        }
    }

    /**
     * Verifies that a JWT is an access token.
     */
    public void requireAccessToken(String token) {
        Claims claims = extractAllClaims(token);

        String tokenType = getTokenType(claims);

        if (!ACCESS_TOKEN_TYPE.equals(tokenType)) {
            throw new JwtException("JWT is not an access token");
        }
    }

    /**
     * Extracts the token type from already validated claims.
     */
    private String getTokenType(Claims claims) {
        String tokenType = claims.get(CLAIM_TOKEN_TYPE, String.class);

        if (tokenType == null || tokenType.isBlank()) {
            throw new JwtException("JWT token type is missing");
        }

        return tokenType;
    }
}