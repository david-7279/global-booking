package com.globalbooking.notification.dto.response;

import com.globalbooking.notification.domain.DeliveryOutcome;

import java.time.Instant;

public record NotificationAttemptResponse(
        Long id,
        int attemptNumber,
        DeliveryOutcome outcome,
        String errorMessage,
        Instant attemptedAt
) {
}
