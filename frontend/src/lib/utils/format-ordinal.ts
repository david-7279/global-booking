// src/lib/utils/format-ordinal.ts

/** Zero-based position → two-digit label ("01", "02", …) used for section numbering. */
export function formatOrdinal(position: number): string {
    return String(position + 1).padStart(2, '0')
}
