// src/(default)/landing/ui/components/audiences-section.tsx

import { Check } from 'lucide-react'
import type { LandingContent } from '@/src/(default)/landing/types/landing.types.ts'
import { LandingIcon } from '@/src/(default)/landing/ui/components/landing-icon.tsx'
import { LandingButtonLink } from '@/src/(default)/landing/ui/components/landing-link.tsx'
import { Reveal } from '@/src/(default)/landing/ui/components/reveal.tsx'
import { SectionHeading } from '@/src/(default)/landing/ui/components/section-heading.tsx'
import { cn } from '@/src/lib/utils.ts'
import {withPositionKeys} from "@/src/lib/utils/with-position-keys.ts";

type AudiencesSectionProps = {
    id: string
    audiences: LandingContent['audiences']
}

export function AudiencesSection({ id, audiences }: AudiencesSectionProps) {
    return (
        <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16">
            <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={audiences.heading} />
                </Reveal>

                <div className="mt-14 grid gap-6 md:grid-cols-2">
                    {audiences.items.map((audience, position) => (
                        <Reveal key={audience.id} delay={position * 120} className="flex">
                            <article
                                className={cn(
                                    'flex w-full flex-col border p-8 lg:p-10',
                                    audience.featured
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-card',
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            'flex size-10 items-center justify-center border',
                                            audience.featured
                                                ? 'border-primary-foreground/30'
                                                : 'border-border bg-muted/50',
                                        )}
                                    >
                                        <LandingIcon name={audience.icon} className="size-5" />
                                    </span>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                                        {audience.label}
                                    </p>
                                </div>

                                <h3 className="mt-8 font-heading text-3xl leading-tight tracking-tight text-balance">
                                    {audience.title}
                                </h3>
                                <p
                                    className={cn(
                                        'mt-4 leading-7',
                                        audience.featured
                                            ? 'text-primary-foreground/75'
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
                                                className="mt-0.5 size-4 shrink-0"
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
