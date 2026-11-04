package com.globalbooking.booking.domain;

import com.globalbooking.booking.shared.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

@Getter
@Entity
@Table(name = "idempotency_records", uniqueConstraints = @jakarta.persistence.UniqueConstraint(name = "uk_idempotency_records_key_user", columnNames = {"idempotency_key", "user_id"}))
public class IdempotencyRecord extends BaseEntity {

    @Column(name = "idempotency_key", nullable = false, length = 200)
    private String key;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "request_hash", nullable = false, length = 64)
    private String requestHash;

    @Column(name = "booking_id", nullable = false)
    private UUID bookingId;

    protected IdempotencyRecord() {
    }

    public IdempotencyRecord(String key, UUID userId, String requestHash, UUID bookingId) {
        this.key = key;
        this.userId = userId;
        this.requestHash = requestHash;
        this.bookingId = bookingId;
    }
}
