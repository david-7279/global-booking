package com.globalbooking.notification.infrastructure.messaging;

import com.globalbooking.notification.infrastructure.config.RetryProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

/**
 * Schedules a delayed retry without blocking the listener thread.
 * <p>
 * The message is published to the retry exchange with the key of the next attempt. The retry queue holds it for the
 * configured delay and then returns it to the consumer through the events exchange. Attempts are tracked in the
 * {@code x-retry-count} header, which also survives broker restarts because the queues are durable.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RetryPublisher {

    private static final int MAX_REASON_LENGTH = 900;

    private final RabbitTemplate rabbitTemplate;
    private final RetryProperties retryProperties;
    private final DeadLetterPublisher deadLetterPublisher;

    public RetryOutcome publishOrDeadLetter(
            Message message,
            String queueName,
            String consumerName,
            String routingKey,
            String failureReason
    ) {
        int attempt = MessageHeaders.retryCount(message) + 1;
        if (attempt > retryProperties.maxAttempts()) {
            deadLetterPublisher.publish(
                    message,
                    queueName,
                    consumerName,
                    routingKey,
                    "exhausted",
                    failureReason
            );
            return RetryOutcome.DEAD_LETTERED;
        }

        String originalRoutingKey = MessageHeaders.originalRoutingKey(message, routingKey);

        try {
            Message retryMessage = MessageBuilder
                    .withBody(message.getBody())
                    .copyHeaders(message.getMessageProperties().getHeaders())
                    .setContentType(MessageProperties.CONTENT_TYPE_JSON)
                    .setContentEncoding(StandardCharsets.UTF_8.name())
                    .setHeader(MessageHeaders.RETRY_COUNT, attempt)
                    .setHeader(MessageHeaders.ORIGINAL_ROUTING_KEY, originalRoutingKey)
                    .setHeader(MessageHeaders.CONSUMER_NAME, consumerName)
                    .setHeader(MessageHeaders.LAST_ERROR, truncate(failureReason))
                    .build();

            rabbitTemplate.send(
                    RabbitMqConfig.RETRY_EXCHANGE,
                    queueName + RabbitMqConfig.RETRY_KEY_SUFFIX + attempt,
                    retryMessage
            );

            log.atWarn()
                    .setMessage("Event processing failed; delayed retry scheduled")
                    .addKeyValue("queue", queueName)
                    .addKeyValue("consumer", consumerName)
                    .addKeyValue("attempt", attempt)
                    .addKeyValue("delay_ms", retryProperties.delayFor(attempt).toMillis())
                    .addKeyValue("reason", failureReason)
                    .log();

            return RetryOutcome.SCHEDULED;
        } catch (AmqpException publishFailure) {
            log.atError()
                    .setMessage("Could not schedule a retry; dead-lettering the message")
                    .addKeyValue("queue", queueName)
                    .addKeyValue("attempt", attempt)
                    .setCause(publishFailure)
                    .log();

            deadLetterPublisher.publish(
                    message,
                    queueName,
                    consumerName,
                    routingKey,
                    "retry-publish-failed",
                    "Could not schedule retry: " + publishFailure.getMessage()
            );
            return RetryOutcome.DEAD_LETTERED;
        }
    }

    private String truncate(String reason) {
        if (reason == null) {
            return null;
        }
        return reason.length() <= MAX_REASON_LENGTH ? reason : reason.substring(0, MAX_REASON_LENGTH);
    }
}
