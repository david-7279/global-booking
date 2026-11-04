package com.globalbooking.notification.infrastructure.messaging;

import com.rabbitmq.client.Channel;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Applies the acknowledgement policy of the service.
 * <p>
 * The message is always settled explicitly: transient failures are republished to a delayed retry queue, permanent
 * failures and exhausted attempts are dead-lettered, and only then is the original delivery acknowledged. If the
 * failure cannot be forwarded, the message is rejected without requeue and the queue dead-letter arguments route it to
 * the DLQ, so no event is silently lost.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EventFailureHandler {

    private final FailureClassifier classifier;
    private final RetryPublisher retryPublisher;
    private final DeadLetterPublisher deadLetterPublisher;
    private final MeterRegistry meterRegistry;

    public void handle(
            Message message,
            Channel channel,
            long deliveryTag,
            String queueName,
            String consumerName,
            String routingKey,
            Exception failure
    ) throws IOException {
        String reason = describe(failure);

        try {
            if (classifier.isPermanent(failure)) {
                deadLetterPublisher.publish(
                        message,
                        queueName,
                        consumerName,
                        routingKey,
                        "permanent",
                        reason
                );
            } else {
                RetryOutcome outcome = retryPublisher.publishOrDeadLetter(
                        message,
                        queueName,
                        consumerName,
                        routingKey,
                        reason
                );

                if (outcome == RetryOutcome.SCHEDULED) {
                    meterRegistry.counter(
                            "notification_events_retried_total",
                            "consumer", consumerName
                    ).increment();
                }
            }

            channel.basicAck(deliveryTag, false);
        } catch (RuntimeException forwardingFailure) {
            log.atError()
                    .setMessage("Could not forward the failed message; rejecting it to the dead-letter queue")
                    .addKeyValue("queue", queueName)
                    .addKeyValue("consumer", consumerName)
                    .addKeyValue("delivery_tag", deliveryTag)
                    .addKeyValue("original_failure", reason)
                    .setCause(forwardingFailure)
                    .log();

            channel.basicNack(deliveryTag, false, false);
        }
    }

    private String describe(Exception failure) {
        String message = failure.getMessage();
        return message == null || message.isBlank()
                ? failure.getClass().getName()
                : failure.getClass().getSimpleName() + ": " + message;
    }
}
