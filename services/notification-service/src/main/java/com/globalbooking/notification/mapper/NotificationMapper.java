package com.globalbooking.notification.mapper;

import com.globalbooking.notification.domain.Notification;
import com.globalbooking.notification.domain.NotificationTemplate;
import com.globalbooking.notification.dto.response.NotificationResponse;
import com.globalbooking.notification.dto.response.NotificationTemplateResponse;
import com.globalbooking.notification.service.NotificationDraft;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class NotificationMapper {

    public Notification toEntity(NotificationDraft draft, Instant availableAt) {
        return switch (draft.channel()) {
            case EMAIL -> Notification.pendingEmail(
                    draft.recipientUserId(),
                    draft.recipientEmail(),
                    draft.content(),
                    draft.source().eventId(),
                    draft.source().eventType(),
                    draft.source().correlationId(),
                    availableAt
            );
            case IN_APP -> Notification.deliveredInApp(
                    draft.recipientUserId(),
                    draft.content(),
                    draft.source().eventId(),
                    draft.source().eventType(),
                    draft.source().correlationId()
            );
        };
    }

    public NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getRecipientUserId(),
                notification.getChannel(),
                notification.getTemplateCode().name(),
                notification.getTemplateVersion(),
                notification.getLocale(),
                notification.getSubject(),
                notification.getBody(),
                notification.getStatus(),
                notification.getAttempts(),
                notification.getSourceEventId(),
                notification.getSourceEventType(),
                notification.getCorrelationId(),
                notification.getNextAttemptAt(),
                notification.getSentAt(),
                notification.getFailedAt(),
                notification.getReadAt(),
                notification.getLastError(),
                notification.getCreatedAt(),
                notification.getUpdatedAt()
        );
    }

    public NotificationTemplateResponse toResponse(NotificationTemplate template) {
        return new NotificationTemplateResponse(
                template.getId(),
                template.getCode().name(),
                template.getChannel(),
                template.getLocale(),
                template.getVersion(),
                template.getSubjectTemplate(),
                template.getBodyTemplate(),
                template.isActive(),
                template.getDescription(),
                template.getCreatedAt(),
                template.getUpdatedAt()
        );
    }
}
