// src/lib/utils/format-date-range.ts

const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' })
const full = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' })

/** "Oct 24 — Nov 02, 2025" (same-year) or "Oct 24, 2025 — Jan 02, 2026". */
export function formatDateRange(startsAt: string, endsAt: string): string {
    const start = new Date(startsAt)
    const end = new Date(endsAt)
    if (start.getFullYear() === end.getFullYear()) {
        return `${monthDay.format(start)} — ${full.format(end)}`
    }
    return `${full.format(start)} — ${full.format(end)}`
}
