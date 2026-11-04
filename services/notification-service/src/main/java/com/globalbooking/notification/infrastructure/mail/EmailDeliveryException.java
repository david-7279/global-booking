package com.globalbooking.notification.infrastructure.mail;

/**
 * Signals a failed email delivery attempt. The dispatcher decides between a new attempt and dead lettering.
 */
public class EmailDeliveryException extends RuntimeException {

    public EmailDeliveryException(String message) {
        super(message);
    }

    public EmailDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
