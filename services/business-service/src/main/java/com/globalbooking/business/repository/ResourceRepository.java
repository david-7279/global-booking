package com.globalbooking.business.repository;

import com.globalbooking.business.domain.Resource;
import com.globalbooking.business.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ResourceRepository extends JpaRepository<Resource, UUID> {
    List<Resource> findAllByEstablishmentIdAndStatusNot(UUID establishmentId, Status status);
}
