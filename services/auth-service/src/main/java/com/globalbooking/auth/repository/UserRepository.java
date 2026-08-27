package com.globalbooking.auth.repository;

import com.globalbooking.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for User persistence and authentication-related queries.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds an active user by username.
     */
    Optional<User> findByUsername(String username);

    /**
     * Finds an active user by email address.
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds an active user by their public identifier.
     */
    Optional<User> findByPublicId(UUID publicId);

    /**
     * Checks whether an active user exists with the given username.
     */
    boolean existsByUsername(String username);

    /**
     * Checks whether an active user exists with the given email address.
     */
    boolean existsByEmail(String email);
}