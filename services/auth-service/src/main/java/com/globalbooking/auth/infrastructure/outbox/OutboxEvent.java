package com.globalbooking.auth.infrastructure.outbox;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

/**
 * A database record that waits to be published to RabbitMQ.
 *
 * It is saved in the same transaction as the business change. This prevents
 * a database change from succeeding while its integration event is lost.
 */
@Getter
@Entity
@Table(name = "outbox_events")
public class OutboxEvent {

    @Id
    private UUID id;

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @Column(name = "routing_key", nullable = false, length = 200)
    private String routingKey;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", nullable = false, columnDefinition = "jsonb")
    private String payload;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "next_attempt_at", nullable = false)
    private Instant nextAttemptAt;

    @Column(name = "dead_lettered_at")
    private Instant deadLetteredAt;

    @Column(name = "attempts", nullable = false)
    private int attempts;

    @Column(name = "last_error")
    private String lastError;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected OutboxEvent() {
        // Required by JPA.
    }

    public OutboxEvent(
            String eventType,
            String routingKey,
            String payload
    ) {
        this.id = UUID.randomUUID();
        this.eventType = eventType;
        this.routingKey = routingKey;
        this.payload = payload;
        this.occurredAt = Instant.now();
        this.createdAt = this.occurredAt;
        this.nextAttemptAt = this.occurredAt;
    }

    public boolean isPublished() {
        return publishedAt != null;
    }

    public boolean isDeadLettered() {
        return deadLetteredAt != null;
    }

    public void markPublished() {
        this.publishedAt = Instant.now();
        this.lastError = null;
    }

    public void markFailed(Exception exception, Instant nextAttemptAt) {
        this.attempts++;
        this.lastError = shorten(exception.getMessage());
        this.nextAttemptAt = nextAttemptAt;
    }

    public void markDeadLettered() {
        this.deadLetteredAt = Instant.now();
        this.lastError = null;
    }

    private String shorten(String message) {
        if (message == null) {
            return "Unknown publishing error";
        }
        return message.length() <= 4000
                ? message
                : message.substring(0, 4000);
    }
}
