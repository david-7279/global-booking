package com.globalbooking.auth.infrastructure.messaging;

import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class RabbitMqConfig {

    public static final String EVENTS_EXCHANGE = "global-booking.events";

    @Bean
    public TopicExchange eventsExchange() {
        return ExchangeBuilder
                .topicExchange(EVENTS_EXCHANGE)
                .durable(true)
                .build();
    }
}
