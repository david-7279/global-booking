package com.globalbooking.auth.infrastructure.jwt;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Validated
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * Base64-encoded secret used to sign and verify JWTs.
     */
    @NotBlank
    private String secret;

    /**
     * JWT issuer identifies the service that issued the token.
     */
    @NotBlank
    private String issuer = "global-booking-auth-service";

    /**
     * JWT audience identifies the intended token consumer.
     */
    @NotBlank
    private String audience = "global-booking-api";

    /**
     * Access token lifetime in milliseconds.
     */
    @Positive
    private long accessTokenExpiration = 900_000L;

    /**
     * Refresh token lifetime in milliseconds.
     */
    @Positive
    private long refreshTokenExpiration = 604_800_000L;
}