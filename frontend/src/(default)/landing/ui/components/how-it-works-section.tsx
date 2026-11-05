// src/(default)/landing/ui/components/how-it-works-section.tsx

import { ArrowRight, Check } from 'lucide-react'
import type {
    LandingBookingState,
    LandingBookingStateKey,
    LandingContent,
} from '@/src/(default)/landing/types/landing.types.ts'
import { LandingIcon } from '@/src/(default)/landing/ui/components/landing-icon.tsx'
import { Reveal } from '@/src/(default)/landing/ui/components/reveal.tsx'
import { SectionHeading } from '@/src/(default)/landing/ui/components/section-heading.tsx'
import { formatOrdinal } from '@/src/lib/utils/format-ordinal.ts'
import { cn } from '@/src/lib/utils.ts'

type HowItWorksSectionProps = {
    id: string
    howItWorks: LandingContent['howItWorks']
}

/** Visual weight of each booking state: the further along the flow, the stronger the fill. */
const STATE_STYLES: Readonly<Record<LandingBookingStateKey, { node: string; text: string }>> = {
    pending: { node: 'border-border bg-background', text: 'text-muted-foreground' },
    confirmed: { node: 'border-foreground bg-background', text: 'text-muted-foreground' },
    completed: {
        node: 'border-primary bg-primary text-primary-foreground',
        text: 'text-primary-foreground/75',
    },
    rejected: { node: 'border-dashed border-border bg-transparent', text: 'text-muted-foreground' },
    cancelled: {
        node: 'border-dashed border-border bg-transparent',
        text: 'text-muted-foreground',
    },
}

function StateNode({ state }: { state: LandingBookingState }) {
    const style = STATE_STYLES[state.key]

    return (
        <div className={cn('flex-1 border p-4', style.node)}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">{state.label}</p>
            <p className={cn('mt-2 text-sm leading-6', style.text)}>{state.description}</p>
        </div>
    )
}

export function HowItWorksSection({ id, howItWorks }: HowItWorksSectionProps) {
    const { heading, steps, lifecycle } = howItWorks

    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className="scroll-mt-16 border-y border-border bg-muted/25"
        >
            <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={heading} />
                </Reveal>

                <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, position) => (
                        <li key={step.title}>
                            <Reveal
                                delay={position * 100}
                                className="relative border-t border-foreground pt-6"
                            >
                                <span className="font-heading text-5xl leading-none text-foreground/15">
                                    {formatOrdinal(position)}
                                </span>
                                <span className="mt-6 flex size-10 items-center justify-center border border-border bg-background">
                                    <LandingIcon name={step.icon} className="size-5" />
                                </span>
                                <h3 className="mt-5 text-base font-semibold">{step.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {step.description}
                                </p>
                            </Reveal>
                        </li>
                    ))}
                </ol>

                <Reveal className="mt-20">
                    <div className="grid gap-10 border border-border bg-background p-6 sm:p-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
                        <div>
                            <h3 className="font-heading text-3xl leading-tight tracking-tight">
                                {lifecycle.title}
                            </h3>
                            <p className="mt-4 leading-7 text-muted-foreground">
                                {lifecycle.description}
                            </p>
                            <p className="mt-6 flex gap-3 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
                                <Check
                                    aria-hidden="true"
                                    className="mt-0.5 size-4 shrink-0 text-foreground"
                                />
                                {lifecycle.note}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <ol className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                                {lifecycle.mainFlow.map((state, position) => (
                                    <li key={state.key} className="flex flex-col gap-3 sm:contents">
                                        {position > 0 ? (
                                            <span
                                                aria-hidden="true"
                                                className="flex items-center justify-center text-muted-foreground"
                                            >
                                                <ArrowRight className="size-4 rotate-90 sm:rotate-0" />
                                            </span>
                                        ) : null}
                                        <StateNode state={state} />
                                    </li>
                                ))}
                            </ol>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                    {lifecycle.endingsLabel}
                                </p>
                                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                                    {lifecycle.endings.map((state) => (
                                        <li key={state.key} className="flex">
                                            <StateNode state={state} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
