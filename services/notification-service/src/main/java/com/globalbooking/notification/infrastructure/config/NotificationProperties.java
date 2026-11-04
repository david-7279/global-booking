package com.globalbooking.notification.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/**
 * Delivery policy of the notification dispatcher.
 */
@ConfigurationProperties(prefix = "app.notification")
public record NotificationProperties(
        long dispatchDelayMs,
        int dispatchBatchSize,
        int maxDeliveryAttempts,
        long initialBackoffMs,
        long maxBackoffMs,
        long interruptedDeliveryThresholdMs,
        String defaultLocale
) {

    private static final int DEFAULT_BATCH_SIZE = 50;
    private static final int DEFAULT_MAX_DELIVERY_ATTEMPTS = 3;
    private static final long DEFAULT_INITIAL_BACKOFF_MS = 5_000L;
    private static final long DEFAULT_MAX_BACKOFF_MS = 300_000L;
    private static final long DEFAULT_DISPATCH_DELAY_MS = 2_000L;
    private static final long DEFAULT_INTERRUPTED_THRESHOLD_MS = 600_000L;
    private static final String DEFAULT_LOCALE = "en";

    public NotificationProperties {
        dispatchDelayMs = dispatchDelayMs > 0 ? dispatchDelayMs : DEFAULT_DISPATCH_DELAY_MS;
        dispatchBatchSize = dispatchBatchSize > 0 ? dispatchBatchSize : DEFAULT_BATCH_SIZE;
        maxDeliveryAttempts = maxDeliveryAttempts > 0 ? maxDeliveryAttempts : DEFAULT_MAX_DELIVERY_ATTEMPTS;
        initialBackoffMs = initialBackoffMs > 0 ? initialBackoffMs : DEFAULT_INITIAL_BACKOFF_MS;
        maxBackoffMs = maxBackoffMs >= initialBackoffMs ? maxBackoffMs : DEFAULT_MAX_BACKOFF_MS;
        interruptedDeliveryThresholdMs = interruptedDeliveryThresholdMs > 0
                ? interruptedDeliveryThresholdMs
                : DEFAULT_INTERRUPTED_THRESHOLD_MS;
        defaultLocale = defaultLocale == null || defaultLocale.isBlank() ? DEFAULT_LOCALE : defaultLocale;
    }

    /**
     * Exponential backoff for the next attempt: {@code initial * 2^(attempt - 1)}, capped by the maximum.
     */
    public Duration backoffFor(int failedAttempts) {
        int exponent = Math.max(0, failedAttempts - 1);
        long delay = initialBackoffMs;
        for (int index = 0; index < exponent && delay < maxBackoffMs; index++) {
            delay = Math.min(maxBackoffMs, delay * 2);
        }
        return Duration.ofMillis(Math.min(maxBackoffMs, delay));
    }

    public Duration interruptedDeliveryThreshold() {
        return Duration.ofMillis(interruptedDeliveryThresholdMs);
    }
}
