package com.globalbooking.notification.domain;

/**
 * Delivery channel of a notification.
 */
public enum NotificationChannel {

    /**
     * Message stored in the platform inbox and read by the user through the API.
     */
    IN_APP,

    /**
     * Message delivered to the recipient email address.
     */
    EMAIL;

    public boolean requiresEmailAddress() {
        return this == EMAIL;
    }
}
