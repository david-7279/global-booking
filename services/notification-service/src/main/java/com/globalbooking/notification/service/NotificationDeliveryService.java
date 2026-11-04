package com.globalbooking.notification.service;

import com.globalbooking.notification.infrastructure.config.MailProperties;
import com.globalbooking.notification.infrastructure.config.NotificationProperties;
import com.globalbooking.notification.domain.DeliveryAttempt;
import com.globalbooking.notification.domain.DeliveryOutcome;
import com.globalbooking.notification.domain.Notification;
import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.infrastructure.mail.EmailMessage;
import com.globalbooking.notification.infrastructure.mail.EmailSender;
import com.globalbooking.notification.repository.DeliveryAttemptRepository;
import com.globalbooking.notification.repository.NotificationRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Executes a single delivery attempt.
 * <p>
 * Each notification is committed independently, so one failing recipient never rolls back the batch. The attempt, the
 * new status and the next attempt date are persisted together, which keeps the retry schedule durable across restarts.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationDeliveryService {

    private final NotificationRepository notificationRepository;
    private final DeliveryAttemptRepository attemptRepository;
    private final EmailSender emailSender;
    private final MailProperties mailProperties;
    private final NotificationProperties properties;
    private final MeterRegistry meterRegistry;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean deliver(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification == null
                || notification.getChannel() != NotificationChannel.EMAIL
                || !notification.getStatus().isDeliverable()) {
            return false;
        }

        notification.markSending();
        int attemptNumber = notification.getAttempts();

        try {
            emailSender.send(new EmailMessage(
                    notification.getRecipientEmail(),
                    mailProperties.decorateSubject(notification.getSubject()),
                    notification.getBody(),
                    notification.getId(),
                    notification.getCorrelationId()
            ));

            notification.markSent();
            attemptRepository.save(new DeliveryAttempt(
                    notification.getId(),
                    attemptNumber,
                    DeliveryOutcome.SENT,
                    null
            ));
            meterRegistry.counter("notifications_delivered_total", "channel", "EMAIL").increment();

            log.atInfo()
                    .setMessage("Notification delivered")
                    .addKeyValue("notification_id", notification.getId())
                    .addKeyValue("attempt", attemptNumber)
                    .log();
            return true;
        } catch (RuntimeException failure) {
            registerFailure(notification, attemptNumber, failure);
            return false;
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void releaseInterrupted(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.releaseInterruptedDelivery(Instant.now());
            log.atWarn()
                    .setMessage("Interrupted delivery released for a new attempt")
                    .addKeyValue("notification_id", notification.getId())
                    .addKeyValue("attempts", notification.getAttempts())
                    .log();
        });
    }

    private void registerFailure(Notification notification, int attemptNumber, RuntimeException failure) {
        String reason = describe(failure);
        attemptRepository.save(new DeliveryAttempt(
                notification.getId(),
                attemptNumber,
                DeliveryOutcome.FAILED,
                reason
        ));

        if (attemptNumber >= properties.maxDeliveryAttempts()) {
            notification.markDeliveryExhausted(reason);
            meterRegistry.counter("notifications_delivery_exhausted_total").increment();

            log.atError()
                    .setMessage("Notification delivery exhausted; manual retry required")
                    .addKeyValue("notification_id", notification.getId())
                    .addKeyValue("attempts", attemptNumber)
                    .addKeyValue("reason", reason)
                    .log();
            return;
        }

        Instant retryAt = Instant.now().plus(properties.backoffFor(attemptNumber));
        notification.recordFailedAttempt(reason, retryAt);
        meterRegistry.counter("notifications_delivery_failed_total").increment();

        log.atWarn()
                .setMessage("Notification delivery failed; retry scheduled")
                .addKeyValue("notification_id", notification.getId())
                .addKeyValue("attempt", attemptNumber)
                .addKeyValue("next_attempt_at", retryAt)
                .addKeyValue("reason", reason)
                .log();
    }

    private String describe(RuntimeException failure) {
        String message = failure.getMessage();
        return message == null || message.isBlank()
                ? failure.getClass().getSimpleName()
                : failure.getClass().getSimpleName() + ": " + message;
    }
}
