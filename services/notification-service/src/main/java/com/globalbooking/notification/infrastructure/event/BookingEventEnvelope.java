package com.globalbooking.notification.infrastructure.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.Instant;
import java.util.UUID;

/**
 * Envelope published by the booking-service on {@code booking.*} routing keys.
 * <p>
 * Unlike the auth envelope it has no {@code producer} or {@code aggregateType}, and the customer identity is carried in
 * {@code userId}.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record BookingEventEnvelope(
        UUID eventId,
        String eventType,
        int eventVersion,
        UUID aggregateId,
        Instant occurredAt,
        UUID userId,
        String correlationId,
        BookingEventData data
) {
}
