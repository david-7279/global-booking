package com.globalbooking.notification.domain;

import com.globalbooking.notification.shared.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

/**
 * A notification that was produced from an integration event.
 * <p>
 * The notification stores the rendered content, the template version that produced it and the identity of the source
 * event, so the history remains readable even after the template evolves.
 */
@Getter
@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {

    @Column(name = "recipient_user_id", nullable = false)
    private UUID recipientUserId;

    @Column(name = "recipient_email", length = 254)
    private String recipientEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationChannel channel;

    @Enumerated(EnumType.STRING)
    @Column(name = "template_code", nullable = false, length = 60)
    private NotificationTemplateCode templateCode;

    @Column(name = "template_version", nullable = false)
    private int templateVersion;

    @Column(nullable = false, length = 10)
    private String locale;

    @Column(nullable = false, length = 255)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationStatus status;

    @Column(name = "source_event_id")
    private UUID sourceEventId;

    @Column(name = "source_event_type", length = 80)
    private String sourceEventType;

    @Column(name = "correlation_id", length = 100)
    private String correlationId;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "next_attempt_at")
    private Instant nextAttemptAt;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "failed_at")
    private Instant failedAt;

    @Column(name = "read_at")
    private Instant readAt;

    @Column(name = "last_error", length = 1000)
    private String lastError;

    protected Notification() {
        // Required by JPA.
    }

    private Notification(
            UUID recipientUserId,
            String recipientEmail,
            NotificationChannel channel,
            NotificationContent content,
            UUID sourceEventId,
            String sourceEventType,
            String correlationId
    ) {
        this.recipientUserId = requireRecipient(recipientUserId);
        this.recipientEmail = recipientEmail;
        this.channel = channel;
        this.templateCode = content.code();
        this.templateVersion = content.version();
        this.locale = content.locale();
        this.subject = content.subject();
        this.body = content.body();
        this.sourceEventId = sourceEventId;
        this.sourceEventType = sourceEventType;
        this.correlationId = correlationId;
        this.status = NotificationStatus.PENDING;
        this.attempts = 0;
    }

    /**
     * Creates an email notification that must be delivered by the dispatcher.
     */
    public static Notification pendingEmail(
            UUID recipientUserId,
            String recipientEmail,
            NotificationContent content,
            UUID sourceEventId,
            String sourceEventType,
            String correlationId,
            Instant nextAttemptAt
    ) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            throw new IllegalArgumentException("Email notifications require a recipient email address");
        }

        Notification notification = new Notification(
                recipientUserId,
                recipientEmail.trim(),
                NotificationChannel.EMAIL,
                content,
                sourceEventId,
                sourceEventType,
                correlationId
        );
        notification.nextAttemptAt = nextAttemptAt == null ? Instant.now() : nextAttemptAt;
        return notification;
    }

    /**
     * Creates an in-app notification. Persistence is the delivery, so the notification is already sent.
     */
    public static Notification deliveredInApp(
            UUID recipientUserId,
            NotificationContent content,
            UUID sourceEventId,
            String sourceEventType,
            String correlationId
    ) {
        Notification notification = new Notification(
                recipientUserId,
                null,
                NotificationChannel.IN_APP,
                content,
                sourceEventId,
                sourceEventType,
                correlationId
        );
        notification.status = NotificationStatus.SENT;
        notification.sentAt = Instant.now();
        return notification;
    }

    /**
     * Claims the notification for the dispatcher and counts the attempt that is about to happen.
     */
    public void markSending() {
        if (status != NotificationStatus.PENDING && status != NotificationStatus.FAILED) {
            throw new IllegalStateException("Only pending or failed notifications can be sent: " + status);
        }
        status = NotificationStatus.SENDING;
        attempts++;
    }

    public void markSent() {
        if (status != NotificationStatus.SENDING) {
            throw new IllegalStateException("Only sending notifications can be marked as sent: " + status);
        }
        status = NotificationStatus.SENT;
        sentAt = Instant.now();
        failedAt = null;
        lastError = null;
        nextAttemptAt = null;
    }

    /**
     * Registers a failed delivery attempt and schedules the next one.
     */
    public void recordFailedAttempt(String error, Instant retryAt) {
        if (status != NotificationStatus.SENDING) {
            throw new IllegalStateException("Delivery attempts are only registered while sending: " + status);
        }
        status = NotificationStatus.FAILED;
        lastError = truncate(error);
        failedAt = Instant.now();
        nextAttemptAt = retryAt;
    }

    /**
     * Stops retrying a notification whose attempts were exhausted.
     */
    public void markDeliveryExhausted(String error) {
        if (status != NotificationStatus.SENDING) {
            throw new IllegalStateException("Only sending notifications can be exhausted: " + status);
        }
        status = NotificationStatus.DEAD_LETTERED;
        lastError = truncate(error);
        failedAt = Instant.now();
        nextAttemptAt = null;
    }

    /**
     * Releases a notification that stayed in {@code SENDING} because the process stopped mid-delivery.
     */
    public void releaseInterruptedDelivery(Instant retryAt) {
        if (status != NotificationStatus.SENDING) {
            return;
        }
        status = NotificationStatus.FAILED;
        lastError = "Delivery interrupted before completion; the attempt may have reached the recipient.";
        failedAt = Instant.now();
        nextAttemptAt = retryAt;
    }

    /**
     * Resets a failed notification so an operator can request a new delivery.
     */
    public void retryNow() {
        if (!canRequestRetry()) {
            throw new IllegalStateException("Notification cannot be retried in status " + status);
        }
        status = NotificationStatus.PENDING;
        attempts = 0;
        lastError = null;
        failedAt = null;
        nextAttemptAt = Instant.now();
    }

    public void markRead() {
        if (channel != NotificationChannel.IN_APP) {
            throw new IllegalStateException("Only in-app notifications can be read");
        }
        if (readAt == null) {
            readAt = Instant.now();
        }
    }

    public boolean isRead() {
        return readAt != null;
    }

    /**
     * A failed or exhausted notification may be requeued by an administrator.
     */
    public boolean canRequestRetry() {
        return status == NotificationStatus.FAILED || status == NotificationStatus.DEAD_LETTERED;
    }

    private UUID requireRecipient(UUID recipientUserId) {
        if (recipientUserId == null) {
            throw new IllegalArgumentException("Recipient user id is required");
        }
        return recipientUserId;
    }

    private String truncate(String error) {
        if (error == null) {
            return null;
        }
        return error.length() <= 1000 ? error : error.substring(0, 1000);
    }
}
