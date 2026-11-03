package com.globalbooking.business.domain;

import com.globalbooking.business.shared.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "booking_services")
public class BookingService extends BaseEntity {
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status;

    protected BookingService() {}

    public BookingService(UUID establishmentId, String name, String description, int durationMinutes, long priceCents, String currency) {
        this.establishmentId = establishmentId;
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.priceCents = priceCents;
        this.currency = currency;
        this.status = Status.ACTIVE;
    }

    public void update(String name, String description, int durationMinutes, long priceCents, String currency) {
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.priceCents = priceCents;
        this.currency = currency;
    }

    public void delete() {
        if (status != Status.DELETED) {
            status = Status.DELETED;
            markDeleted();
        }
    }
}
