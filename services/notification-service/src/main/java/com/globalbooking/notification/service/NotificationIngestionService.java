package com.globalbooking.notification.service;

import com.globalbooking.notification.shared.common.exception.PermanentEventException;
import com.globalbooking.notification.domain.Notification;
import com.globalbooking.notification.domain.ProcessedEvent;
import com.globalbooking.notification.domain.ProcessedEventId;
import com.globalbooking.notification.infrastructure.event.AuthEventEnvelope;
import com.globalbooking.notification.infrastructure.event.BookingEventEnvelope;
import com.globalbooking.notification.mapper.NotificationMapper;
import com.globalbooking.notification.repository.NotificationRepository;
import com.globalbooking.notification.repository.ProcessedEventRepository;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Consumes integration events exactly once per consumer family.
 * <p>
 * The notifications and the {@code processed_events} row are written in the same transaction: either the event is fully
 * processed and acknowledged, or nothing is persisted and the message is retried.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationIngestionService {

    /**
     * Consumer names are part of the idempotency key. Changing them would make the service reprocess past events.
     */
    public static final String AUTH_CONSUMER_NAME = "notification-service.auth-events";
    public static final String BOOKING_CONSUMER_NAME = "notification-service.booking-events";

    private final NotificationRepository notificationRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final AuthNotificationHandler authHandler;
    private final BookingNotificationHandler bookingHandler;
    private final NotificationMapper mapper;
    private final MeterRegistry meterRegistry;

    @Transactional
    public void ingestAuth(AuthEventEnvelope event) {
        if (!authHandler.supports(event.eventType())) {
            throw new PermanentEventException("Unsupported authentication event: " + event.eventType());
        }
        process(
                AUTH_CONSUMER_NAME,
                event.eventId(),
                event.eventType(),
                () -> authHandler.handle(event)
        );
    }

    @Transactional
    public void ingestBooking(BookingEventEnvelope event) {
        if (!bookingHandler.supports(event.eventType())) {
            throw new PermanentEventException("Unsupported booking event: " + event.eventType());
        }
        process(
                BOOKING_CONSUMER_NAME,
                event.eventId(),
                event.eventType(),
                () -> bookingHandler.handle(event)
        );
    }

    private void process(
            String consumerName,
            UUID eventId,
            String eventType,
            Supplier<List<NotificationDraft>> handler
    ) {
        ProcessedEventId key = new ProcessedEventId(eventId, consumerName);
        if (processedEventRepository.existsById(key)) {
            log.atInfo()
                    .setMessage("Duplicate event ignored")
                    .addKeyValue("event_id", eventId)
                    .addKeyValue("event_type", eventType)
                    .addKeyValue("consumer", consumerName)
                    .log();
            meterRegistry.counter(
                    "notification_events_processed_total",
                    "consumer", consumerName,
                    "outcome", "duplicate"
            ).increment();
            return;
        }

        List<NotificationDraft> drafts = handler.get();
        Instant availableAt = Instant.now();

        for (NotificationDraft draft : drafts) {
            Notification notification = notificationRepository.save(mapper.toEntity(draft, availableAt));
            meterRegistry.counter(
                    "notifications_created_total",
                    "channel", notification.getChannel().name(),
                    "template", notification.getTemplateCode().name()
            ).increment();
        }

        processedEventRepository.save(new ProcessedEvent(eventId, consumerName));
        meterRegistry.counter(
                "notification_events_processed_total",
                "consumer", consumerName,
                "outcome", "processed"
        ).increment();

        log.atInfo()
                .setMessage("Event processed")
                .addKeyValue("event_id", eventId)
                .addKeyValue("event_type", eventType)
                .addKeyValue("consumer", consumerName)
                .addKeyValue("notifications", drafts.size())
                .log();
    }
}
