package com.globalbooking.auth.infrastructure.outbox;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

/**
 * Saves an event in the same database transaction as the business change.
 */
@Service
@RequiredArgsConstructor
public class OutboxEventService {

    private final OutboxEventRepository repository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void save(
            String eventType,
            String routingKey,
            Object eventEnvelope
    ) {
        try {
            String payload = objectMapper.writeValueAsString(eventEnvelope);
            repository.save(new OutboxEvent(eventType, routingKey, payload));
        } catch (JacksonException exception) {
            throw new IllegalStateException(
                    "Could not serialize outbox event",
                    exception
            );
        }
    }
}
