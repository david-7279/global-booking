package com.globalbooking.auth.infrastructure.cors;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;

@Getter
@Validated
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

    /**
     * Explicitly allowed origins.
     */
    @NotNull
    private List<String> allowedOrigins = new ArrayList<>();

    /**
     * Allowed HTTP methods for cross-origin requests.
     */
    @NotNull
    private List<String> allowedMethods = List.of(
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
    );

    /**
     * Allowed request headers.
     */
    @NotNull
    private List<String> allowedHeaders = List.of(
            "Authorization",
            "Content-Type"
    );

    /**
     * Response headers exposed to the browser.
     */
    @NotNull
    private List<String> exposedHeaders = List.of(
            "Authorization",
            "X-Total-Count"
    );

    /**
     * Whether cross-origin requests may include credentials.
     */
    private boolean allowCredentials = false;

    /**
     * Duration in seconds that browsers may cache preflight responses.
     */
    @Min(0)
    private long maxAge = 3600L;

    /**
     * Origin patterns for controlled wildcard matching.
     */
    @NotNull
    private List<String> allowedOriginPatterns = new ArrayList<>();
}