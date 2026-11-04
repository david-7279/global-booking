package com.globalbooking.notification.domain;

/**
 * Rendered notification content. The template version is kept so a notification can always be audited against the
 * exact content that produced it.
 */
public record NotificationContent(
        NotificationTemplateCode code,
        int version,
        String locale,
        String subject,
        String body
) {

    public NotificationContent {
        if (code == null) {
            throw new IllegalArgumentException("Template code is required");
        }
        if (version < 1) {
            throw new IllegalArgumentException("Template version must be positive");
        }
        if (locale == null || locale.isBlank()) {
            throw new IllegalArgumentException("Template locale is required");
        }
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("Notification subject is required");
        }
        if (body == null || body.isBlank()) {
            throw new IllegalArgumentException("Notification body is required");
        }
    }
}
