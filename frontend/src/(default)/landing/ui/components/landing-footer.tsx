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
        <footer className="border-t border-border bg-muted/40">
            <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16">
                    <div>
                        <Link
                            to={paths.public.root}
                            className="rounded-sm font-heading text-2xl font-semibold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                            {brandName}
                            <span className="text-primary">.</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
                            {footer.tagline}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.5fr)]">
                        {footer.groups.map((group) => (
                            <nav key={group.title} aria-label={group.title} className="min-w-0">
                                <p className="break-words text-xs font-semibold uppercase tracking-[0.14em] text-foreground [overflow-wrap:anywhere]">
                                    {group.title}
                                </p>
                                <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <LandingLink
                                                target={link.target}
                                                className="rounded-sm break-words hover:text-primary focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring motion-safe:transition-colors [overflow-wrap:anywhere]"
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

                <p className="mt-16 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
                    © {new Date().getFullYear()} {brandName}. {footer.rights}
                </p>
            </div>
        </footer>
    )
}
