package com.globalbooking.business.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "businesses")
public class Business {
    @Id
    private UUID id;

    @Column(name = "owner_user_id", nullable = false)
    private UUID ownerUserId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    protected Business() {
    }

    public Business(UUID ownerUserId, String name, String description) {
        this.id = UUID.randomUUID();
        this.ownerUserId = ownerUserId;
        this.name = name;
        this.description = description;
        this.status = "ACTIVE";
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
    }

    public void update(String name, String description) {
        this.name = name;
        this.description = description;
        this.updatedAt = Instant.now();
    }

    public void delete() {
        this.status = "DELETED";
        this.deletedAt = Instant.now();
        this.updatedAt = deletedAt;
    }
}
