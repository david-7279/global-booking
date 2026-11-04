package com.globalbooking.notification.domain;

/**
 * Lifecycle of a notification, independent of the channel used to deliver it.
 */
public enum NotificationStatus {

    /**
     * Persisted and waiting for the next delivery attempt.
     */
    PENDING,

    /**
     * Claimed by the dispatcher; a delivery attempt is in progress.
     */
    SENDING,

    /**
     * Delivered to the channel. In-app notifications are delivered when persisted.
     */
    SENT,

    /**
     * The last delivery attempt failed and a new attempt is scheduled.
     */
    FAILED,

    /**
     * The delivery attempts were exhausted. Manual intervention is required.
     */
    DEAD_LETTERED;

    public boolean isDeliverable() {
        return this == PENDING || this == FAILED;
    }

    public boolean isTerminal() {
        return this == SENT || this == DEAD_LETTERED;
    }
}
