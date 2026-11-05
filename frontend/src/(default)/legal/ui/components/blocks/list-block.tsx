// src/(default)/legal/ui/components/blocks/list-block.tsx

import type { LegalRichText } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalText } from '@/src/(default)/legal/ui/components/legal-text.tsx'
import { withPositionKeys } from '@/src/lib/utils/with-position-keys.ts'
import { cn } from '@/src/lib/utils.ts'

type ListBlockProps = {
    ordered?: boolean
    items: readonly LegalRichText[]
}

/** Native list markers keep list semantics for assistive technology. */
export function ListBlock({ ordered = false, items }: ListBlockProps) {
    const Tag = ordered ? 'ol' : 'ul'

    return (
        <Tag
            className={cn(
                'space-y-3 pl-5 text-base leading-7 text-foreground/80 marker:text-muted-foreground',
                ordered ? 'list-decimal marker:font-medium' : 'list-[square]',
            )}
        >
            {withPositionKeys(items).map(({ key, item }) => (
                <li key={key} className="pl-1">
                    <LegalText content={item} />
                </li>
            ))}
        </Tag>
    )
}
