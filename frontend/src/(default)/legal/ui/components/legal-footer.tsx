// src/(default)/legal/ui/components/legal-footer.tsx

import { Link } from 'react-router'
import type { LegalDocumentId, LegalDocumentLink } from '@/src/(default)/legal/types/legal.types.ts'
import { cn } from '@/src/lib/utils.ts'

type LegalFooterProps = {
    brandName: string
    rightsReserved: string
    navLabel: string
    links: readonly LegalDocumentLink[]
    activeId: LegalDocumentId
}

export function LegalFooter({
    brandName,
    rightsReserved,
    navLabel,
    links,
    activeId,
}: LegalFooterProps) {
    return (
        <footer className="border-t border-border print:hidden">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <p>
                    © {new Date().getFullYear()} {brandName}. {rightsReserved}
                </p>
                <nav aria-label={navLabel} className="flex gap-5">
                    {links.map((link) => (
                        <Link
                            key={link.id}
                            to={link.to}
                            aria-current={link.id === activeId ? 'page' : undefined}
                            className={cn(
                                'transition-colors hover:text-foreground',
                                link.id === activeId && 'text-foreground',
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    )
}
