package com.globalbooking.booking.repository;

import com.globalbooking.booking.domain.OperatingHours;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.DayOfWeek;
import java.util.Optional;
import java.util.UUID;

public interface OperatingHoursRepository extends JpaRepository<OperatingHours, UUID> {
    Optional<OperatingHours> findByEstablishmentIdAndDayOfWeek(UUID establishmentId, DayOfWeek dayOfWeek);
}
