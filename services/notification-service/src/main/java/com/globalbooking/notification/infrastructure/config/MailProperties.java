package com.globalbooking.notification.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Outbound email configuration.
 * <p>
 * When {@code enabled} is false the service keeps persisting notifications and logs the email instead of contacting an
 * SMTP server. This keeps local development and tests independent from a mail provider.
 */
@ConfigurationProperties(prefix = "app.mail")
public record MailProperties(
        boolean enabled,
        String from,
        String fromName,
        String subjectPrefix
) {

    public MailProperties {
        from = from == null || from.isBlank() ? "no-reply@global-booking.local" : from;
        fromName = fromName == null || fromName.isBlank() ? "Global Booking" : fromName;
        subjectPrefix = subjectPrefix == null ? "" : subjectPrefix;
    }

    /**
     * Applies the configured prefix once, so a template subject is never prefixed twice.
     */
    public String decorateSubject(String subject) {
        if (subject == null || subject.isBlank() || subjectPrefix.isBlank()) {
            return subject;
        }
        return subject.startsWith(subjectPrefix) ? subject : subjectPrefix + " " + subject;
    }

    public String decoratedFrom() {
        return "%s <%s>".formatted(fromName, from);
    }
}
