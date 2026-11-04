package com.globalbooking.notification.infrastructure.messaging;

import com.globalbooking.notification.shared.common.exception.PermanentEventException;
import com.globalbooking.notification.infrastructure.event.AuthEventEnvelope;
import com.globalbooking.notification.infrastructure.event.BookingEventEnvelope;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Message;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;

/**
 * Decodes and validates integration event envelopes.
 * <p>
 * A malformed payload or an unsupported version can never succeed on a retry, so the failure is reported as permanent
 * and the message is dead-lettered instead of being retried.
 */
@Component
@RequiredArgsConstructor
public class EventEnvelopeDecoder {

    private static final int SUPPORTED_EVENT_VERSION = 1;

    private final ObjectMapper objectMapper;

    public AuthEventEnvelope decodeAuth(Message message) {
        String payload = body(message);
        AuthEventEnvelope event;
        try {
            event = objectMapper.readValue(payload, AuthEventEnvelope.class);
        } catch (RuntimeException failure) {
            throw new PermanentEventException("Malformed authentication event payload", failure);
        }

        requireEnvelope(event.eventId(), event.eventType(), event.eventVersion(), event.occurredAt());
        if (event.data() == null || event.data().isNull() || event.data().isMissingNode()) {
            throw new PermanentEventException("Authentication event has no data");
        }
        return event;
    }

    public BookingEventEnvelope decodeBooking(Message message) {
        String payload = body(message);
        BookingEventEnvelope event;
        try {
            event = objectMapper.readValue(payload, BookingEventEnvelope.class);
        } catch (RuntimeException failure) {
            throw new PermanentEventException("Malformed booking event payload", failure);
        }

        requireEnvelope(event.eventId(), event.eventType(), event.eventVersion(), event.occurredAt());
        if (event.data() == null) {
            throw new PermanentEventException("Booking event has no data");
        }
        if (event.userId() == null && event.data().userId() == null) {
            throw new PermanentEventException("Booking event does not identify the customer");
        }
        return event;
    }

    private void requireEnvelope(Object eventId, String eventType, int eventVersion, Object occurredAt) {
        if (eventId == null || eventType == null || eventType.isBlank() || occurredAt == null) {
            throw new PermanentEventException("Invalid event envelope: eventId, eventType and occurredAt are required");
        }
        if (eventVersion != SUPPORTED_EVENT_VERSION) {
            throw new PermanentEventException("Unsupported event version: " + eventVersion);
        }
    }

    private String body(Message message) {
        return new String(message.getBody(), StandardCharsets.UTF_8);
    }
}
