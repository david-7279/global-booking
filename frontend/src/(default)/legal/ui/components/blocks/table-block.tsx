// src/(default)/legal/ui/components/blocks/table-block.tsx

import type { LegalRichText, LegalTableColumn } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalText } from '@/src/(default)/legal/ui/components/legal-text.tsx'
import { cn } from '@/src/lib/utils.ts'
import {withPositionKeys} from "@/src/lib/utils/with-position-keys.ts";

type TableBlockProps = {
    caption: string
    columns: readonly LegalTableColumn[]
    rows: readonly Readonly<Record<string, LegalRichText>>[]
}

/**
 * A real table from `md` upwards. On small screens every row becomes a stacked card
 * whose cells are labelled through `data-label`, so nothing scrolls sideways.
 */
export function TableBlock({ caption, columns, rows }: TableBlockProps) {
    return (
        <div className="border border-border">
            <table className="w-full text-left text-sm">
                <caption className="sr-only">{caption}</caption>
                <thead className="hidden border-b border-border bg-muted/40 md:table-header-group">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {withPositionKeys(rows).map(({ key, item: row }) => (
                        <tr
                            key={key}
                            className="block py-3 md:table-row md:py-0 print:break-inside-avoid"
                        >
                            {columns.map((column, columnPosition) => (
                                <td
                                    key={column.key}
                                    data-label={column.label}
                                    className={cn(
                                        'block px-4 py-2 align-top text-sm leading-6 text-foreground/80',
                                        'before:mb-1 before:block before:text-[0.625rem] before:font-semibold before:uppercase before:tracking-[0.14em] before:text-muted-foreground before:content-[attr(data-label)]',
                                        'md:table-cell md:py-4 md:before:hidden',
                                        columnPosition === 0 && 'font-medium text-foreground',
                                    )}
                                >
                                    <LegalText content={row[column.key] ?? ''} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
