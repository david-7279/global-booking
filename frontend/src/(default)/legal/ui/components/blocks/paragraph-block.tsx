// src/(default)/legal/ui/components/blocks/paragraph-block.tsx

import type { LegalRichText } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalText } from '@/src/(default)/legal/ui/components/legal-text.tsx'

type ParagraphBlockProps = {
    content: LegalRichText
}

export function ParagraphBlock({ content }: ParagraphBlockProps) {
    return (
        <p className="text-pretty text-base leading-7 text-foreground/80">
            <LegalText content={content} />
        </p>
    )
}
