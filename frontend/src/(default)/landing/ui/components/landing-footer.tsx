// src/(default)/landing/ui/components/landing-footer.tsx

import { Link } from 'react-router'
import type { LandingContent } from '@/src/(default)/landing/types/landing.types.ts'
import { LandingLink } from '@/src/(default)/landing/ui/components/landing-link.tsx'
import { paths } from '@/src/router/paths.ts'

type LandingFooterProps = {
    brandName: string
    footer: LandingContent['footer']
}

export function LandingFooter({ brandName, footer }: LandingFooterProps) {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
                    <div>
                        <Link
                            to={paths.public.root}
                            className="font-heading text-xl font-semibold tracking-tight"
                        >
                            {brandName}
                            <span className="text-primary">.</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
                            {footer.tagline}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-[1fr_1fr_1fr_1.6fr]">
                        {footer.groups.map((group) => (
                            <nav key={group.title} aria-label={group.title}>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                                    {group.title}
                                </p>
                                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <LandingLink
                                                target={link.target}
                                                className="break-words transition-colors hover:text-foreground"
                                            >
                                                {link.label}
                                            </LandingLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                </div>

                <p className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {brandName}. {footer.rights}
                </p>
            </div>
        </footer>
    )
}
