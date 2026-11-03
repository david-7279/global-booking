package com.globalbooking.business.repository;

import com.globalbooking.business.domain.BookingService;
import com.globalbooking.business.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingServiceRepository extends JpaRepository<BookingService, UUID> {
    List<BookingService> findAllByEstablishmentIdAndStatusNot(UUID establishmentId, Status status);
}
