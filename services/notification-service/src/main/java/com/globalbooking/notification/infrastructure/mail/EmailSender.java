package com.globalbooking.notification.infrastructure.mail;

/**
 * Outbound email port. Implementations decide whether the message really leaves the service.
 */
public interface EmailSender {

    /**
     * Delivers the message or throws {@link EmailDeliveryException} when the attempt failed.
     */
    void send(EmailMessage message);
}
