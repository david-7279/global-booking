package com.globalbooking.notification.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

/**
 * Delayed retry policy applied to consumed integration events.
 * <p>
 * Each configured delay creates one retry queue. A message that fails processing is republished to the queue of the
 * next attempt; when the retry queue expires, the message returns to the main queue through the events exchange.
 */
@ConfigurationProperties(prefix = "app.messaging.retry")
public record RetryProperties(
        List<Long> delaysMs,
        int maxAttempts
) {

    private static final List<Long> DEFAULT_DELAYS_MS = List.of(5_000L, 30_000L, 300_000L);

    public RetryProperties {
        delaysMs = delaysMs == null || delaysMs.isEmpty()
                ? DEFAULT_DELAYS_MS
                : List.copyOf(delaysMs);
        maxAttempts = maxAttempts > 0 ? maxAttempts : delaysMs.size();
        if (maxAttempts > delaysMs.size()) {
            maxAttempts = delaysMs.size();
        }
    }

    /**
     * Delay applied after the given attempt number (1-based).
     */
    public Duration delayFor(int attempt) {
        int index = Math.min(Math.max(attempt, 1), delaysMs.size()) - 1;
        return Duration.ofMillis(delaysMs.get(index));
    }

    public int retryCountFor(int attempt) {
        return Math.min(Math.max(attempt, 1), maxAttempts);
    }
}
