package com.globalbooking.notification.repository;

import com.globalbooking.notification.domain.NotificationRecipient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, UUID> {

    Optional<NotificationRecipient> findByUserId(UUID userId);
}
