package com.globalbooking.notification.infrastructure.messaging;

import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

/**
 * Publishes a failed message to the dead-letter exchange using the documented {@code <routing-key>.failed} key and
 * records an audit row with the original payload.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DeadLetterPublisher {

    private static final int MAX_REASON_LENGTH = 900;

    private final RabbitTemplate rabbitTemplate;
    private final DeadLetterAuditService auditService;
    private final ObjectMapper objectMapper;
    private final MeterRegistry meterRegistry;

    public void publish(
            Message message,
            String queueName,
            String consumerName,
            String routingKey,
            String category,
            String failureReason
    ) {
        String originalRoutingKey = MessageHeaders.originalRoutingKey(message, routingKey);
        String deadLetterRoutingKey = deadLetterRoutingKey(originalRoutingKey, queueName);
        int retryCount = MessageHeaders.retryCount(message);
        String payload = new String(message.getBody(), StandardCharsets.UTF_8);
        PayloadMetadata metadata = metadata(payload, message);

        Message deadLetter = MessageBuilder
                .withBody(message.getBody())
                .copyHeaders(message.getMessageProperties().getHeaders())
                .setContentType(MessageProperties.CONTENT_TYPE_JSON)
                .setContentEncoding(StandardCharsets.UTF_8.name())
                .setHeader(MessageHeaders.CONSUMER_NAME, consumerName)
                .setHeader(MessageHeaders.ORIGINAL_ROUTING_KEY, originalRoutingKey)
                .setHeader(MessageHeaders.RETRY_COUNT, retryCount)
                .setHeader(MessageHeaders.LAST_ERROR, truncate(failureReason))
                .setHeader(MessageHeaders.EVENT_ID, metadata.eventId())
                .setHeader(MessageHeaders.EVENT_TYPE, metadata.eventType())
                .build();

        rabbitTemplate.send(RabbitMqConfig.DEAD_LETTER_EXCHANGE, deadLetterRoutingKey, deadLetter);

        auditService.record(
                toUuid(metadata.eventId()),
                consumerName,
                metadata.eventType(),
                queueName,
                originalRoutingKey,
                payload,
                failureReason,
                retryCount
        );

        meterRegistry.counter(
                "notification_events_dead_lettered_total",
                "consumer", consumerName,
                "reason", category
        ).increment();

        log.atError()
                .setMessage("Message routed to the dead-letter queue")
                .addKeyValue("queue", queueName)
                .addKeyValue("consumer", consumerName)
                .addKeyValue("routing_key", originalRoutingKey)
                .addKeyValue("dead_letter_routing_key", deadLetterRoutingKey)
                .addKeyValue("event_id", metadata.eventId())
                .addKeyValue("event_type", metadata.eventType())
                .addKeyValue("retry_count", retryCount)
                .addKeyValue("reason", failureReason)
                .log();
    }

    private String deadLetterRoutingKey(String originalRoutingKey, String queueName) {
        if (originalRoutingKey == null || originalRoutingKey.isBlank()) {
            return queueName + RabbitMqConfig.UNROUTABLE_SUFFIX;
        }
        return originalRoutingKey + ".failed";
    }

    private PayloadMetadata metadata(String payload, Message message) {
        String eventId = header(message, MessageHeaders.EVENT_ID);
        String eventType = header(message, MessageHeaders.EVENT_TYPE);

        try {
            JsonNode node = objectMapper.readTree(payload);
            if (node != null) {
                eventId = text(node, "eventId", eventId);
                eventType = text(node, "eventType", eventType);
            }
        } catch (RuntimeException ignored) {
            // The payload is not valid JSON; the headers still identify the message when available.
        }

        if (eventType == null) {
            eventType = header(message, "eventType");
        }
        return new PayloadMetadata(eventId, eventType);
    }

    private String text(JsonNode node, String field, String fallback) {
        return node.hasNonNull(field) ? node.get(field).asString() : fallback;
    }

    private String header(Message message, String name) {
        Object value = message.getMessageProperties().getHeaders().get(name);
        return value instanceof String text && !text.isBlank() ? text : null;
    }

    private UUID toUuid(String value) {
        if (value == null) {
            return null;
        }
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private String truncate(String reason) {
        if (reason == null) {
            return null;
        }
        return reason.length() <= MAX_REASON_LENGTH ? reason : reason.substring(0, MAX_REASON_LENGTH);
    }

    private record PayloadMetadata(String eventId, String eventType) {
    }
}
