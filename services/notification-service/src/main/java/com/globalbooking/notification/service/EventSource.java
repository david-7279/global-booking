package com.globalbooking.notification.service;

import java.util.UUID;

/**
 * Identity of the integration event that produced a notification.
 */
public record EventSource(
        UUID eventId,
        String eventType,
        String correlationId
) {
}
