// src/(default)/legal/ui/components/blocks/steps-block.tsx

import type { LegalRichText } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalText } from '@/src/(default)/legal/ui/components/legal-text.tsx'
import {withPositionKeys} from "@/src/lib/utils/with-position-keys.ts";
import {formatOrdinal} from "@/src/lib/utils/format-ordinal.ts";

type StepsBlockProps = {
    items: readonly { title: string; description: LegalRichText }[]
}

export function StepsBlock({ items }: StepsBlockProps) {
    return (
        <ol className="divide-y divide-border border border-border">
            {withPositionKeys(items).map(({ key, item }, position) => (
                <li key={key} className="flex gap-4 p-4 sm:p-5 print:break-inside-avoid">
                    <span
                        aria-hidden="true"
                        className="flex size-7 shrink-0 items-center justify-center bg-muted text-xs font-semibold tabular-nums"
                    >
                        {formatOrdinal(position)}
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="mt-1 text-base leading-7 text-foreground/80">
                            <LegalText content={item.description} />
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    )
}
