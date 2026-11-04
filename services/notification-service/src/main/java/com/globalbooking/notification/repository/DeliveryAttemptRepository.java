package com.globalbooking.notification.repository;

import com.globalbooking.notification.domain.DeliveryAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DeliveryAttemptRepository extends JpaRepository<DeliveryAttempt, Long> {

    List<DeliveryAttempt> findByNotificationIdOrderByAttemptedAtDesc(UUID notificationId);
}
