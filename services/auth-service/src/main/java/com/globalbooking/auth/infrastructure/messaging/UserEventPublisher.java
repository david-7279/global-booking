package com.globalbooking.auth.infrastructure.messaging;

import com.globalbooking.auth.domain.Status;
import com.globalbooking.auth.domain.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.globalbooking.auth.infrastructure.outbox.OutboxEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

/**
 * Converts user-domain changes into the public integration-event contracts.
 * <p>
 * This class never publishes directly to RabbitMQ. It writes an event to the
 * outbox so the caller's database transaction remains atomic.
 */
@Component
@RequiredArgsConstructor
public class UserEventPublisher {

    private static final String PRODUCER = "auth-service";
    private static final String AGGREGATE_TYPE = "User";
    private static final int EVENT_VERSION = 1;

    private final OutboxEventService outboxEventService;

    public void recordUserRegistered(User user) {
        record(
                "UserRegistered",
                "auth.user.registered",
                user.getPublicId(),
                new UserRegisteredData(
                        user.getPublicId(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getStatus().name()
                )
        );
    }

    public void recordUserUpdated(User user) {
        record(
                "UserUpdated",
                "auth.user.updated",
                user.getPublicId(),
                new UserUpdatedData(
                        user.getPublicId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getStatus().name()
                )
        );
    }

    public void recordUserDeleted(User user, Instant deletedAt) {
        record(
                "UserDeleted",
                "auth.user.deleted",
                user.getPublicId(),
                new UserDeletedData(user.getPublicId(), deletedAt)
        );
    }

    public void recordUserStatusChanged(
            User user,
            Status previousStatus
    ) {
        record(
                "UserStatusChanged",
                "auth.user.status-changed",
                user.getPublicId(),
                new UserStatusChangedData(
                        user.getPublicId(),
                        previousStatus.name(),
                        user.getStatus().name()
                )
        );
    }

    private void record(
            String eventType,
            String routingKey,
            UUID aggregateId,
            Object data
    ) {
        EventEnvelope event = new EventEnvelope(
                UUID.randomUUID(),
                eventType,
                EVENT_VERSION,
                Instant.now(),
                PRODUCER,
                AGGREGATE_TYPE,
                aggregateId,
                data
        );

        outboxEventService.save(eventType, routingKey, event);
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private record EventEnvelope(
            UUID eventId,
            String eventType,
            int eventVersion,
            Instant occurredAt,
            String producer,
            String aggregateType,
            UUID aggregateId,
            Object data
    ) {
    }

    private record UserRegisteredData(
            UUID userId,
            String email,
            String role,
            String status
    ) {
    }

    private record UserUpdatedData(
            UUID userId,
            String username,
            String email,
            String role,
            String status
    ) {
    }

    private record UserDeletedData(
            UUID userId,
            Instant deletedAt
    ) {
    }

    private record UserStatusChangedData(
            UUID userId,
            String previousStatus,
            String newStatus
    ) {
    }
}
