package com.globalbooking.business.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "establishments")
public class Establishment {
    @Id
    private UUID id;

    @Column(name = "business_id", nullable = false)
    private UUID businessId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 500)
    private String address;

    @Column(nullable = false, length = 80)
    private String timezone;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    protected Establishment() {
    }

    public Establishment(UUID businessId, String name, String address, String timezone) {
        this.id = UUID.randomUUID();
        this.businessId = businessId;
        this.name = name;
        this.address = address;
        this.timezone = timezone;
        this.status = "ACTIVE";
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
    }

    public void update(String name, String address, String timezone) {
        this.name = name;
        this.address = address;
        this.timezone = timezone;
        this.updatedAt = Instant.now();
    }

    public void delete() {
        this.status = "DELETED";
        this.deletedAt = Instant.now();
        this.updatedAt = deletedAt;
    }
}
