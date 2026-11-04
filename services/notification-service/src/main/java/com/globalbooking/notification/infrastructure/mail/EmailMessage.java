package com.globalbooking.notification.infrastructure.mail;

import java.util.UUID;

/**
 * Email content ready to be handed to the outbound adapter.
 */
public record EmailMessage(
        String recipient,
        String subject,
        String body,
        UUID notificationId,
        String correlationId
) {

    public EmailMessage {
        if (recipient == null || recipient.isBlank()) {
            throw new IllegalArgumentException("Email recipient is required");
        }
        if (subject == null || subject.isBlank()) {
            throw new IllegalArgumentException("Email subject is required");
        }
        if (body == null || body.isBlank()) {
            throw new IllegalArgumentException("Email body is required");
        }
    }

    /**
     * Recipient with the local part masked, safe for logs and audit trails.
     */
    public String maskedRecipient() {
        int at = recipient.indexOf('@');
        if (at <= 1) {
            return "***";
        }
        return recipient.substring(0, 1) + "***" + recipient.substring(at);
    }
}
