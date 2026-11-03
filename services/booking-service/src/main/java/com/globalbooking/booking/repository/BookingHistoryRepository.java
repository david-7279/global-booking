package com.globalbooking.booking.repository;

import com.globalbooking.booking.domain.BookingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingHistoryRepository extends JpaRepository<BookingHistory, UUID> {
    List<BookingHistory> findByBookingIdOrderByOccurredAtAsc(UUID bookingId);
}
