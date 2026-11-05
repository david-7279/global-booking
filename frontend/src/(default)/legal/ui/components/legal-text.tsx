// src/(default)/legal/ui/components/legal-text.tsx

import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { LEGAL_DOCUMENT_PATHS } from '@/src/(default)/legal/config/legal.config.ts'
import type {
    LegalInlineNode,
    LegalLinkTarget,
    LegalRichText,
} from '@/src/(default)/legal/types/legal.types.ts'
import { withPositionKeys } from '@/src/lib/utils/with-position-keys.ts'

const linkClassName =
    'font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

type LegalLinkProps = {
    target: LegalLinkTarget
    children: ReactNode
}

/** Resolves a semantic link target into the right kind of anchor. */
function LegalLink({ target, children }: LegalLinkProps) {
    switch (target.kind) {
        case 'document': {
            const hash = target.sectionId ? `#${target.sectionId}` : ''
            return (
                <Link
                    to={`${LEGAL_DOCUMENT_PATHS[target.documentId]}${hash}`}
                    className={linkClassName}
                >
                    {children}
                </Link>
            )
        }
        case 'email':
            return (
                <a href={`mailto:${target.address}`} className={linkClassName}>
                    {children}
                </a>
            )
        case 'external':
            return (
                <a
                    href={target.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                >
                    {children}
                </a>
            )
    }
}

function InlineNode({ node }: { node: LegalInlineNode }) {
    if (typeof node === 'string') return node

    if (node.type === 'strong') {
        return <strong className="font-semibold text-foreground">{node.text}</strong>
    }

    return <LegalLink target={node.target}>{node.text}</LegalLink>
}

/** Renders rich text content: plain strings, emphasis and semantic links. */
export function LegalText({ content }: { content: LegalRichText }) {
    if (typeof content === 'string') return content

    return withPositionKeys(content).map(({ key, item }) => <InlineNode key={key} node={item} />)
}
