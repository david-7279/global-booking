package com.globalbooking.notification.infrastructure.mail;

import com.globalbooking.notification.infrastructure.config.MailProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

/**
 * Sends notifications through the configured SMTP server. Active only when {@code app.mail.enabled=true}.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.mail", name = "enabled", havingValue = "true")
public class SmtpEmailSender implements EmailSender {

    private final JavaMailSender javaMailSender;
    private final MailProperties properties;

    @Override
    public void send(EmailMessage message) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    false,
                    StandardCharsets.UTF_8.name()
            );
            helper.setFrom(properties.decoratedFrom());
            helper.setTo(message.recipient());
            helper.setSubject(properties.decorateSubject(message.subject()));
            helper.setText(message.body(), false);

            if (message.correlationId() != null) {
                mimeMessage.setHeader("X-Correlation-Id", message.correlationId());
            }
            if (message.notificationId() != null) {
                mimeMessage.setHeader("X-Notification-Id", message.notificationId().toString());
            }

            javaMailSender.send(mimeMessage);

            log.atInfo()
                    .setMessage("Email notification sent")
                    .addKeyValue("notification_id", message.notificationId())
                    .addKeyValue("recipient", message.maskedRecipient())
                    .log();
        } catch (MessagingException | MailException failure) {
            throw new EmailDeliveryException("SMTP delivery failed: " + failure.getMessage(), failure);
        }
    }
}
