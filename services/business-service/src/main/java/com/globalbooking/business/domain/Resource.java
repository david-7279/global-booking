package com.globalbooking.business.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "resources")
public class Resource {
    @Id
    private UUID id;

    @Column(name = "establishment_id", nullable = false)
    private UUID establishmentId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(name = "resource_type", nullable = false, length = 80)
    private String resourceType;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    protected Resource() {
    }

    public Resource(UUID establishmentId, String name, String resourceType, int capacity) {
        this.id = UUID.randomUUID();
        this.establishmentId = establishmentId;
        this.name = name;
        this.resourceType = resourceType;
        this.capacity = capacity;
        this.status = "ACTIVE";
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
    }

    public void update(String name, String resourceType, int capacity) {
        this.name = name;
        this.resourceType = resourceType;
        this.capacity = capacity;
        this.updatedAt = Instant.now();
    }

    public void delete() {
        this.status = "DELETED";
        this.deletedAt = Instant.now();
        this.updatedAt = deletedAt;
    }
}
