// src/(default)/landing/ui/components/landing-header.tsx

import { Menu, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import type { LandingNavigation } from '@/src/(default)/landing/types/landing.types.ts'
import {
    LandingButtonLink,
    LandingLink,
} from '@/src/(default)/landing/ui/components/landing-link.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import { useActiveSection } from '@/src/hooks/use-active-section.ts'
import { cn } from '@/src/lib/utils.ts'
import { paths } from '@/src/router/paths.ts'

type LandingHeaderProps = {
    brandName: string
    navigation: LandingNavigation
}

const MOBILE_MENU_ID = 'landing-mobile-menu'

export function LandingHeader({ brandName, navigation }: LandingHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const sectionIds = useMemo(
        () => navigation.items.map((item) => item.sectionId),
        [navigation.items],
    )
    const activeId = useActiveSection(sectionIds, { initialId: null, allowNone: true })

    useEffect(() => {
        if (!menuOpen) return

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false)
        }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [menuOpen])

    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6 lg:px-8">
                <Link
                    to={paths.public.root}
                    className="font-heading text-xl font-semibold tracking-tight"
                >
                    {brandName}
                    <span className="text-primary">.</span>
                </Link>

                <nav
                    aria-label={navigation.ariaLabel}
                    className="hidden items-center gap-8 lg:flex"
                >
                    {navigation.items.map((item) => {
                        const isActive = item.sectionId === activeId

                        return (
                            <LandingLink
                                key={item.sectionId}
                                target={{ kind: 'section', sectionId: item.sectionId }}
                                className={cn(
                                    'relative py-1 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform hover:text-foreground',
                                    isActive
                                        ? 'text-foreground after:scale-x-100'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.label}
                            </LandingLink>
                        )
                    })}
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    <LandingButtonLink action={navigation.signIn} variant="ghost" size="sm" />
                    <LandingButtonLink action={navigation.primaryCta} size="sm" />
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                    aria-label={menuOpen ? navigation.closeMenu : navigation.openMenu}
                    aria-expanded={menuOpen}
                    aria-controls={MOBILE_MENU_ID}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                </Button>
            </div>

            {menuOpen ? (
                <div id={MOBILE_MENU_ID} className="border-t border-border bg-background lg:hidden">
                    <nav
                        aria-label={navigation.ariaLabel}
                        className="mx-auto flex w-full max-w-6xl flex-col px-6 py-4"
                    >
                        {navigation.items.map((item) => (
                            <LandingLink
                                key={item.sectionId}
                                target={{ kind: 'section', sectionId: item.sectionId }}
                                onClick={closeMenu}
                                className="border-b border-border/60 py-3 text-base text-foreground"
                            >
                                {item.label}
                            </LandingLink>
                        ))}
                        <div className="flex flex-col gap-2 pt-5">
                            <LandingButtonLink
                                action={navigation.signIn}
                                variant="outline"
                                onClick={closeMenu}
                            />
                            <LandingButtonLink action={navigation.primaryCta} onClick={closeMenu} />
                        </div>
                    </nav>
                </div>
            ) : null}
        </header>
    )
}
