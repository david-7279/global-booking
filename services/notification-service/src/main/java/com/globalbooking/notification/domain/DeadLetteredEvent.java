package com.globalbooking.notification.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

/**
 * Audit record of an integration event that could not be processed and was routed to the dead-letter queue.
 * <p>
 * The row keeps the original payload so an operator can replay the event after the root cause is corrected.
 */
@Getter
@Entity
@Table(name = "dead_lettered_events")
public class DeadLetteredEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id")
    private UUID eventId;

    @Column(name = "consumer_name", nullable = false, length = 120)
    private String consumerName;

    @Column(name = "event_type", length = 80)
    private String eventType;

    @Column(name = "source_queue", length = 150)
    private String sourceQueue;

    @Column(name = "routing_key", length = 150)
    private String routingKey;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(name = "failure_reason", length = 1000)
    private String failureReason;

    @Column(name = "retry_count", nullable = false)
    private int retryCount;

    @Column(name = "dead_lettered_at", nullable = false)
    private Instant deadLetteredAt;

    protected DeadLetteredEvent() {
        // Required by JPA.
    }

    public DeadLetteredEvent(
            UUID eventId,
            String consumerName,
            String eventType,
            String sourceQueue,
            String routingKey,
            String payload,
            String failureReason,
            int retryCount
    ) {
        if (payload == null) {
            throw new IllegalArgumentException("Dead-lettered payload is required");
        }
        this.eventId = eventId;
        this.consumerName = consumerName;
        this.eventType = eventType;
        this.sourceQueue = sourceQueue;
        this.routingKey = routingKey;
        this.payload = payload;
        this.failureReason = truncate(failureReason);
        this.retryCount = retryCount;
        this.deadLetteredAt = Instant.now();
    }

    private static String truncate(String reason) {
        if (reason == null) {
            return null;
        }
        return reason.length() <= 1000 ? reason : reason.substring(0, 1000);
    }
}
