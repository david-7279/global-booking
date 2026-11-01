package com.globalbooking.business.messaging;

import com.globalbooking.business.service.UserEventService;
import com.rabbitmq.client.Channel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthEventConsumer {
    private final ObjectMapper objectMapper;
    private final UserEventService userEventService;

    @RabbitListener(queues = "${app.messaging.auth-events-queue:business-service.auth-events}", containerFactory = "manualAckRabbitListenerContainerFactory")
    public void consume(Message message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws Exception {
        try {
            AuthEventEnvelope event = objectMapper.readValue(new String(message.getBody(), StandardCharsets.UTF_8), AuthEventEnvelope.class);
            validate(event);
            userEventService.process(event.eventId(), event.eventType(), event.occurredAt(), event.data());
            channel.basicAck(deliveryTag, false);
        } catch (UserEventService.PermanentEventException exception) {
            log.error("Permanent authentication event failure; sending to DLQ", exception);
            channel.basicNack(deliveryTag, false, false);
        } catch (Exception exception) {
            log.warn("Temporary authentication event failure; retry interceptor will apply backoff", exception);
            throw exception;
        }
    }

    private void validate(AuthEventEnvelope event) {
        if (event.eventId() == null || event.eventType() == null || event.eventVersion() != 1 || event.occurredAt() == null || event.data() == null) {
            throw new UserEventService.PermanentEventException("Invalid authentication event envelope");
        }
    }

    private record AuthEventEnvelope(UUID eventId, String eventType, int eventVersion, Instant occurredAt,
                                     JsonNode data) {
    }
}
