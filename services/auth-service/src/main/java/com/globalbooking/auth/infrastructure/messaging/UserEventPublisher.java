package com.globalbooking.auth.infrastructure.messaging;

import com.globalbooking.auth.domain.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.globalbooking.auth.infrastructure.outbox.OutboxEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

/**
 * Converts a user-domain change into the public integration-event contract.
 */
@Component
@RequiredArgsConstructor
public class UserEventPublisher {

    private static final String EVENT_TYPE = "UserRegistered";
    private static final String ROUTING_KEY = "auth.user.registered";

    private final OutboxEventService outboxEventService;

    public void recordUserRegistered(User user) {
        UserRegisteredEvent event = new UserRegisteredEvent(
                UUID.randomUUID(),
                EVENT_TYPE,
                1,
                Instant.now(),
                "auth-service",
                "User",
                user.getPublicId(),
                new UserRegisteredData(
                        user.getPublicId(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getStatus().name()
                )
        );

        outboxEventService.save(EVENT_TYPE, ROUTING_KEY, event);
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private record UserRegisteredEvent(
            UUID eventId,
            String eventType,
            int eventVersion,
            Instant occurredAt,
            String producer,
            String aggregateType,
            UUID aggregateId,
            UserRegisteredData data
    ) {
    }

    private record UserRegisteredData(
            UUID userId,
            String email,
            String role,
            String status
    ) {
    }
}

