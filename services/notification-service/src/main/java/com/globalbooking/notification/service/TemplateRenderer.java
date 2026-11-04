package com.globalbooking.notification.service;

import com.globalbooking.notification.shared.common.exception.TemplateRenderingException;
import com.globalbooking.notification.domain.NotificationTemplateCode;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Renders {@code {{variable}}} placeholders.
 * <p>
 * Rendering is strict on purpose: a template that references a variable without a value fails instead of silently
 * producing a message with an empty field. Failing here surfaces the configuration error at the first event and routes
 * the message to the dead-letter queue, where it can be replayed after the template is fixed.
 */
@Component
public class TemplateRenderer {

    private static final Pattern PLACEHOLDER = Pattern.compile("\\{\\{\\s*([A-Za-z0-9_]+)\\s*}}");

    public String render(
            String template,
            Map<String, String> variables,
            NotificationTemplateCode code
    ) {
        if (template == null) {
            throw new TemplateRenderingException("Template body is missing for " + code);
        }

        Matcher matcher = PLACEHOLDER.matcher(template);
        StringBuilder rendered = new StringBuilder(template.length());

        while (matcher.find()) {
            String variable = matcher.group(1);
            String value = variables.get(variable);
            if (value == null) {
                throw new TemplateRenderingException(
                        "Template %s references '%s' but no value was provided".formatted(code, variable)
                );
            }
            matcher.appendReplacement(rendered, Matcher.quoteReplacement(value));
        }
        matcher.appendTail(rendered);

        return rendered.toString();
    }
}
