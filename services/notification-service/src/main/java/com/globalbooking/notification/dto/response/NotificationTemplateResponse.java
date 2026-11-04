package com.globalbooking.notification.dto.response;

import com.globalbooking.notification.domain.NotificationChannel;

import java.time.Instant;
import java.util.UUID;

public record NotificationTemplateResponse(
        UUID id,
        String code,
        NotificationChannel channel,
        String locale,
        int version,
        String subjectTemplate,
        String bodyTemplate,
        boolean active,
        String description,
        Instant createdAt,
        Instant updatedAt
) {
}
