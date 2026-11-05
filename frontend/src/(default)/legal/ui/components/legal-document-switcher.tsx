// src/(default)/legal/ui/components/legal-document-switcher.tsx

import { Link } from 'react-router'
import type { LegalDocumentId, LegalDocumentLink } from '@/src/(default)/legal/types/legal.types.ts'
import { cn } from '@/src/lib/utils.ts'

type LegalDocumentSwitcherProps = {
    links: readonly LegalDocumentLink[]
    activeId: LegalDocumentId
    label: string
}

/** Segmented control to move between legal documents. Scales with the document list. */
export function LegalDocumentSwitcher({ links, activeId, label }: LegalDocumentSwitcherProps) {
    return (
        <nav aria-label={label} className="inline-flex border border-border">
            {links.map((link) => {
                const isActive = link.id === activeId

                return (
                    <Link
                        key={link.id}
                        to={link.to}
                        title={link.name}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                            'inline-flex h-9 items-center px-4 text-xs font-semibold uppercase tracking-widest transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        {link.label}
                    </Link>
                )
            })}
        </nav>
    )
}
