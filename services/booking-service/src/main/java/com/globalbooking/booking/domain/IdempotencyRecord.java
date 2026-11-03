package com.globalbooking.booking.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "idempotency_records")
public class IdempotencyRecord {
    @Id
    @Column(name = "idempotency_key", length = 200)
    private String key;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "request_hash", nullable = false, length = 64)
    private String requestHash;

    @Column(name = "booking_id", nullable = false)
    private UUID bookingId;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected IdempotencyRecord() {
    }

    public IdempotencyRecord(String key, UUID userId, String requestHash, UUID bookingId) {
        this.key = key;
        this.userId = userId;
        this.requestHash = requestHash;
        this.bookingId = bookingId;
        this.createdAt = Instant.now();
    }
}
