package com.globalbooking.business.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {
    public static final String EVENTS_EXCHANGE = "global-booking.events";
    public static final String DEAD_LETTER_EXCHANGE = "global-booking.events.dlx";
    public static final String AUTH_EVENTS_DLQ_ROUTING_KEY = "business.auth-events.failed";

    @Value("${app.messaging.auth-events-queue:business-service.auth-events}")
    private String authEventsQueueName;

    @Value("${app.messaging.auth-events-dlq:business-service.auth-events.dlq}")
    private String authEventsDlqName;

    @Value("${app.messaging.retry.max-attempts:3}")
    private int maxAttempts;

    @Value("${app.messaging.retry.initial-interval-ms:1000}")
    private long initialInterval;

    @Value("${app.messaging.retry.multiplier:2.0}")
    private double multiplier;

    @Value("${app.messaging.retry.max-interval-ms:10000}")
    private long maxInterval;

    @Bean
    public TopicExchange eventsExchange() {
        return ExchangeBuilder.topicExchange(EVENTS_EXCHANGE).durable(true).build();
    }

    @Bean
    public TopicExchange deadLetterExchange() {
        return ExchangeBuilder.topicExchange(DEAD_LETTER_EXCHANGE).durable(true).build();
    }

    @Bean
    public Queue authEventsQueue() {
        return QueueBuilder.durable(authEventsQueueName).deadLetterExchange(DEAD_LETTER_EXCHANGE).deadLetterRoutingKey(AUTH_EVENTS_DLQ_ROUTING_KEY).build();
    }

    @Bean
    public Queue authEventsDlq() {
        return QueueBuilder.durable(authEventsDlqName).build();
    }

    @Bean
    public Binding authEventsBinding(@Qualifier("authEventsQueue") Queue q, @Qualifier("eventsExchange") TopicExchange e) {
        return BindingBuilder.bind(q).to(e).with("auth.user.*");
    }

    @Bean
    public Binding authEventsDlqBinding(@Qualifier("authEventsDlq") Queue q, @Qualifier("deadLetterExchange") TopicExchange e) {
        return BindingBuilder.bind(q).to(e).with(AUTH_EVENTS_DLQ_ROUTING_KEY);
    }

    @Bean
    public SimpleRabbitListenerContainerFactory manualAckRabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        var factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        factory.setDefaultRequeueRejected(false);
        factory.setPrefetchCount(10);
        factory.setAdviceChain(RetryInterceptorBuilder.stateless()
                .maxRetries(Math.max(0, maxAttempts - 1))
                .backOffOptions(initialInterval, multiplier, maxInterval)
                .recoverer(new RejectAndDontRequeueRecoverer())
                .build());
        return factory;
    }
}
