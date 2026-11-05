// src/(default)/landing/ui/components/landing-header.tsx

import { Menu, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
    const [isDesktop, setIsDesktop] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(min-width: 64rem)').matches,
    )
    const brandLinkRef = useRef<HTMLAnchorElement>(null)
    const menuButtonRef = useRef<HTMLButtonElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const desktopNavRef = useRef<HTMLElement>(null)
    const desktopActionsRef = useRef<HTMLDivElement>(null)
    const sectionIds = useMemo(
        () => navigation.items.map((item) => item.sectionId),
        [navigation.items],
    )
    const activeId = useActiveSection(sectionIds, { initialId: null, allowNone: true })

    useEffect(() => {
        if (!menuOpen) return

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                const focusIsInMenu =
                    mobileMenuRef.current?.contains(document.activeElement) ||
                    menuButtonRef.current === document.activeElement
                setMenuOpen(false)
                if (focusIsInMenu) menuButtonRef.current?.focus()
            }
        }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [menuOpen])

    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 64rem)')
        const closeOnDesktop = (event: MediaQueryListEvent) => {
            if (event.matches) {
                const focusIsInMobileNavigation =
                    mobileMenuRef.current?.contains(document.activeElement) ||
                    menuButtonRef.current === document.activeElement
                if (focusIsInMobileNavigation) brandLinkRef.current?.focus()
                setMenuOpen(false)
            } else {
                const focusIsInDesktopNavigation =
                    desktopNavRef.current?.contains(document.activeElement) ||
                    desktopActionsRef.current?.contains(document.activeElement)
                if (focusIsInDesktopNavigation) brandLinkRef.current?.focus()
            }
            setIsDesktop(event.matches)
        }
        setIsDesktop(desktop.matches)
        desktop.addEventListener('change', closeOnDesktop)
        return () => desktop.removeEventListener('change', closeOnDesktop)
    }, [])

    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
            <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:gap-6 lg:px-8">
                <Link
                    ref={brandLinkRef}
                    to={paths.public.root}
                    className="flex min-w-0 max-w-[calc(100%-3.75rem)] items-center gap-2.5 rounded-md font-heading text-xl font-semibold leading-tight tracking-tight text-foreground outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring lg:max-w-[13rem]"
                >
                    <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary"
                    >
                        <span className="size-3.5 rounded-[4px] border border-primary-foreground/90" />
                    </span>
                    <span className="min-w-0 [overflow-wrap:anywhere]">
                        {brandName}
                        <span className="text-primary">.</span>
                    </span>
                </Link>

                <nav
                    ref={desktopNavRef}
                    hidden={!isDesktop}
                    aria-label={navigation.ariaLabel}
                    className="flex min-w-0 items-center justify-center gap-5 xl:gap-8"
                >
                    {navigation.items.map((item) => {
                        const isActive = item.sectionId === activeId

                        return (
                            <LandingLink
                                key={item.sectionId}
                                target={{ kind: 'section', sectionId: item.sectionId }}
                                className={cn(
                                    'relative rounded-sm py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform motion-reduce:after:transition-none hover:text-primary',
                                    isActive
                                        ? 'text-primary after:scale-x-100'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.label}
                            </LandingLink>
                        )
                    })}
                </nav>

                <div
                    ref={desktopActionsRef}
                    hidden={!isDesktop}
                    className="flex shrink-0 items-center gap-2"
                >
                    <LandingButtonLink action={navigation.signIn} variant="ghost" size="sm" />
                    <LandingButtonLink action={navigation.primaryCta} size="sm" />
                </div>

                <Button
                    ref={menuButtonRef}
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    hidden={isDesktop}
                    className="size-11 shrink-0 rounded-xl border border-border bg-card text-primary shadow-sm hover:!bg-secondary focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:active:!translate-y-0"
                    aria-label={menuOpen ? navigation.closeMenu : navigation.openMenu}
                    aria-expanded={menuOpen}
                    aria-controls={MOBILE_MENU_ID}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                </Button>
            </div>

            <div
                id={MOBILE_MENU_ID}
                ref={mobileMenuRef}
                hidden={!menuOpen || isDesktop}
                className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background shadow-lg"
            >
                <nav
                    aria-label={navigation.ariaLabel}
                    className="mx-auto flex w-full max-w-7xl flex-col px-6 py-4"
                >
                    {navigation.items.map((item) => (
                        <LandingLink
                            key={item.sectionId}
                            target={{ kind: 'section', sectionId: item.sectionId }}
                            onClick={closeMenu}
                            className="rounded-sm border-b border-border/80 py-4 text-base font-medium text-foreground outline-none [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                            {item.label}
                        </LandingLink>
                    ))}
                    <div className="flex flex-col gap-3 pb-2 pt-5">
                        <LandingButtonLink
                            action={navigation.signIn}
                            variant="outline"
                            onClick={closeMenu}
                        />
                        <LandingButtonLink action={navigation.primaryCta} onClick={closeMenu} />
                    </div>
                </nav>
            </div>
        </header>
    )
}
