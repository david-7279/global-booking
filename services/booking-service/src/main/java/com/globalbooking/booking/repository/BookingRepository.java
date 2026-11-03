package com.globalbooking.booking.repository;

import com.globalbooking.booking.domain.Booking;
import com.globalbooking.booking.domain.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    Page<Booking> findByUserId(UUID userId, Pageable pageable);

    @Query("select b from Booking b where b.resourceId = :resourceId and b.status in :statuses and b.startAt < :endAt and b.endAt > :startAt")
    List<Booking> findOverlaps(@Param("resourceId") UUID resourceId, @Param("startAt") Instant startAt, @Param("endAt") Instant endAt, @Param("statuses") List<BookingStatus> statuses);
}
