package com.globalbooking.notification.dto.response;

import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationStatus;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        UUID recipientUserId,
        NotificationChannel channel,
        String templateCode,
        int templateVersion,
        String locale,
        String subject,
        String body,
        NotificationStatus status,
        int attempts,
        UUID sourceEventId,
        String sourceEventType,
        String correlationId,
        Instant nextAttemptAt,
        Instant sentAt,
        Instant failedAt,
        Instant readAt,
        String lastError,
        Instant createdAt,
        Instant updatedAt
) {
}
