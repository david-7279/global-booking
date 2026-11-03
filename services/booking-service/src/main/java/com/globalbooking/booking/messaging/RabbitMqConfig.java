package com.globalbooking.booking.messaging;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {
    public static final String EVENTS_EXCHANGE = "global-booking.events";
    public static final String DEAD_LETTER_EXCHANGE = "global-booking.events.dlx";
    public static final String OUTBOX_DLQ_ROUTING_KEY = "booking.outbox.failed";

    @Bean
    TopicExchange eventsExchange() {
        return new TopicExchange(EVENTS_EXCHANGE, true, false);
    }

    @Bean
    TopicExchange deadLetterExchange() {
        return new TopicExchange(DEAD_LETTER_EXCHANGE, true, false);
    }
}
