package com.globalbooking.notification.dto.request;

import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationTemplateCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Registers a new version of an existing template identity (code, channel and locale).
 */
public record NotificationTemplateRequest(
        @NotNull
        NotificationTemplateCode code,

        @NotNull
        NotificationChannel channel,

        @Size(max = 10)
        String locale,

        @NotBlank @Size(max = 255)
        String subjectTemplate,

        @NotBlank
        String bodyTemplate,

        @Size(max = 500)
        String description
) {
}
