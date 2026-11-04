package com.globalbooking.notification.dto.request;

import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationStatus;

/**
 * Optional filters applied when listing notifications.
 */
public record NotificationFilter(
        NotificationStatus status,
        NotificationChannel channel,
        Boolean unreadOnly
) {
}
