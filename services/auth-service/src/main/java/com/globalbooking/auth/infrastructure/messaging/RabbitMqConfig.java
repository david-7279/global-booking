package com.globalbooking.auth.infrastructure.messaging;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class RabbitMqConfig {

    public static final String EVENTS_EXCHANGE = "global-booking.events";
    public static final String DEAD_LETTER_EXCHANGE = "global-booking.events.dlx";
    public static final String PUBLISHER_DLQ = "auth-service.outbox.dlq";
    public static final String PUBLISHER_DLQ_ROUTING_KEY = "auth.outbox.failed";

    @Bean
    public TopicExchange eventsExchange() {
        return ExchangeBuilder
                .topicExchange(EVENTS_EXCHANGE)
                .durable(true)
                .build();
    }

    @Bean
    public TopicExchange deadLetterExchange() {
        return ExchangeBuilder
                .topicExchange(DEAD_LETTER_EXCHANGE)
                .durable(true)
                .build();
    }

    @Bean
    public Queue publisherDeadLetterQueue() {
        return new Queue(PUBLISHER_DLQ, true, false, false);
    }

    @Bean
    public Binding publisherDeadLetterBinding(
            Queue publisherDeadLetterQueue,
            TopicExchange deadLetterExchange
    ) {
        return BindingBuilder
                .bind(publisherDeadLetterQueue)
                .to(deadLetterExchange)
                .with(PUBLISHER_DLQ_ROUTING_KEY);
    }
}
