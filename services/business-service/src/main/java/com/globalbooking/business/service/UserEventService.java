package com.globalbooking.business.service;

import com.globalbooking.business.common.error.ErrorCode;
import com.globalbooking.business.common.exception.BusinessException;
import com.globalbooking.business.domain.ProcessedEvent;
import com.globalbooking.business.domain.ProcessedEventId;
import com.globalbooking.business.domain.UserProfile;
import com.globalbooking.business.repository.ProcessedEventRepository;
import com.globalbooking.business.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserEventService {
    private static final String CONSUMER_NAME = "business-service.auth-events";

    private final UserProfileRepository profileRepository;
    private final ProcessedEventRepository processedEventRepository;

    @Transactional
    public void process(UUID eventId, String eventType, Instant occurredAt, JsonNode data) {
        if (processedEventRepository.existsById(new ProcessedEventId(eventId, CONSUMER_NAME))) return;

        switch (eventType) {
            case "UserRegistered", "UserUpdated" -> upsertProfile(data, occurredAt);
            case "UserDeleted" -> deleteProfile(data, occurredAt);
            case "UserStatusChanged" -> changeStatus(data, occurredAt);
            default -> throw new PermanentEventException("Unsupported authentication event: " + eventType);
        }

        processedEventRepository.save(new ProcessedEvent(eventId, CONSUMER_NAME));
    }

    private void upsertProfile(JsonNode data, Instant occurredAt) {
        UUID userId = uuid(data, "userId");
        String email = text(data, "email");
        String username = data.hasNonNull("username") ? data.get("username").asText() : null;
        String role = text(data, "role");
        String status = text(data, "status");

        profileRepository.findByUserId(userId).ifPresentOrElse(profile -> {
            if (profile.acceptsEvent(occurredAt)) {
                profile.update(email, username, role, status, occurredAt);
            }
        }, () -> profileRepository.save(new UserProfile(userId, email, username, role, status, occurredAt)));
    }

    private void deleteProfile(JsonNode data, Instant occurredAt) {
        UUID userId = uuid(data, "userId");
        profileRepository.findByUserId(userId).ifPresent(profile -> {
            if (profile.acceptsEvent(occurredAt)) profile.markDeleted(occurredAt);
        });
    }

    private void changeStatus(JsonNode data, Instant occurredAt) {
        UUID userId = uuid(data, "userId");
        String newStatus = text(data, "newStatus");
        profileRepository.findByUserId(userId).ifPresent(profile -> {
            if (profile.acceptsEvent(occurredAt)) profile.changeStatus(newStatus, occurredAt);
        });
    }

    private UUID uuid(JsonNode data, String field) {
        try {
            return UUID.fromString(text(data, field));
        } catch (IllegalArgumentException exception) {
            throw new PermanentEventException("Invalid UUID in event field: " + field);
        }
    }

    private String text(JsonNode data, String field) {
        if (data == null || !data.hasNonNull(field) || data.get(field).asText().isBlank()) {
            throw new PermanentEventException("Missing required event field: " + field);
        }
        return data.get(field).asText();
    }

    public static class PermanentEventException extends BusinessException {
        public PermanentEventException(String message) {
            super(ErrorCode.EVENT_INVALID, HttpStatus.UNPROCESSABLE_ENTITY, message);
        }
    }
}
