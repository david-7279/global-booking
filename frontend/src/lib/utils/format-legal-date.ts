// src//lib/utils/format-legal-date.ts

/**
 * Formats an ISO calendar date (YYYY-MM-DD) for a locale, e.g. "4 de novembro de 2026".
 * Parsed and rendered in UTC so the day never shifts with the viewer's time zone.
 */
export function formatLegalDate(isoDate: string, locale: string): string {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
        new Date(`${isoDate}T00:00:00Z`),
    )
}
