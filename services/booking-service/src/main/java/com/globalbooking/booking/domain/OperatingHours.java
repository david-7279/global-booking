package com.globalbooking.booking.domain;

import com.globalbooking.booking.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Entity
@Table(name = "operating_hours", uniqueConstraints = @UniqueConstraint(name = "uk_operating_hours_establishment_day", columnNames = {"establishment_id", "day_of_week"}))
public class OperatingHours extends BaseEntity {

    @Column(name = "establishment_id", nullable = false)
    private UUID establishmentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 10)
    private DayOfWeek dayOfWeek;

    @Column(name = "opens_at", nullable = false)
    private LocalTime opensAt;

    @Column(name = "closes_at", nullable = false)
    private LocalTime closesAt;

    @Column(name = "break_start")
    private LocalTime breakStart;

    @Column(name = "break_end")
    private LocalTime breakEnd;

    protected OperatingHours() {
    }

    public OperatingHours(UUID establishmentId, DayOfWeek dayOfWeek, LocalTime opensAt, LocalTime closesAt, LocalTime breakStart, LocalTime breakEnd) {
        this.establishmentId = establishmentId;
        this.dayOfWeek = dayOfWeek;
        this.opensAt = opensAt;
        this.closesAt = closesAt;
        this.breakStart = breakStart;
        this.breakEnd = breakEnd;
    }
}
