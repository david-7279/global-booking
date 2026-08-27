package com.globalbooking.auth.infrastructure.cors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class CorsConfig {

    private final CorsProperties corsProperties;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        validateConfiguration();

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());
        configuration.setAllowedOriginPatterns(corsProperties.getAllowedOriginPatterns());
        configuration.setAllowedMethods(corsProperties.getAllowedMethods());
        configuration.setAllowedHeaders(corsProperties.getAllowedHeaders());
        configuration.setExposedHeaders(corsProperties.getExposedHeaders());
        configuration.setAllowCredentials(corsProperties.isAllowCredentials());
        configuration.setMaxAge(corsProperties.getMaxAge());

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        log.info(
                "CORS configured with {} allowed origin(s) and {} origin pattern(s)",
                corsProperties.getAllowedOrigins().size(),
                corsProperties.getAllowedOriginPatterns().size()
        );

        return source;
    }

    private void validateConfiguration() {
        List<String> origins = corsProperties.getAllowedOrigins();
        List<String> patterns = corsProperties.getAllowedOriginPatterns();

        if (origins.isEmpty() && patterns.isEmpty()) {
            throw new IllegalStateException(
                    "CORS configuration is invalid: at least one allowed origin "
                            + "or origin pattern must be configured"
            );
        }

        if (origins.contains("*")) {
            throw new IllegalStateException(
                    "CORS configuration is invalid: wildcard '*' is not allowed"
            );
        }

        if (patterns.contains("*")) {
            throw new IllegalStateException(
                    "CORS configuration is invalid: wildcard '*' is not allowed"
            );
        }

        if (corsProperties.isAllowCredentials()
                && patterns.stream().anyMatch(this::isWildcardPattern)) {
            throw new IllegalStateException(
                    "CORS configuration is invalid: wildcard origin patterns "
                            + "cannot be used when credentials are enabled"
            );
        }
    }

    private boolean isWildcardPattern(String pattern) {
        return pattern.contains("*");
    }
}