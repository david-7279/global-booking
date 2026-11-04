package com.globalbooking.booking.domain;

import com.globalbooking.booking.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "booking_history")
public class BookingHistory extends BaseEntity {

    @Column(name = "booking_id", nullable = false)
    private UUID bookingId;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 30)
    private BookingStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 30)
    private BookingStatus toStatus;

    @Column(name = "actor_id", nullable = false)
    private UUID actorId;

    @Column(nullable = false)
    private Instant occurredAt;

    @Column(length = 500)
    private String reason;

    protected BookingHistory() {
    }

    public BookingHistory(UUID bookingId, BookingStatus fromStatus, BookingStatus toStatus, UUID actorId, String reason) {
        this.bookingId = bookingId;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.actorId = actorId;
        this.reason = reason;
        this.occurredAt = Instant.now();
    }
}
