package com.globalbooking.notification.domain;

import com.globalbooking.notification.shared.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;

/**
 * Versioned notification template.
 * <p>
 * Templates are append-only: a published version is never edited, because notifications already stored reference the
 * version that produced them. Instead a new version is registered and the previous one may be deactivated. Resolution
 * always selects the highest active version that is not greater than the requested version.
 */
@Getter
@Entity
@Table(
        name = "notification_templates",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_notification_templates_identity",
                columnNames = {"code", "channel", "locale", "version"}
        )
)
public class NotificationTemplate extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 60)
    private NotificationTemplateCode code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationChannel channel;

    @Column(nullable = false, length = 10)
    private String locale;

    @Column(nullable = false)
    private int version;

    @Column(name = "subject_template", nullable = false, length = 255)
    private String subjectTemplate;

    @Column(name = "body_template", nullable = false, columnDefinition = "TEXT")
    private String bodyTemplate;

    @Column(nullable = false)
    private boolean active;

    @Column(length = 500)
    private String description;

    protected NotificationTemplate() {
        // Required by JPA.
    }

    public NotificationTemplate(
            NotificationTemplateCode code,
            NotificationChannel channel,
            String locale,
            int version,
            String subjectTemplate,
            String bodyTemplate,
            String description
    ) {
        if (code == null) {
            throw new IllegalArgumentException("Template code is required");
        }
        if (channel == null) {
            throw new IllegalArgumentException("Template channel is required");
        }
        if (locale == null || locale.isBlank()) {
            throw new IllegalArgumentException("Template locale is required");
        }
        if (version < 1) {
            throw new IllegalArgumentException("Template version must be positive");
        }
        if (subjectTemplate == null || subjectTemplate.isBlank()) {
            throw new IllegalArgumentException("Template subject is required");
        }
        if (bodyTemplate == null || bodyTemplate.isBlank()) {
            throw new IllegalArgumentException("Template body is required");
        }

        this.code = code;
        this.channel = channel;
        this.locale = locale;
        this.version = version;
        this.subjectTemplate = subjectTemplate;
        this.bodyTemplate = bodyTemplate;
        this.description = description;
        this.active = true;
    }

    public void deactivate() {
        active = false;
    }

    public void activate() {
        active = true;
    }
}
