package com.globalbooking.notification.repository;

import com.globalbooking.notification.domain.Notification;
import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

/**
 * Composable filters used by the notification listing endpoint.
 */
public final class NotificationSpecifications {

    private NotificationSpecifications() {
    }

    public static Specification<Notification> recipient(UUID userId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("recipientUserId"), userId);
    }

    public static Specification<Notification> status(NotificationStatus status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<Notification> channel(NotificationChannel channel) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("channel"), channel);
    }

    public static Specification<Notification> unread() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isNull(root.get("readAt")),
                criteriaBuilder.equal(root.get("channel"), NotificationChannel.IN_APP)
        );
    }
}
