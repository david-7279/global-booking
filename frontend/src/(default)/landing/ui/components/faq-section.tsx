// src/(default)/landing/ui/components/faq-section.tsx

import { Minus, Plus } from 'lucide-react'
import type { LandingContent } from '@/src/(default)/landing/types/landing.types.ts'
import { LandingLink } from '@/src/(default)/landing/ui/components/landing-link.tsx'
import { Reveal } from '@/src/(default)/landing/ui/components/reveal.tsx'
import { SectionHeading } from '@/src/(default)/landing/ui/components/section-heading.tsx'

type FaqSectionProps = {
    id: string
    faq: LandingContent['faq']
}

/** Accordion built on native `<details>`: keyboard and screen-reader support for free. */
export function FaqSection({ id, faq }: FaqSectionProps) {
    return (
        <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16">
            <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={faq.heading} />
                </Reveal>

                <Reveal delay={120}>
                    <div className="divide-y divide-border border-y border-border">
                        {faq.items.map((item) => (
                            <details key={item.question} name={id} className="group">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium outline-none marker:hidden focus-visible:bg-muted/40 [&::-webkit-details-marker]:hidden">
                                    {item.question}
                                    <span
                                        aria-hidden="true"
                                        className="flex size-7 shrink-0 items-center justify-center border border-border transition-colors group-open:bg-primary group-open:text-primary-foreground"
                                    >
                                        <Plus className="size-3.5 group-open:hidden" />
                                        <Minus className="hidden size-3.5 group-open:block" />
                                    </span>
                                </summary>
                                <div className="pb-6 pr-12 text-sm leading-7 text-muted-foreground">
                                    <p>{item.answer}</p>
                                    {item.action ? (
                                        <LandingLink
                                            target={item.action.target}
                                            className="mt-3 inline-block font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                                        >
                                            {item.action.label}
                                        </LandingLink>
                                    ) : null}
                                </div>
                            </details>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
