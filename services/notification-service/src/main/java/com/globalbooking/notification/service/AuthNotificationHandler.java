package com.globalbooking.notification.service;

import com.globalbooking.notification.shared.common.exception.PermanentEventException;
import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationRecipient;
import com.globalbooking.notification.domain.NotificationTemplateCode;
import com.globalbooking.notification.infrastructure.event.AuthEventEnvelope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Turns auth user events into notifications and keeps the recipient projection up to date.
 * <p>
 * {@code UserUpdated} intentionally produces no notification: profile changes are user initiated and notifying them
 * would add noise. The event is still consumed and recorded, because the projection must be refreshed.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthNotificationHandler {

    private static final Set<String> SUPPORTED_EVENTS = Set.of(
            "UserRegistered",
            "UserUpdated",
            "UserStatusChanged",
            "UserDeleted"
    );

    private final RecipientDirectory recipients;
    private final NotificationComposer composer;

    public boolean supports(String eventType) {
        return SUPPORTED_EVENTS.contains(eventType);
    }

    public List<NotificationDraft> handle(AuthEventEnvelope event) {
        EventSource source = new EventSource(event.eventId(), event.eventType(), event.correlationId());

        return switch (event.eventType()) {
            case "UserRegistered" -> registered(event, source);
            case "UserUpdated" -> updated(event);
            case "UserStatusChanged" -> statusChanged(event, source);
            case "UserDeleted" -> deleted(event, source);
            default -> throw new PermanentEventException(
                    "Unsupported authentication event: " + event.eventType()
            );
        };
    }

    private List<NotificationDraft> registered(AuthEventEnvelope event, EventSource source) {
        JsonNode data = event.data();
        UUID userId = uuid(data, "userId");
        String email = text(data, "email");
        String role = text(data, "role");
        String status = text(data, "status");
        String username = optionalText(data, "username");

        NotificationRecipient recipient = recipients.upsert(
                userId,
                email,
                username,
                status,
                event.occurredAt()
        );

        TemplateVariables variables = TemplateVariables.create()
                .with("recipientName", recipient.displayName())
                .with("recipientEmail", recipient.getEmail())
                .with("role", role)
                .with("accountStatus", status);

        return compose(NotificationTemplateCode.USER_REGISTERED, recipient, variables, source);
    }

    private List<NotificationDraft> updated(AuthEventEnvelope event) {
        JsonNode data = event.data();
        UUID userId = uuid(data, "userId");
        String email = text(data, "email");
        String status = text(data, "status");

        recipients.upsert(
                userId,
                email,
                optionalText(data, "username"),
                status,
                event.occurredAt()
        );

        log.atDebug()
                .setMessage("Recipient projection refreshed from UserUpdated")
                .addKeyValue("user_id", userId)
                .log();

        return List.of();
    }

    private List<NotificationDraft> statusChanged(AuthEventEnvelope event, EventSource source) {
        JsonNode data = event.data();
        UUID userId = uuid(data, "userId");
        String previousStatus = text(data, "previousStatus");
        String newStatus = text(data, "newStatus");

        NotificationRecipient recipient = recipients.require(userId);
        if (recipient.isDeleted()) {
            log.atInfo()
                    .setMessage("Ignoring status change for a deleted recipient")
                    .addKeyValue("user_id", userId)
                    .log();
            return List.of();
        }

        recipients.changeStatus(userId, newStatus, event.occurredAt());

        TemplateVariables variables = TemplateVariables.create()
                .with("recipientName", recipient.displayName())
                .with("recipientEmail", recipient.getEmail())
                .with("previousStatus", previousStatus)
                .with("newStatus", newStatus);

        return compose(NotificationTemplateCode.USER_STATUS_CHANGED, recipient, variables, source);
    }

    private List<NotificationDraft> deleted(AuthEventEnvelope event, EventSource source) {
        JsonNode data = event.data();
        UUID userId = uuid(data, "userId");
        Instant deletedAt = instant(data, "deletedAt").orElse(event.occurredAt());

        return recipients.find(userId)
                .filter(recipient -> !recipient.isDeleted())
                .map(recipient -> {
                    TemplateVariables variables = TemplateVariables.create()
                            .with("recipientName", recipient.displayName())
                            .with("recipientEmail", recipient.getEmail())
                            .with("deletedAt", deletedAt);

                    List<NotificationDraft> drafts = compose(
                            NotificationTemplateCode.USER_DELETED,
                            recipient,
                            variables,
                            source
                    );

                    recipients.delete(userId, deletedAt);
                    return drafts;
                })
                .orElseGet(() -> {
                    log.atInfo()
                            .setMessage("Ignoring UserDeleted for an unknown or already deleted recipient")
                            .addKeyValue("user_id", userId)
                            .log();
                    return List.of();
                });
    }

    private List<NotificationDraft> compose(
            NotificationTemplateCode code,
            NotificationRecipient recipient,
            TemplateVariables variables,
            EventSource source
    ) {
        return composer.compose(code, NotificationChannel.EMAIL, recipient, variables, source)
                .map(List::of)
                .orElseGet(List::of);
    }

    private UUID uuid(JsonNode data, String field) {
        try {
            return UUID.fromString(text(data, field));
        } catch (IllegalArgumentException exception) {
            throw new PermanentEventException("Invalid UUID in event field '" + field + "'", exception);
        }
    }

    private String text(JsonNode data, String field) {
        if (data == null || !data.hasNonNull(field) || data.get(field).asString().isBlank()) {
            throw new PermanentEventException("Missing required event field: " + field);
        }
        return data.get(field).asString();
    }

    private String optionalText(JsonNode data, String field) {
        if (data == null || !data.hasNonNull(field)) {
            return null;
        }
        String value = data.get(field).asString();
        return value == null || value.isBlank() ? null : value;
    }

    private Optional<Instant> instant(JsonNode data, String field) {
        if (data == null || !data.hasNonNull(field)) {
            return Optional.empty();
        }
        try {
            return Optional.of(Instant.parse(data.get(field).asString()));
        } catch (DateTimeParseException exception) {
            throw new PermanentEventException("Invalid timestamp in event field '" + field + "'", exception);
        }
    }
}
