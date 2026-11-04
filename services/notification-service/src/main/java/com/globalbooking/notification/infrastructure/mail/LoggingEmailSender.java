package com.globalbooking.notification.infrastructure.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * Development adapter: the email is logged instead of being sent. Active by default so the service runs without an
 * SMTP server, and whenever {@code app.mail.enabled=false}.
 */
@Slf4j
@Component
@ConditionalOnProperty(prefix = "app.mail", name = "enabled", havingValue = "false", matchIfMissing = true)
public class LoggingEmailSender implements EmailSender {

    private static final int PREVIEW_LENGTH = 240;

    @Override
    public void send(EmailMessage message) {
        log.atInfo()
                .setMessage("Email notification handed to the logging sender")
                .addKeyValue("notification_id", message.notificationId())
                .addKeyValue("recipient", message.maskedRecipient())
                .addKeyValue("subject", message.subject())
                .addKeyValue("preview", preview(message.body()))
                .log();
    }

    private String preview(String body) {
        String singleLine = body.replaceAll("\\s+", " ").trim();
        return singleLine.length() <= PREVIEW_LENGTH
                ? singleLine
                : singleLine.substring(0, PREVIEW_LENGTH) + "...";
    }
}
