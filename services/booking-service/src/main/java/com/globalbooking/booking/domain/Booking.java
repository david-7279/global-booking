package com.globalbooking.booking.domain;

import com.globalbooking.booking.shared.BaseEntity;
import com.globalbooking.booking.shared.common.exception.InvalidTransitionException;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "business_id", nullable = false)
    private UUID businessId;

    @Column(name = "establishment_id", nullable = false)
    private UUID establishmentId;

    @Column(name = "booking_service_id", nullable = false)
    private UUID bookingServiceId;

    @Column(name = "resource_id", nullable = false)
    private UUID resourceId;

    @Column(name = "allocation_slot", nullable = false)
    private int allocationSlot;

    @Column(name = "start_at", nullable = false)
    private Instant startAt;

    @Column(name = "end_at", nullable = false)
    private Instant endAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BookingStatus status;

    @Column(length = 1000)
    private String notes;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    protected Booking() {
    }

    public Booking(UUID userId, UUID businessId, UUID establishmentId, UUID bookingServiceId, UUID resourceId,
                   Instant startAt, Instant endAt, String notes) {
        this(userId, businessId, establishmentId, bookingServiceId, resourceId, 0, startAt, endAt, notes);
    }

    public Booking(UUID userId, UUID businessId, UUID establishmentId, UUID bookingServiceId, UUID resourceId,
                   int allocationSlot, Instant startAt, Instant endAt, String notes) {
        if (!endAt.isAfter(startAt)) throw new IllegalArgumentException("endAt must be after startAt");
        this.userId = userId;
        this.businessId = businessId;
        this.establishmentId = establishmentId;
        this.bookingServiceId = bookingServiceId;
        this.resourceId = resourceId;
        this.allocationSlot = allocationSlot;
        this.startAt = startAt;
        this.endAt = endAt;
        this.notes = notes;
        this.status = BookingStatus.PENDING;
    }

    public void confirm() {
        transition(BookingStatus.CONFIRMED);
    }

    public void reject() {
        transition(BookingStatus.REJECTED);
    }

    public void complete() {
        transition(BookingStatus.COMPLETED);
    }

    public void cancel() {
        transition(BookingStatus.CANCELLED);
        cancelledAt = Instant.now();
    }

    private void transition(BookingStatus target) {
        boolean allowed = switch (status) {
            case PENDING ->
                    target == BookingStatus.CONFIRMED || target == BookingStatus.REJECTED || target == BookingStatus.CANCELLED;
            case CONFIRMED -> target == BookingStatus.CANCELLED || target == BookingStatus.COMPLETED;
            case CANCELLED, COMPLETED, REJECTED -> false;
        };
        if (!allowed) throw new InvalidTransitionException(status, target);
        status = target;
    }
}
