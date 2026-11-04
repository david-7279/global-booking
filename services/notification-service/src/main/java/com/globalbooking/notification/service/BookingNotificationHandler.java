package com.globalbooking.notification.service;

import com.globalbooking.notification.shared.common.exception.PermanentEventException;
import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationRecipient;
import com.globalbooking.notification.domain.NotificationTemplateCode;
import com.globalbooking.notification.infrastructure.event.BookingEventData;
import com.globalbooking.notification.infrastructure.event.BookingEventEnvelope;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/**
 * Turns booking lifecycle events into an email and an in-app notification for the customer.
 * <p>
 * The routing is data driven: the event type selects the template, while the variables are built once and reused by both
 * channels.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingNotificationHandler {

    private static final Map<String, NotificationTemplateCode> TEMPLATES = Map.of(
            "BookingCreated", NotificationTemplateCode.BOOKING_CREATED,
            "BookingConfirmed", NotificationTemplateCode.BOOKING_CONFIRMED,
            "BookingCancelled", NotificationTemplateCode.BOOKING_CANCELLED,
            "BookingRejected", NotificationTemplateCode.BOOKING_REJECTED,
            "BookingCompleted", NotificationTemplateCode.BOOKING_COMPLETED
    );

    private final RecipientDirectory recipients;
    private final NotificationComposer composer;

    public boolean supports(String eventType) {
        return TEMPLATES.containsKey(eventType);
    }

    public List<NotificationDraft> handle(BookingEventEnvelope event) {
        NotificationTemplateCode code = TEMPLATES.get(event.eventType());
        if (code == null) {
            throw new PermanentEventException("Unsupported booking event: " + event.eventType());
        }

        BookingEventData booking = requireBooking(event);
        UUID recipientUserId = recipientUserId(event, booking);
        NotificationRecipient recipient = recipients.require(recipientUserId);

        if (recipient.isDeleted()) {
            log.atInfo()
                    .setMessage("Ignoring booking event for a deleted recipient")
                    .addKeyValue("user_id", recipientUserId)
                    .addKeyValue("event_type", event.eventType())
                    .log();
            return List.of();
        }

        EventSource source = new EventSource(event.eventId(), event.eventType(), event.correlationId());
        TemplateVariables variables = variables(recipient, booking);

        List<NotificationDraft> drafts = new ArrayList<>(2);
        composer.compose(code, NotificationChannel.EMAIL, recipient, variables, source)
                .ifPresent(drafts::add);
        composer.compose(code, NotificationChannel.IN_APP, recipient, variables, source)
                .ifPresent(drafts::add);

        return List.copyOf(drafts);
    }

    private BookingEventData requireBooking(BookingEventEnvelope event) {
        BookingEventData booking = event.data();
        if (booking == null
                || booking.id() == null
                || booking.startAt() == null
                || booking.endAt() == null
                || booking.status() == null
                || booking.status().isBlank()) {
            throw new PermanentEventException(
                    "Booking event " + event.eventType() + " is missing the booking snapshot"
            );
        }
        return booking;
    }

    private UUID recipientUserId(BookingEventEnvelope event, BookingEventData booking) {
        UUID userId = event.userId() != null ? event.userId() : booking.userId();
        if (userId == null) {
            throw new PermanentEventException("Booking event does not identify the customer");
        }
        return userId;
    }

    private TemplateVariables variables(NotificationRecipient recipient, BookingEventData booking) {
        return TemplateVariables.create()
                .with("recipientName", recipient.displayName())
                .with("recipientEmail", recipient.getEmail())
                .with("bookingId", booking.id())
                .with("bookingReference", reference(booking.id()))
                .with("bookingStatus", booking.status())
                .with("startAt", booking.startAt())
                .with("endAt", booking.endAt())
                .with("businessId", booking.businessId())
                .with("establishmentId", booking.establishmentId())
                .with("serviceId", booking.bookingServiceId())
                .with("resourceId", booking.resourceId());
    }

    private String reference(UUID bookingId) {
        return bookingId.toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }
}
