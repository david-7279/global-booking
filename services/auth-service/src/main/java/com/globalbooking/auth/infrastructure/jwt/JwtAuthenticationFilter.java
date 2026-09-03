package com.globalbooking.auth.infrastructure.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        /*
         * Requests without an Authorization header are allowed to
         * continue through the filter chain.
         *
         * Public endpoints can therefore be accessed without a JWT,
         * while protected endpoints will be rejected later by
         * Spring Security.
         */
        if (authorizationHeader == null
                || !authorizationHeader.startsWith(BEARER_PREFIX)) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader
                .substring(BEARER_PREFIX.length())
                .trim();

        /*
         * "Bearer " without a token is not a valid authentication
         * attempt. Continue without authentication.
         */
        if (token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            /*
             * Parse and cryptographically validate the JWT exactly once.
             *
             * The returned claims are then reused to extract the
             * subject, role, status and token type.
             */
            Claims claims = jwtService.parseAndValidateAccessToken(token);

            /*
             * The parser method already validates the token type,
             * but requireAccessToken() keeps this security invariant
             * explicit at the filter boundary.
             */
            jwtService.requireAccessToken(claims);

            UUID publicId =
                    jwtService.extractPublicId(claims);

            String role =
                    jwtService.extractRole(claims);

            String status =
                    jwtService.extractStatus(claims);

            var authorities = List.of(
                    new SimpleGrantedAuthority(
                            "ROLE_" + role
                    ),
                    new SimpleGrantedAuthority(
                            "STATUS_" + status
                    )
            );

            var authentication =
                    new UsernamePasswordAuthenticationToken(
                            publicId,
                            null,
                            authorities
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        } catch (JwtException | IllegalArgumentException ex) {

            /*
             * Invalid, expired, malformed or incorrectly typed JWTs
             * must never authenticate the request.
             *
             * We deliberately do not expose the reason to the client.
             * Spring Security will subsequently handle authorization.
             */
            SecurityContextHolder.clearContext();

            log.atWarn()
                    .setMessage("JWT authentication failed")
                    .addKeyValue("event", "invalid_jwt")
                    .addKeyValue("method", request.getMethod())
                    .addKeyValue("path", request.getRequestURI())
                    .log();
        }

        filterChain.doFilter(request, response);
    }
}