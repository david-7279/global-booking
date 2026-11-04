package com.globalbooking.notification.infrastructure.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import tools.jackson.databind.JsonNode;

import java.time.Instant;
import java.util.UUID;

/**
 * Envelope published by the auth-service on {@code auth.user.*} routing keys.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record AuthEventEnvelope(
        UUID eventId,
        String eventType,
        int eventVersion,
        Instant occurredAt,
        String producer,
        String aggregateType,
        String aggregateId,
        String correlationId,
        JsonNode data
) {
}
