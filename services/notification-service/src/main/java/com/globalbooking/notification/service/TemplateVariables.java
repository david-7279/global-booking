package com.globalbooking.notification.service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/**
 * Values available to a template.
 * <p>
 * Null values are not registered, so a template that expects them fails during rendering instead of printing
 * "null" to a customer.
 */
public final class TemplateVariables {

    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter
            .ofPattern("d MMM uuuu, HH:mm 'UTC'", Locale.ENGLISH)
            .withZone(ZoneOffset.UTC);

    private final Map<String, String> values = new LinkedHashMap<>();

    private TemplateVariables() {
    }

    public static TemplateVariables create() {
        return new TemplateVariables();
    }

    public TemplateVariables with(String name, Object value) {
        if (value == null) {
            return this;
        }

        String rendered = switch (value) {
            case Instant instant -> TIMESTAMP_FORMATTER.format(instant);
            case UUID uuid -> uuid.toString();
            case Enum<?> enumeration -> enumeration.name();
            default -> String.valueOf(value);
        };

        if (!rendered.isBlank()) {
            values.put(name, rendered);
        }
        return this;
    }

    public Map<String, String> asMap() {
        return Map.copyOf(values);
    }
}
