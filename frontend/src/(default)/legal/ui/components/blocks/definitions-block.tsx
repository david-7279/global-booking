// src/(default)/legal/ui/components/blocks/definitions-block.tsx

import type { LegalRichText } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalText } from '@/src/(default)/legal/ui/components/legal-text.tsx'
import { withPositionKeys } from '@/src/lib/utils/with-position-keys.ts'

type DefinitionsBlockProps = {
    items: readonly { term: string; description: LegalRichText }[]
}

export function DefinitionsBlock({ items }: DefinitionsBlockProps) {
    return (
        <dl className="divide-y divide-border border-y border-border">
            {withPositionKeys(items).map(({ key, item }) => (
                <div
                    key={key}
                    className="grid gap-1.5 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
                >
                    <dt className="text-sm font-semibold leading-7 text-foreground">{item.term}</dt>
                    <dd className="text-base leading-7 text-foreground/80">
                        <LegalText content={item.description} />
                    </dd>
                </div>
            ))}
        </dl>
    )
}
