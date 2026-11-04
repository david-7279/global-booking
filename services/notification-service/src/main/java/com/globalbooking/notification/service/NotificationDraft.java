package com.globalbooking.notification.service;

import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationContent;

import java.util.UUID;

/**
 * A notification that must be persisted for an event, before it becomes a {@code Notification} entity.
 */
public record NotificationDraft(
        UUID recipientUserId,
        String recipientEmail,
        NotificationChannel channel,
        NotificationContent content,
        EventSource source
) {
}
