package com.globalbooking.notification.infrastructure.security;

import com.globalbooking.notification.shared.common.error.ApiError;
import com.globalbooking.notification.shared.common.error.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Returns the shared API error body with {@code 401} when a request reaches a protected endpoint without a valid token.
 * Without this entry point Spring Security falls back to {@code 403}, which hides the difference between a missing
 * token and an insufficient role.
 */
@Component
@RequiredArgsConstructor
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        ApiError error = new ApiError(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                ErrorCode.AUTHENTICATION_FAILED.name(),
                "Authentication is required to access this resource.",
                request.getRequestURI(),
                UUID.randomUUID().toString(),
                List.of()
        );

        objectMapper.writeValue(response.getOutputStream(), error);
    }
}
