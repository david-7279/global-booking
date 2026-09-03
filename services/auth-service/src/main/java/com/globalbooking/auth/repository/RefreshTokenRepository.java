package com.globalbooking.auth.repository;

import com.globalbooking.auth.domain.RefreshToken;
import com.globalbooking.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenId(UUID tokenId);

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    boolean existsByTokenId(UUID tokenId);

    @Modifying
    @Query("""
            UPDATE RefreshToken rt
               SET rt.revokedAt = :revokedAt
             WHERE rt.user = :user
               AND rt.revokedAt IS NULL
               AND rt.expiresAt > :now
            """)
    int revokeAllActiveByUser(
            @Param("user") User user,
            @Param("revokedAt") Instant revokedAt,
            @Param("now") Instant now
    );

    @Modifying
    @Query("""
            DELETE FROM RefreshToken rt
             WHERE rt.expiresAt < :now
            """)
    int deleteExpiredTokens(@Param("now") Instant now);
}