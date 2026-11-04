package com.globalbooking.notification.service;

import com.globalbooking.notification.shared.common.exception.TemplateNotFoundException;
import com.globalbooking.notification.infrastructure.config.NotificationProperties;
import com.globalbooking.notification.domain.NotificationChannel;
import com.globalbooking.notification.domain.NotificationContent;
import com.globalbooking.notification.domain.NotificationTemplate;
import com.globalbooking.notification.domain.NotificationTemplateCode;
import com.globalbooking.notification.repository.NotificationTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Resolves and renders versioned templates.
 */
@Service
@RequiredArgsConstructor
public class TemplateService {

    /**
     * Selects the highest active version available.
     */
    public static final int LATEST_VERSION = Integer.MAX_VALUE;

    private final NotificationTemplateRepository templateRepository;
    private final TemplateRenderer renderer;
    private final NotificationProperties properties;

    @Transactional(readOnly = true)
    public NotificationContent renderLatest(
            NotificationTemplateCode code,
            NotificationChannel channel,
            String locale,
            Map<String, String> variables
    ) {
        return render(code, channel, locale, LATEST_VERSION, variables);
    }

    @Transactional(readOnly = true)
    public NotificationContent render(
            NotificationTemplateCode code,
            NotificationChannel channel,
            String locale,
            int version,
            Map<String, String> variables
    ) {
        NotificationTemplate template = resolve(code, channel, locale, version);
        return new NotificationContent(
                template.getCode(),
                template.getVersion(),
                template.getLocale(),
                renderer.render(template.getSubjectTemplate(), variables, code),
                renderer.render(template.getBodyTemplate(), variables, code)
        );
    }

    @Transactional(readOnly = true)
    public NotificationTemplate resolve(
            NotificationTemplateCode code,
            NotificationChannel channel,
            String locale,
            int version
    ) {
        String requestedLocale = normalizeLocale(locale);
        int requestedVersion = version < 1 ? LATEST_VERSION : version;

        return templateRepository
                .findTopByCodeAndChannelAndLocaleAndActiveTrueAndVersionLessThanEqualOrderByVersionDesc(
                        code, channel, requestedLocale, requestedVersion)
                .or(() -> templateRepository
                        .findTopByCodeAndChannelAndActiveTrueAndVersionLessThanEqualOrderByVersionDesc(
                                code, channel, requestedVersion))
                .orElseThrow(() -> new TemplateNotFoundException(
                        "No active %s template for %s in locale '%s' up to version %s"
                                .formatted(channel, code, requestedLocale, describe(requestedVersion))
                ));
    }

    @Transactional(readOnly = true)
    public List<NotificationTemplate> list() {
        return templateRepository.findAllByOrderByCodeAscChannelAscLocaleAscVersionDesc();
    }

    @Transactional(readOnly = true)
    public List<NotificationTemplate> list(NotificationTemplateCode code) {
        List<NotificationTemplate> templates =
                templateRepository.findByCodeOrderByChannelAscLocaleAscVersionDesc(code);
        if (templates.isEmpty()) {
            throw new TemplateNotFoundException("No templates registered for " + code);
        }
        return templates;
    }

    /**
     * Registers a new version for the (code, channel, locale) template. Published versions are never edited.
     */
    @Transactional
    public NotificationTemplate register(
            NotificationTemplateCode code,
            NotificationChannel channel,
            String locale,
            String subjectTemplate,
            String bodyTemplate,
            String description
    ) {
        String normalizedLocale = normalizeLocale(locale);
        int nextVersion = templateRepository.findMaxVersion(code, channel, normalizedLocale) + 1;
        NotificationTemplate template = new NotificationTemplate(
                code,
                channel,
                normalizedLocale,
                nextVersion,
                subjectTemplate,
                bodyTemplate,
                description
        );
        return templateRepository.save(template);
    }

    private String normalizeLocale(String locale) {
        return locale == null || locale.isBlank() ? properties.defaultLocale() : locale;
    }

    private String describe(int version) {
        return version == LATEST_VERSION ? "latest" : Integer.toString(version);
    }
}
