package com.globalbooking.auth.service;

import com.globalbooking.auth.common.error.ErrorCode;
import com.globalbooking.auth.common.exception.UnauthorizedException;
import com.globalbooking.auth.common.exception.ResourceNotFoundException;
import com.globalbooking.auth.domain.User;
import com.globalbooking.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;

    /**
     * Resolves the currently authenticated user from the JWT subject.
     */
    public User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException(ErrorCode.AUTHENTICATION_FAILED, "Authentication is required");
        }

        UUID publicId = extractPublicId(authentication);

        return userRepository.findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(ErrorCode.AUTHENTICATION_FAILED, "Authenticated user not found")
                );
    }

    private UUID extractPublicId(Authentication authentication) {
        try {
            return UUID.fromString(authentication.getName());
        } catch (IllegalArgumentException ex) {
            throw new UnauthorizedException(ErrorCode.AUTHENTICATION_FAILED, "Invalid authentication subject");
        }
    }
}