package com.globalbooking.booking.service;

import com.globalbooking.booking.domain.OperatingHours;
import com.globalbooking.booking.repository.OperatingHoursRepository;
import com.globalbooking.booking.shared.common.exception.CatalogValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final OperatingHoursRepository operatingHoursRepository;

    public void validate(UUID establishmentId, String timezone, Instant startAt, Instant endAt) {
        if (timezone == null || timezone.isBlank()) return;
        final ZoneId zone;
        try {
            zone = ZoneId.of(timezone);
        } catch (DateTimeException exception) {
            throw new CatalogValidationException("Establishment timezone is invalid.");
        }
        ZonedDateTime start = startAt.atZone(zone);
        ZonedDateTime end = endAt.atZone(zone);

        if (!start.toLocalDate().equals(end.toLocalDate()))
            throw new CatalogValidationException("A booking must start and end on the same local operating day.");

        OperatingHours hours = operatingHoursRepository.findByEstablishmentIdAndDayOfWeek(establishmentId, start.getDayOfWeek()).orElse(null);

        if (hours == null) return; // No schedule configured yet: preserve catalog compatibility.

        LocalTime startTime = start.toLocalTime();
        LocalTime endTime = end.toLocalTime();

        if (startTime.isBefore(hours.getOpensAt()) || endTime.isAfter(hours.getClosesAt()))
            throw new CatalogValidationException("Booking is outside the establishment operating hours.");

        if (hours.getBreakStart() != null && hours.getBreakEnd() != null && startTime.isBefore(hours.getBreakStart()) && endTime.isAfter(hours.getBreakEnd()))
            throw new CatalogValidationException("Booking overlaps an establishment break.");
    }
}
