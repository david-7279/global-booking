package com.globalbooking.notification.domain;

/**
 * Stable template identifiers. A code identifies a message intent, while the combination of code, channel, locale and
 * version identifies the concrete content stored in {@code notification_templates}.
 */
public enum NotificationTemplateCode {

    USER_REGISTERED,
    USER_STATUS_CHANGED,
    USER_DELETED,

    BOOKING_CREATED,
    BOOKING_CONFIRMED,
    BOOKING_CANCELLED,
    BOOKING_REJECTED,
    BOOKING_COMPLETED
}
