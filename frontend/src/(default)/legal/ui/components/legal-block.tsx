// src/(default)/legal/ui/components/legal-block.tsx

import type { LegalBlock } from '@/src/(default)/legal/types/legal.types.ts'
import { CalloutBlock } from '@/src/(default)/legal/ui/components/blocks/callout-block.tsx'
import { DefinitionsBlock } from '@/src/(default)/legal/ui/components/blocks/definitions-block.tsx'
import { ListBlock } from '@/src/(default)/legal/ui/components/blocks/list-block.tsx'
import { ParagraphBlock } from '@/src/(default)/legal/ui/components/blocks/paragraph-block.tsx'
import { StepsBlock } from '@/src/(default)/legal/ui/components/blocks/steps-block.tsx'
import { TableBlock } from '@/src/(default)/legal/ui/components/blocks/table-block.tsx'

function assertNever(value: never): never {
    throw new Error(`Unsupported legal block: ${JSON.stringify(value)}`)
}

/**
 * Maps each content block to its component. The exhaustive switch makes adding a new
 * block type a compile error until it has a renderer.
 */
export function LegalBlockView({ block }: { block: LegalBlock }) {
    switch (block.type) {
        case 'paragraph':
            return <ParagraphBlock content={block.content} />
        case 'list':
            return <ListBlock ordered={block.ordered} items={block.items} />
        case 'definitions':
            return <DefinitionsBlock items={block.items} />
        case 'steps':
            return <StepsBlock items={block.items} />
        case 'callout':
            return <CalloutBlock tone={block.tone} title={block.title} content={block.content} />
        case 'table':
            return <TableBlock caption={block.caption} columns={block.columns} rows={block.rows} />
        default:
            return assertNever(block)
    }
}
