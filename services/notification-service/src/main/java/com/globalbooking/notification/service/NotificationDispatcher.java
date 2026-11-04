package com.globalbooking.notification.service;

import com.globalbooking.notification.infrastructure.config.NotificationProperties;
import com.globalbooking.notification.domain.Notification;
import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationStatus;
import com.globalbooking.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Periodically delivers the notifications that are due.
 * <p>
 * Delivery state lives in the database, so a restart never loses a pending attempt. Notifications left in
 * {@code SENDING} by a stopped process are released back to the queue.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationDispatcher {

    private static final List<NotificationStatus> DUE_STATUSES =
            List.of(NotificationStatus.PENDING, NotificationStatus.FAILED);

    private final NotificationRepository notificationRepository;
    private final NotificationDeliveryService deliveryService;
    private final NotificationProperties properties;

    @Scheduled(fixedDelayString = "${app.notification.dispatch-delay-ms:2000}")
    public void dispatchDueNotifications() {
        releaseInterruptedDeliveries();

        List<UUID> due = notificationRepository.findDueIds(
                NotificationChannel.EMAIL,
                DUE_STATUSES,
                Instant.now(),
                PageRequest.of(0, properties.dispatchBatchSize())
        );

        if (due.isEmpty()) {
            return;
        }

        log.atDebug()
                .setMessage("Dispatching due notifications")
                .addKeyValue("count", due.size())
                .log();

        for (UUID notificationId : due) {
            try {
                deliveryService.deliver(notificationId);
            } catch (RuntimeException failure) {
                log.atError()
                        .setMessage("Unexpected failure while delivering notification")
                        .addKeyValue("notification_id", notificationId)
                        .setCause(failure)
                        .log();
            }
        }
    }

    private void releaseInterruptedDeliveries() {
        Instant cutoff = Instant.now().minus(properties.interruptedDeliveryThreshold());
        List<Notification> stale = notificationRepository.findStale(
                NotificationStatus.SENDING,
                cutoff,
                PageRequest.of(0, properties.dispatchBatchSize())
        );

        for (Notification notification : stale) {
            log.atWarn()
                    .setMessage("Releasing interrupted delivery")
                    .addKeyValue("notification_id", notification.getId())
                    .addKeyValue("updated_at", notification.getUpdatedAt())
                    .log();
            deliveryService.releaseInterrupted(notification.getId());
        }
    }
}
