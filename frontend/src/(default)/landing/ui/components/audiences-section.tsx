// src/(default)/landing/ui/components/audiences-section.tsx

import { Check } from 'lucide-react'
import type { LandingContent } from '@/src/(default)/landing/types/landing.types.ts'
import { LandingIcon } from '@/src/(default)/landing/ui/components/landing-icon.tsx'
import { LandingButtonLink } from '@/src/(default)/landing/ui/components/landing-link.tsx'
import { Reveal } from '@/src/(default)/landing/ui/components/reveal.tsx'
import { SectionHeading } from '@/src/(default)/landing/ui/components/section-heading.tsx'
import { withPositionKeys } from '@/src/lib/utils/with-position-keys.ts'
import { cn } from '@/src/lib/utils.ts'

type AudiencesSectionProps = {
    id: string
    audiences: LandingContent['audiences']
}

export function AudiencesSection({ id, audiences }: AudiencesSectionProps) {
    return (
        <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 bg-background">
            <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={audiences.heading} />
                </Reveal>

                <div className="mt-14 grid gap-5 md:grid-cols-2 lg:gap-6">
                    {audiences.items.map((audience, position) => (
                        <Reveal key={audience.id} delay={position * 120} className="flex min-w-0">
                            <article
                                className={cn(
                                    'flex w-full min-w-0 flex-col rounded-[2rem] border p-7 shadow-[0_20px_55px_-38px_rgba(23,92,80,0.4)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_25px_60px_-35px_rgba(23,92,80,0.5)] sm:p-9 lg:p-10',
                                    audience.featured
                                        ? 'border-primary bg-primary bg-[linear-gradient(145deg,var(--primary),#123e37)] text-primary-foreground'
                                        : 'border-border bg-card text-foreground',
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            'flex size-12 shrink-0 items-center justify-center rounded-2xl border',
                                            audience.featured
                                                ? 'border-primary-foreground/20 bg-primary-foreground/10'
                                                : 'border-border bg-secondary text-primary',
                                        )}
                                    >
                                        <LandingIcon name={audience.icon} className="size-5" />
                                    </span>
                                    <p
                                        className={cn(
                                            'text-xs font-semibold uppercase tracking-[0.18em]',
                                            audience.featured
                                                ? 'text-primary-foreground/80'
                                                : 'text-primary',
                                        )}
                                    >
                                        {audience.label}
                                    </p>
                                </div>

                                <h3 className="mt-8 max-w-md font-heading text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
                                    {audience.title}
                                </h3>
                                <p
                                    className={cn(
                                        'mt-4 max-w-lg leading-7',
                                        audience.featured
                                            ? 'text-primary-foreground/85'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {audience.description}
                                </p>

                                <ul
                                    className={cn(
                                        'mt-8 flex-1 space-y-4 border-t pt-8 text-sm leading-6',
                                        audience.featured
                                            ? 'border-primary-foreground/20'
                                            : 'border-border',
                                    )}
                                >
                                    {withPositionKeys(audience.points).map(({ key, item }) => (
                                        <li key={key} className="flex gap-3">
                                            <Check
                                                aria-hidden="true"
                                                className={cn(
                                                    'mt-0.5 size-5 shrink-0 rounded-full p-1',
                                                    audience.featured
                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                        : 'bg-secondary text-primary',
                                                )}
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-10">
                                    <LandingButtonLink
                                        action={audience.action}
                                        variant={audience.featured ? 'secondary' : 'default'}
                                        arrow
                                        className={cn(
                                            'min-h-12 w-full max-w-full rounded-full whitespace-normal text-center motion-reduce:transition-none motion-reduce:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 sm:w-auto',
                                            audience.featured
                                                ? 'focus-visible:outline-primary-foreground'
                                                : 'focus-visible:outline-primary',
                                        )}
                                    />
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
