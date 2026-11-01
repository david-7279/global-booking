package com.globalbooking.business.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "booking_services")
public class BookingService {
    @Id
    private UUID id;

    @Column(name = "establishment_id", nullable = false)
    private UUID establishmentId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @Column(name = "price_cents", nullable = false)
    private long priceCents;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    protected BookingService() {
    }

    public BookingService(UUID establishmentId, String name, String description, int durationMinutes, long priceCents, String currency) {
        this.id = UUID.randomUUID();
        this.establishmentId = establishmentId;
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.priceCents = priceCents;
        this.currency = currency;
        this.status = "ACTIVE";
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
    }

    public void update(String name, String description, int durationMinutes, long priceCents, String currency) {
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.priceCents = priceCents;
        this.currency = currency;
        this.updatedAt = Instant.now();
    }

    public void delete() {
        this.status = "DELETED";
        this.deletedAt = Instant.now();
        this.updatedAt = deletedAt;
    }
}
