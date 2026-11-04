package com.globalbooking.notification.repository;

import com.globalbooking.notification.domain.DeadLetteredEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeadLetteredEventRepository extends JpaRepository<DeadLetteredEvent, Long> {
}
