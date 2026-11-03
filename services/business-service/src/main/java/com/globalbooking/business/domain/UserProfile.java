package com.globalbooking.business.domain;

import com.globalbooking.business.shared.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "user_profiles")
public class UserProfile extends BaseEntity {
    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(length = 120)
    private String username;

    @Column(nullable = false, length = 50)
    private String role;

    // This mirrors the auth-service contract and may evolve independently from business-resource Status.
    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "last_event_at", nullable = false)
    private Instant lastEventAt;

    protected UserProfile() {}

    public UserProfile(UUID userId, String email, String username, String role, String status, Instant eventAt) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.role = role;
        this.status = status;
        this.lastEventAt = eventAt;
    }

    public void update(String email, String username, String role, String status, Instant eventAt) {
        this.email = email;
        this.username = username;
        this.role = role;
        this.status = status;
        this.lastEventAt = eventAt;
    }

    public void markDeleted(Instant eventAt) {
        this.status = "DELETED";
        this.lastEventAt = eventAt;
        markDeleted();
    }

    public void changeStatus(String status, Instant eventAt) {
        this.status = status;
        this.lastEventAt = eventAt;
    }

    public boolean acceptsEvent(Instant eventAt) {
        return eventAt.isAfter(lastEventAt);
    }
}
