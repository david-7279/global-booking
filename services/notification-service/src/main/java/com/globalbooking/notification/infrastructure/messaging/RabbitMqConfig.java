package com.globalbooking.notification.infrastructure.messaging;

import com.globalbooking.notification.infrastructure.config.RetryProperties;
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * Consumers own their queues and bindings.
 * <p>
 * Topology:
 * <pre>
 * global-booking.events ── auth.user.* ─────────────► notification-service.auth-events
 *                       └─ booking.* ──────────────► notification-service.booking-events
 *
 * notification-service.*.retry-N (TTL) ── expires ──► global-booking.events (notification-service.*.replay)
 *
 * nack / exhausted ──► global-booking.events.dlx ── auth.user.*.failed / booking.*.failed ──► *.dlq
 * </pre>
 * Dead-lettering is explicit: the consumer republishes the failed message with the documented
 * {@code <original-routing-key>.failed} key and diagnostic headers. The queue dead-letter arguments are a second line
 * of defence for messages rejected by the container itself.
 */
@Configuration
public class RabbitMqConfig {

    public static final String EVENTS_EXCHANGE = "global-booking.events";
    public static final String DEAD_LETTER_EXCHANGE = "global-booking.events.dlx";
    public static final String RETRY_EXCHANGE = "global-booking.events.retry";

    public static final String AUTH_ROUTING_PATTERN = "auth.user.*";
    public static final String AUTH_DEAD_LETTER_PATTERN = "auth.user.*.failed";
    public static final String BOOKING_ROUTING_PATTERN = "booking.*";
    public static final String BOOKING_DEAD_LETTER_PATTERN = "booking.*.failed";

    public static final String DLQ_SUFFIX = ".dlq";
    public static final String UNROUTABLE_SUFFIX = ".unroutable";
    public static final String REPLAY_SUFFIX = ".replay";
    public static final String RETRY_QUEUE_SUFFIX = ".retry-";
    public static final String RETRY_KEY_SUFFIX = ".retry.";

    @Value("${app.messaging.auth-events-queue:notification-service.auth-events}")
    private String authQueueName;

    @Value("${app.messaging.booking-events-queue:notification-service.booking-events}")
    private String bookingQueueName;

    @Value("${spring.rabbitmq.listener.simple.prefetch:10}")
    private int prefetch;

    @Bean
    public TopicExchange eventsExchange() {
        return ExchangeBuilder.topicExchange(EVENTS_EXCHANGE).durable(true).build();
    }

    @Bean
    public TopicExchange deadLetterExchange() {
        return ExchangeBuilder.topicExchange(DEAD_LETTER_EXCHANGE).durable(true).build();
    }

    @Bean
    public TopicExchange retryExchange() {
        return ExchangeBuilder.topicExchange(RETRY_EXCHANGE).durable(true).build();
    }

    @Bean
    public Queue authEventsQueue() {
        return durableConsumerQueue(authQueueName);
    }

    @Bean
    public Queue authEventsDlq() {
        return QueueBuilder.durable(authQueueName + DLQ_SUFFIX).build();
    }

    @Bean
    public Queue bookingEventsQueue() {
        return durableConsumerQueue(bookingQueueName);
    }

    @Bean
    public Queue bookingEventsDlq() {
        return QueueBuilder.durable(bookingQueueName + DLQ_SUFFIX).build();
    }

    @Bean
    public Binding authEventsBinding(
            @Qualifier("authEventsQueue") Queue queue,
            @Qualifier("eventsExchange") TopicExchange exchange
    ) {
        return BindingBuilder.bind(queue).to(exchange).with(AUTH_ROUTING_PATTERN);
    }

    @Bean
    public Binding authEventsReplayBinding(
            @Qualifier("authEventsQueue") Queue queue,
            @Qualifier("eventsExchange") TopicExchange exchange
    ) {
        return BindingBuilder.bind(queue).to(exchange).with(authQueueName + REPLAY_SUFFIX);
    }

    @Bean
    public Binding authEventsDlqBinding(
            @Qualifier("authEventsDlq") Queue queue,
            @Qualifier("deadLetterExchange") TopicExchange exchange
    ) {
        return BindingBuilder.bind(queue).to(exchange).with(AUTH_DEAD_LETTER_PATTERN);
    }

    @Bean
    public Binding authEventsUnroutableBinding(
            @Qualifier("authEventsDlq") Queue queue,
            @Qualifier("deadLetterExchange") TopicExchange exchange
    ) {
        return BindingBuilder.bind(queue).to(exchange).with(authQueueName + UNROUTABLE_SUFFIX);
    }

    @Bean
    public Binding bookingEventsBinding(
            @Qualifier("bookingEventsQueue") Queue queue,
            @Qualifier("eventsExchange") TopicExchange exchange
    ) {
        return BindingBuilder.bind(queue).to(exchange).with(BOOKING_ROUTING_PATTERN);
    }

    @Bean
    public Binding bookingEventsReplayBinding(
            @Qualifier("bookingEventsQueue") Queue queue,
            @Qualifier("eventsExchange") TopicExchange exchange
    ) {
        return BindingBuilder.bind(queue).to(exchange).with(bookingQueueName + REPLAY_SUFFIX);
    }

    @Bean
    public Binding bookingEventsDlqBinding(
            @Qualifier("bookingEventsDlq") Queue queue,
            @Qualifier("deadLetterExchange") TopicExchange exchange
    ) {
        return BindingBuilder.bind(queue).to(exchange).with(BOOKING_DEAD_LETTER_PATTERN);
    }

    @Bean
    public Binding bookingEventsUnroutableBinding(
            @Qualifier("bookingEventsDlq") Queue queue,
            @Qualifier("deadLetterExchange") TopicExchange exchange
    ) {
        return BindingBuilder.bind(queue).to(exchange).with(bookingQueueName + UNROUTABLE_SUFFIX);
    }

    /**
     * One retry queue per configured delay. When the message expires, the retry queue dead-letters it back to the events
     * exchange using the replay key, so the consumer receives it again without blocking a listener thread.
     */
    @Bean
    public Declarables retryQueues(RetryProperties retryProperties) {
        List<Declarable> declarables = new ArrayList<>();

        for (String queueName : List.of(authQueueName, bookingQueueName)) {
            for (int attempt = 1; attempt <= retryProperties.maxAttempts(); attempt++) {
                Queue retryQueue = QueueBuilder
                        .durable(queueName + RETRY_QUEUE_SUFFIX + attempt)
                        .ttl((int) retryProperties.delayFor(attempt).toMillis())
                        .deadLetterExchange(EVENTS_EXCHANGE)
                        .deadLetterRoutingKey(queueName + REPLAY_SUFFIX)
                        .build();

                declarables.add(retryQueue);
                declarables.add(BindingBuilder
                        .bind(retryQueue)
                        .to(retryExchange())
                        .with(queueName + RETRY_KEY_SUFFIX + attempt));
            }
        }

        return new Declarables(declarables);
    }

    @Bean
    public SimpleRabbitListenerContainerFactory manualAckRabbitListenerContainerFactory(
            ConnectionFactory connectionFactory
    ) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        factory.setDefaultRequeueRejected(false);
        factory.setPrefetchCount(prefetch);
        return factory;
    }

    private Queue durableConsumerQueue(String queueName) {
        return QueueBuilder
                .durable(queueName)
                .deadLetterExchange(DEAD_LETTER_EXCHANGE)
                .deadLetterRoutingKey(queueName + UNROUTABLE_SUFFIX)
                .build();
    }
}
