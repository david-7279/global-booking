package com.globalbooking.booking.domain;

import com.globalbooking.booking.shared.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Table(name = "outbox_events")
public class OutboxEvent extends BaseEntity {

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @Column(name = "routing_key", nullable = false, length = 150)
    private String routingKey;

    @Column(name = "aggregate_id", nullable = false)
    private UUID aggregateId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "next_attempt_at", nullable = false)
    private Instant nextAttemptAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "dead_lettered_at")
    private Instant deadLetteredAt;

    @Column(name = "last_error", columnDefinition = "TEXT")
    private String lastError;

    protected OutboxEvent() {
    }

    public OutboxEvent(String eventType, String routingKey, UUID aggregateId, String payload) {
        this.eventType = eventType;
        this.routingKey = routingKey;
        this.aggregateId = aggregateId;
        this.payload = payload;
        this.occurredAt = Instant.now();
        this.nextAttemptAt = occurredAt;
    }

    public void markPublished() {
        publishedAt = Instant.now();
    }

    public void markDeadLettered() {
        deadLetteredAt = Instant.now();
    }

    public void retry(String error, long backoffMs) {
        attempts++;
        lastError = error;
        nextAttemptAt = Instant.now().plusMillis(backoffMs);
    }
}
