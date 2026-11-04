package com.globalbooking.notification.infrastructure.messaging;

import com.globalbooking.notification.service.NotificationIngestionService;
import com.rabbitmq.client.Channel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Transport adapter for {@code booking.*} events.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BookingEventConsumer {

    private final EventEnvelopeDecoder decoder;
    private final NotificationIngestionService ingestionService;
    private final EventFailureHandler failureHandler;

    @Value("${app.messaging.booking-events-queue:notification-service.booking-events}")
    private String queueName;

    @RabbitListener(
            queues = "${app.messaging.booking-events-queue:notification-service.booking-events}",
            containerFactory = "manualAckRabbitListenerContainerFactory"
    )
    public void consume(
            Message message,
            Channel channel,
            @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag,
            @Header(name = AmqpHeaders.RECEIVED_ROUTING_KEY, required = false) String routingKey
    ) throws IOException {
        try {
            ingestionService.ingestBooking(decoder.decodeBooking(message));
            channel.basicAck(deliveryTag, false);
        } catch (Exception failure) {
            failureHandler.handle(
                    message,
                    channel,
                    deliveryTag,
                    queueName,
                    NotificationIngestionService.BOOKING_CONSUMER_NAME,
                    routingKey,
                    failure
            );
        }
    }
}
