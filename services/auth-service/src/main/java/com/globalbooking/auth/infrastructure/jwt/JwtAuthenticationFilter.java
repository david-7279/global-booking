package com.globalbooking.auth.infrastructure.jwt;

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

        if (authorizationHeader == null
                || !authorizationHeader.startsWith(BEARER_PREFIX)) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader
                .substring(BEARER_PREFIX.length())
                .trim();

        if (token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            /*
             * Only access tokens may authenticate API requests.
             *
             * Refresh tokens are deliberately rejected here.
             */
            if (!jwtService.isAccessTokenValid(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            UUID publicId = jwtService.extractPublicId(token);
            String role = jwtService.extractRole(token);

            var authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + role)
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

        } catch (Exception ex) {
            /*
             * Invalid JWTs must never authenticate the request.
             *
             * Spring Security will handle authorization afterwards.
             */
            SecurityContextHolder.clearContext();

            log.debug(
                    "JWT authentication failed for request {} {}",
                    request.getMethod(),
                    request.getRequestURI()
            );
        }

        filterChain.doFilter(request, response);
    }
}