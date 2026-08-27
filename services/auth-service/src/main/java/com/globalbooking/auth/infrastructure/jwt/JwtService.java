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

    private final JwtProperties jwtProperties;
    private final SecretKey secretKey;

    /**
     * Generates an access token for the authenticated user.
     */
    public String generateAccessToken(User user) {
        return generateAccessToken(
                user.getPublicId(),
                user.getRole().name()
        );
    }

    /**
     * Generates an access token containing the user's public identity and role.
     */
    private String generateAccessToken(UUID publicId, String role) {
        Instant now = Instant.now();
        Instant expiration =
                now.plusMillis(jwtProperties.getAccessTokenExpiration());

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(publicId.toString())
                .claim("role", role)
                .issuer(jwtProperties.getIssuer())
                .audience()
                .add(jwtProperties.getAudience())
                .and()
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    /**
     * Parses and validates a signed JWT.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .requireIssuer(jwtProperties.getIssuer())
                .requireAudience(jwtProperties.getAudience())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Extracts the user's public identifier from the token subject.
     */
    public UUID extractPublicId(String token) {
        String subject = extractAllClaims(token).getSubject();

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
     * Extracts the user's role from the token claims.
     */
    public String extractRole(String token) {
        String role = extractAllClaims(token).get("role", String.class);

        if (role == null || role.isBlank()) {
            throw new JwtException("JWT role claim is missing");
        }

        return role;
    }

    /**
     * Returns the token expiration as an {@link Instant}.
     */
    public Instant extractExpiration(String token) {
        Date expiration = extractAllClaims(token).getExpiration();

        if (expiration == null) {
            throw new JwtException("JWT expiration is missing");
        }

        return expiration.toInstant();
    }

    /**
     * Returns the configured access token lifetime in milliseconds.
     */
    public long getAccessTokenExpiration() {
        return jwtProperties.getAccessTokenExpiration();
    }

    /**
     * Returns the configured refresh token lifetime in milliseconds.
     */
    public long getRefreshTokenExpiration() {
        return jwtProperties.getRefreshTokenExpiration();
    }

    /**
     * Validates the token without exposing validation details to the caller.
     */
    public boolean isTokenValid(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        try {
            Claims claims = extractAllClaims(token);

            return claims.getSubject() != null
                    && !claims.getSubject().isBlank()
                    && claims.getExpiration() != null
                    && claims.getExpiration().after(new Date());

        } catch (ExpiredJwtException ex) {
            log.debug("JWT validation failed: token expired");
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("JWT validation failed: {}", ex.getMessage());
        }

        return false;
    }
}