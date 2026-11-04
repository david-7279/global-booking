package com.globalbooking.notification.service;

import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationContent;
import com.globalbooking.notification.domain.NotificationRecipient;
import com.globalbooking.notification.domain.NotificationTemplateCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Renders a template for a recipient and produces the notification draft to be persisted.
 */
@Service
@RequiredArgsConstructor
public class NotificationComposer {

    private final TemplateService templateService;

    public Optional<NotificationDraft> compose(
            NotificationTemplateCode code,
            NotificationChannel channel,
            NotificationRecipient recipient,
            TemplateVariables variables,
            EventSource source
    ) {
        if (channel.requiresEmailAddress() && !recipient.canReceiveEmail()) {
            return Optional.empty();
        }

        NotificationContent content = templateService.renderLatest(
                code,
                channel,
                recipient.getLocale(),
                variables.asMap()
        );

        return Optional.of(new NotificationDraft(
                recipient.getUserId(),
                channel.requiresEmailAddress() ? recipient.getEmail() : null,
                channel,
                content,
                source
        ));
    }
}
