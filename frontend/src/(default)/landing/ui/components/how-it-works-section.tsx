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
    pending: { node: 'border-border bg-card', text: 'text-muted-foreground' },
    confirmed: { node: 'border-primary/25 bg-secondary/70', text: 'text-muted-foreground' },
    completed: {
        node: 'border-primary bg-primary text-primary-foreground',
        text: 'text-primary-foreground/90',
    },
    rejected: { node: 'border-dashed border-border bg-background', text: 'text-muted-foreground' },
    cancelled: {
        node: 'border-dashed border-border bg-background',
        text: 'text-muted-foreground',
    },
}

function StateNode({ state }: { state: LandingBookingState }) {
    const style = STATE_STYLES[state.key]

    return (
        <div className={cn('min-w-0 flex-1 rounded-2xl border p-4', style.node)}>
            <p className="break-words text-xs font-semibold uppercase tracking-[0.12em]">
                {state.label}
            </p>
            <p className={cn('mt-2 break-words text-sm leading-6', style.text)}>
                {state.description}
            </p>
        </div>
    )
}

export function HowItWorksSection({ id, howItWorks }: HowItWorksSectionProps) {
    const { heading, steps, lifecycle } = howItWorks

    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className="scroll-mt-24 border-y border-border bg-secondary/40"
        >
            <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={heading} />
                </Reveal>

                <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {steps.map((step, position) => (
                        <li key={step.title} className="min-w-0">
                            <Reveal
                                delay={position * 100}
                                className="relative flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_16px_40px_-35px_rgba(23,92,80,0.4)]"
                            >
                                <span className="font-heading text-5xl leading-none text-primary">
                                    {formatOrdinal(position)}
                                </span>
                                <span className="absolute right-6 top-6 flex size-11 items-center justify-center rounded-2xl border border-border bg-secondary text-primary">
                                    <LandingIcon name={step.icon} className="size-5" />
                                </span>
                                <h3 className="mt-9 text-base font-semibold leading-6 text-foreground">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {step.description}
                                </p>
                            </Reveal>
                        </li>
                    ))}
                </ol>

                <Reveal className="mt-16 lg:mt-20">
                    <div className="grid gap-10 rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_65px_-45px_rgba(23,92,80,0.35)] sm:p-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
                        <div className="min-w-0">
                            <h3 className="font-heading text-3xl leading-tight tracking-tight text-balance">
                                {lifecycle.title}
                            </h3>
                            <p className="mt-4 leading-7 text-muted-foreground">
                                {lifecycle.description}
                            </p>
                            <p className="mt-6 flex gap-3 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
                                <Check
                                    aria-hidden="true"
                                    className="mt-0.5 size-4 shrink-0 text-primary"
                                />
                                {lifecycle.note}
                            </p>
                        </div>

                        <div className="min-w-0 space-y-8">
                            <ol className="flex flex-col gap-3 xl:flex-row xl:items-stretch">
                                {lifecycle.mainFlow.map((state, position) => (
                                    <li
                                        key={state.key}
                                        className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-stretch"
                                    >
                                        {position > 0 ? (
                                            <span
                                                aria-hidden="true"
                                                className="flex shrink-0 items-center justify-center text-primary"
                                            >
                                                <ArrowRight className="size-4 rotate-90 xl:rotate-0" />
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
                                        <li key={state.key} className="flex min-w-0">
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
