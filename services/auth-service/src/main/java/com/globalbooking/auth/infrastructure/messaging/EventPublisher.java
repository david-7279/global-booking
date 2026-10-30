package com.globalbooking.auth.infrastructure.messaging;

import com.globalbooking.auth.infrastructure.outbox.OutboxEvent;
import com.globalbooking.auth.infrastructure.outbox.OutboxEventRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Small polling relay: reads pending rows and publishes them to RabbitMQ.
 * <p>
 * This simple version gives at-least-once delivery. If the application fails
 * after publishing but before marking the row as published, the event can be
 * sent again. Consumers must therefore be idempotent.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EventPublisher {

    private final OutboxEventRepository repository;
    private final RabbitTemplate rabbitTemplate;

    @Scheduled(fixedDelayString = "${app.outbox.publish-delay-ms:1000}")
    public void publishPendingEvents() {
        repository.findTop50ByPublishedAtIsNullOrderByOccurredAtAsc()
                .forEach(this::publishOne);
    }

    @Transactional
    protected void publishOne(OutboxEvent event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMqConfig.EVENTS_EXCHANGE,
                    event.getRoutingKey(),
                    event.getPayload()
            );

            event.markPublished();
            repository.save(event);
        } catch (Exception exception) {
            event.markFailed(exception);
            repository.save(event);

            log.warn(
                    "Could not publish outbox event {}. Attempt {}",
                    event.getId(),
                    event.getAttempts(),
                    exception
            );
        }
    }
}
