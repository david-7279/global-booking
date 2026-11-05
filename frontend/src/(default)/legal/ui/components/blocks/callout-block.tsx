// src/(default)/legal/ui/components/blocks/callout-block.tsx

import { Info, type LucideIcon, TriangleAlert } from 'lucide-react'
import type { LegalCalloutTone, LegalRichText } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalText } from '@/src/(default)/legal/ui/components/legal-text.tsx'
import { cn } from '@/src/lib/utils.ts'

type CalloutBlockProps = {
    tone: LegalCalloutTone
    title?: string
    content: LegalRichText
}

const TONES: Readonly<Record<LegalCalloutTone, { icon: LucideIcon; accent: string }>> = {
    info: { icon: Info, accent: 'border-l-muted-foreground' },
    warning: { icon: TriangleAlert, accent: 'border-l-foreground' },
}

export function CalloutBlock({ tone, title, content }: CalloutBlockProps) {
    const { icon: Icon, accent } = TONES[tone]

    return (
        <div
            role="note"
            className={cn(
                'flex gap-4 border border-l-2 border-border bg-muted/40 p-5 print:break-inside-avoid',
                accent,
            )}
        >
            <Icon className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
            <div className="min-w-0 text-base leading-7 text-foreground/80">
                {title ? (
                    <p className="mb-1 text-sm font-semibold text-foreground">{title}</p>
                ) : null}
                <p>
                    <LegalText content={content} />
                </p>
            </div>
        </div>
    )
}
