package com.globalbooking.notification.infrastructure.messaging;

import org.springframework.amqp.core.Message;

/**
 * Headers used to trace a message across retries and dead letters.
 */
public final class MessageHeaders {

    public static final String RETRY_COUNT = "x-retry-count";
    public static final String ORIGINAL_ROUTING_KEY = "x-original-routing-key";
    public static final String LAST_ERROR = "x-last-error";
    public static final String CONSUMER_NAME = "x-consumer-name";
    public static final String EVENT_ID = "x-event-id";
    public static final String EVENT_TYPE = "x-event-type";

    private MessageHeaders() {
    }

    public static int retryCount(Message message) {
        Object value = message.getMessageProperties().getHeaders().get(RETRY_COUNT);
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value instanceof String text) {
            try {
                return Integer.parseInt(text);
            } catch (NumberFormatException ignored) {
                return 0;
            }
        }
        return 0;
    }

    public static String originalRoutingKey(Message message, String receivedRoutingKey) {
        Object value = message.getMessageProperties().getHeaders().get(ORIGINAL_ROUTING_KEY);
        if (value instanceof String text && !text.isBlank()) {
            return text;
        }
        return receivedRoutingKey;
    }
}
