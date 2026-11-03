package com.globalbooking.business.repository;

import com.globalbooking.business.domain.Establishment;
import com.globalbooking.business.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EstablishmentRepository extends JpaRepository<Establishment, UUID> {
    List<Establishment> findAllByBusinessIdAndStatusNot(UUID businessId, Status status);
}
