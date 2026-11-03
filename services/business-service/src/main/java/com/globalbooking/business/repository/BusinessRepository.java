package com.globalbooking.business.repository;

import com.globalbooking.business.domain.Business;
import com.globalbooking.business.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BusinessRepository extends JpaRepository<Business, UUID> {
    List<Business> findAllByOwnerUserIdAndStatusNot(UUID ownerUserId, Status status);
}
