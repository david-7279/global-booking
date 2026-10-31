package com.globalbooking.auth.infrastructure.messaging;


import com.globalbooking.auth.infrastructure.outbox.OutboxEvent;
import com.globalbooking.auth.infrastructure.outbox.OutboxEventRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;

/**
 * Reliable outbox relay.
 * <p>
 * The database is the retry queue for publishing. This is intentional:
 * RabbitMQ retry queues cannot help when RabbitMQ itself is unavailable.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EventPublisher {

    private final OutboxEventRepository repository;
    private final RabbitTemplate rabbitTemplate;

    @org.springframework.beans.factory.annotation.Value("${app.outbox.max-attempts:3}")
    private int maxAttempts;

    @org.springframework.beans.factory.annotation.Value("${app.outbox.confirm-timeout-ms:5000}")
    private long confirmTimeoutMs;

    @org.springframework.beans.factory.annotation.Value("${app.outbox.retry-delays-ms:5000,30000,300000}")
    private String retryDelaysMs;

    @Scheduled(fixedDelayString = "${app.outbox.publish-delay-ms:1000}")
    public void publishPendingEvents() {
        repository
                .findTop50ByPublishedAtIsNullAndDeadLetteredAtIsNullAndNextAttemptAtLessThanEqualOrderByOccurredAtAsc(
                        Instant.now()
                )
                .forEach(this::publishOne);
    }

    private void publishOne(OutboxEvent event) {
        try {
            publishAndConfirm(
                    RabbitMqConfig.EVENTS_EXCHANGE,
                    event.getRoutingKey(),
                    event,
                    false
            );

            event.markPublished();
            repository.save(event);
        } catch (Exception exception) {
            handleFailure(event, exception);
        }
    }

    private void handleFailure(OutboxEvent event, Exception exception) {
        boolean permanent = isPermanentFailure(exception);
        int nextAttempt = event.getAttempts() + 1;

        event.markFailed(
                exception,
                nextAttemptAtFor(nextAttempt)
        );
        repository.save(event);

        if (permanent || event.getAttempts() >= maxAttempts) {
            routeToDeadLetter(event, exception);
            return;
        }

        log.warn(
                "Publish failed for outbox event {}. Retry {} scheduled for {}",
                event.getId(),
                event.getAttempts(),
                nextAttemptAtFor(nextAttempt),
                exception
        );
    }

    private void routeToDeadLetter(
            OutboxEvent event,
            Exception originalFailure
    ) {
        try {
            publishAndConfirm(
                    RabbitMqConfig.DEAD_LETTER_EXCHANGE,
                    RabbitMqConfig.PUBLISHER_DLQ_ROUTING_KEY,
                    event,
                    true
            );

            event.markDeadLettered();
            repository.save(event);

            log.error(
                    "Outbox event {} was moved to {} after {} attempts",
                    event.getId(),
                    RabbitMqConfig.PUBLISHER_DLQ,
                    event.getAttempts(),
                    originalFailure
            );
        } catch (Exception deadLetterFailure) {
            // Keep the row pending. The next scheduler run will try the DLQ again.
            event.markFailed(
                    deadLetterFailure,
                    Instant.now().plus(Duration.ofMinutes(5))
            );
            repository.save(event);

            log.error(
                    "Could not move outbox event {} to the dead-letter exchange",
                    event.getId(),
                    deadLetterFailure
            );
        }
    }

    private void publishAndConfirm(
            String exchange,
            String routingKey,
            OutboxEvent event,
            boolean deadLetter
    ) throws Exception {
        CorrelationData correlationData = new CorrelationData(
                event.getId().toString()
        );

        Message message = MessageBuilder
                .withBody(event.getPayload().getBytes(StandardCharsets.UTF_8))
                .setContentType(MessageProperties.CONTENT_TYPE_JSON)
                .setContentEncoding(StandardCharsets.UTF_8.name())
                .setMessageId(event.getId().toString())
                .setHeader("eventType", event.getEventType())
                .setHeader("x-outbox-event-id", event.getId().toString())
                .setHeader("x-outbox-attempts", event.getAttempts())
                .setHeader("x-dead-letter-message", deadLetter)
                .setHeader("x-original-routing-key", event.getRoutingKey())
                .build();

        rabbitTemplate.send(exchange, routingKey, message, correlationData);

        CorrelationData.Confirm confirm = correlationData
                .getFuture()
                .get(confirmTimeoutMs, java.util.concurrent.TimeUnit.MILLISECONDS);

        if (!confirm.ack()) {
            throw new TransientPublishException(
                    "RabbitMQ publisher confirm was negative: "
                            + confirm.reason()
            );
        }

        if (correlationData.getReturned() != null) {
            throw new PermanentPublishException(
                    "RabbitMQ returned the message: "
                            + correlationData.getReturned().getReplyText()
            );
        }
    }

    private Instant nextAttemptAtFor(int attempt) {
        long[] delays = Arrays.stream(retryDelaysMs.split(","))
                .map(String::trim)
                .mapToLong(Long::parseLong)
                .toArray();

        int index = Math.min(attempt - 1, delays.length - 1);
        return Instant.now().plusMillis(delays[index]);
    }

    private boolean isPermanentFailure(Exception exception) {
        return exception instanceof PermanentPublishException
                || exception instanceof IllegalArgumentException;
    }

    private static class TransientPublishException extends AmqpException {
        TransientPublishException(String message) {
            super(message);
        }
    }

    private static class PermanentPublishException extends RuntimeException {
        PermanentPublishException(String message) {
            super(message);
        }
    }
}
