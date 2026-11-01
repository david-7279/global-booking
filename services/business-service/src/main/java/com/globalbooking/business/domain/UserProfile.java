package com.globalbooking.business.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(length = 120)
    private String username;

    @Column(nullable = false, length = 50)
    private String role;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column(name = "last_event_at", nullable = false)
    private Instant lastEventAt;

    protected UserProfile() {
    }

    public UserProfile(UUID userId, String email, String username, String role, String status, Instant eventAt) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.role = role;
        this.status = status;
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
        this.lastEventAt = eventAt;
    }

    public void update(String email, String username, String role, String status, Instant eventAt) {
        this.email = email;
        this.username = username;
        this.role = role;
        this.status = status;
        this.deletedAt = null;
        this.updatedAt = Instant.now();
        this.lastEventAt = eventAt;
    }

    public void markDeleted(Instant deletedAt, Instant eventAt) {
        this.status = "DELETED";
        this.deletedAt = deletedAt;
        this.updatedAt = deletedAt;
        this.lastEventAt = eventAt;
    }

    public void changeStatus(String status, Instant eventAt) {
        this.status = status;
        this.updatedAt = Instant.now();
        this.lastEventAt = eventAt;
    }

    public boolean acceptsEvent(Instant eventAt) {
        return eventAt.isAfter(lastEventAt);
    }
}
