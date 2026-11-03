package com.globalbooking.booking.messaging;

import com.globalbooking.booking.domain.OutboxEvent;
import com.globalbooking.booking.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxPublisher {
    private final OutboxEventRepository repository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${app.messaging.exchange}")
    private String exchange;
    @Value("${app.messaging.max-attempts:3}")
    private int maxAttempts;
    @Value("${app.messaging.initial-backoff-ms:1000}")
    private long initialBackoff;
    @Value("${app.messaging.max-backoff-ms:10000}")
    private long maxBackoff;

    @Scheduled(fixedDelayString = "${app.messaging.outbox-delay-ms:1000}")
    public void publishPending() {
        repository.findTop100ByPublishedAtIsNullAndDeadLetteredAtIsNullAndNextAttemptAtLessThanEqualOrderByOccurredAtAsc(Instant.now()).forEach(this::publish);
    }

    private void publish(OutboxEvent event) {
        try {
            CorrelationData correlation = new CorrelationData(event.getId().toString());
            var message = MessageBuilder.withBody(event.getPayload().getBytes(StandardCharsets.UTF_8)).setContentType(MessageProperties.CONTENT_TYPE_JSON).setMessageId(event.getId().toString()).setHeader("eventType", event.getEventType()).build();
            rabbitTemplate.send(exchange, event.getRoutingKey(), message, correlation);
            var confirm = correlation.getFuture().get(5000, TimeUnit.MILLISECONDS);
            if (!confirm.ack()) throw new IllegalStateException("Negative publisher confirm: " + confirm.reason());
            event.markPublished();
            repository.save(event);
        } catch (Exception failure) {
            if (event.getAttempts() + 1 >= maxAttempts) {
                try {
                    rabbitTemplate.convertAndSend(RabbitMqConfig.DEAD_LETTER_EXCHANGE, RabbitMqConfig.OUTBOX_DLQ_ROUTING_KEY, event.getPayload());
                    event.markDeadLettered();
                    repository.save(event);
                } catch (Exception dlqFailure) {
                    event.retry(dlqFailure.getMessage(), maxBackoff);
                    repository.save(event);
                    log.error("Could not route booking outbox event to DLQ", dlqFailure);
                }
            } else {
                long delay = Math.min(maxBackoff, initialBackoff * (1L << event.getAttempts()));
                event.retry(failure.getMessage(), delay);
                repository.save(event);
                log.warn("Booking outbox publish failed; retry scheduled", failure);
            }
        }
    }
}
