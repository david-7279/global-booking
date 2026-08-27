package com.globalbooking.auth.domain;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Public identifier exposed outside the service.
     * The internal database ID must never be exposed through the API.
     */
    @Column(name = "public_id", nullable = false, unique = true, updatable = false, columnDefinition = "UUID")
    private UUID publicId;

    @Column(name = "username", nullable = false, length = 120)
    private String username;

    @Column(name = "email_address", nullable = false, unique = true, length = 254)
    private String email;

    /**
     * Stores only the password hash.
     * Plain-text passwords must never be persisted.
     */
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private Role role;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * NULL indicates an active user.
     */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    protected User() {
        // Required by JPA
    }

    public User(
            String username,
            String email,
            String passwordHash,
            Role role
    ) {
        this.publicId = UUID.randomUUID();
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    // ──────────────────── DOMAIN METHODS ────────────────────

    public void updateUsername(String username) {
        this.username = username;
    }

    public void updateEmail(String email) {
        this.email = email;
    }

    public void updatePasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void updateRole(Role role) {
        this.role = role;
    }
}