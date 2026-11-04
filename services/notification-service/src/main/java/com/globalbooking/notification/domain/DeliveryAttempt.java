package com.globalbooking.notification.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

/**
 * Immutable record of each delivery attempt, kept for auditing and support.
 */
@Getter
@Entity
@Table(name = "notification_delivery_attempts")
public class DeliveryAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "notification_id", nullable = false)
    private UUID notificationId;

    @Column(name = "attempt_number", nullable = false)
    private int attemptNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeliveryOutcome outcome;

    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Column(name = "attempted_at", nullable = false)
    private Instant attemptedAt;

    protected DeliveryAttempt() {
        // Required by JPA.
    }

    public DeliveryAttempt(
            UUID notificationId,
            int attemptNumber,
            DeliveryOutcome outcome,
            String errorMessage
    ) {
        this.notificationId = notificationId;
        this.attemptNumber = attemptNumber;
        this.outcome = outcome;
        this.errorMessage = truncate(errorMessage);
        this.attemptedAt = Instant.now();
    }

    private static String truncate(String message) {
        if (message == null) {
            return null;
        }
        return message.length() <= 1000 ? message : message.substring(0, 1000);
    }
}
