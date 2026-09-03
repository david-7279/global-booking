package com.globalbooking.auth.infrastructure.jwt;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    /**
     * Base64-encoded secret used to sign and verify JWTs.
     */
    @NotBlank
    @Size(min = 43)
    private String secret;

    /**
     * Identifies the service that issues the token.
     */
    @NotBlank
    private String issuer;

    /**
     * Identifies the intended JWT consumer.
     */
    @NotBlank
    private String audience;

    /**
     * Access token lifetime in milliseconds.
     */
    private long accessTokenExpiration = 900_000L;

    /**
     * Refresh token lifetime in milliseconds.
     */
    private long refreshTokenExpiration = 604_800_000L;
}