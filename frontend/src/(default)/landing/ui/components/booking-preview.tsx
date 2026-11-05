// src/(default)/landing/ui/components/booking-preview.tsx

import { Bell, Check } from 'lucide-react'
import { useBookingDemo } from '@/src/(default)/landing/hooks/use-booking-demo.ts'
import type { LandingBookingPreview } from '@/src/(default)/landing/types/landing.types.ts'
import { Button } from '@/src/components/ui/button.tsx'
import { withPositionKeys } from '@/src/lib/utils/with-position-keys.ts'
import { cn } from '@/src/lib/utils.ts'

type BookingPreviewProps = {
    preview: LandingBookingPreview
}

type TimelineState = 'done' | 'active' | 'todo'

const COMPLETED_STEPS = { idle: 0, pending: 1, confirmed: 3 } as const

/**
 * Illustrative, interactive booking card. It is a demo, never real data: the caption says
 * so, and it simulates the pending → confirmed flow the page explains.
 */
export function BookingPreview({ preview }: BookingPreviewProps) {
    const { slotIndex, stage, canPickSlot, pickSlot, advance } = useBookingDemo(
        preview.defaultSlotIndex,
    )
    const completed = COMPLETED_STEPS[stage]

    function timelineState(position: number): TimelineState {
        if (position < completed) return 'done'
        if (stage === 'pending' && position === completed) return 'active'
        return 'todo'
    }

    return (
        <div className="relative rounded-[1.75rem] border border-border/80 bg-secondary/75 p-3 sm:p-6 lg:p-7">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[1.75rem] [background-image:radial-gradient(ellipse_at_top_right,#f7fbf6_0%,transparent_60%)]"
            />
            <div className="relative min-w-0 rounded-2xl border border-border bg-card shadow-[0_22px_60px_-24px_rgba(24,51,47,0.28)]">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-5 py-4 sm:px-7">
                    <p className="min-w-0 text-[0.6875rem] font-semibold uppercase leading-relaxed tracking-[0.13em] text-muted-foreground [overflow-wrap:anywhere]">
                        {preview.caption}
                    </p>
                    <p
                        aria-live="polite"
                        className="inline-flex max-w-full items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold leading-snug text-primary [overflow-wrap:anywhere]"
                    >
                        <span className="sr-only">{preview.statusLabel}:</span>
                        <span
                            aria-hidden="true"
                            className={cn(
                                'size-2 shrink-0 rounded-full transition-colors motion-reduce:transition-none',
                                stage === 'confirmed' ? 'bg-primary' : 'bg-muted-foreground/60',
                                stage === 'pending' && 'motion-safe:animate-pulse',
                            )}
                        />
                        {preview.status[stage]}
                    </p>
                </div>

                <div className="space-y-6 p-5 sm:space-y-7 sm:p-7">
                    <div className="min-w-0">
                        <p className="font-heading text-3xl leading-tight tracking-tight text-foreground [overflow-wrap:anywhere]">
                            {preview.heading}
                        </p>
                        <dl className="mt-5 rounded-xl border border-border/80 bg-background px-4 py-4 sm:px-5">
                            <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground [overflow-wrap:anywhere]">
                                {preview.serviceLabel}
                            </dt>
                            <dd className="mt-2 text-sm font-semibold leading-6 text-foreground [overflow-wrap:anywhere]">
                                {preview.serviceName}
                            </dd>
                            <dd className="text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">
                                {preview.serviceMeta}
                            </dd>
                        </dl>
                    </div>

                    <fieldset className="min-w-0">
                        <legend className="text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground [overflow-wrap:anywhere]">
                            {preview.slotsLabel}
                        </legend>
                        <div className="mt-3 grid grid-cols-2 gap-2 min-[360px]:grid-cols-3">
                            {withPositionKeys(preview.slots).map(({ key, item }, position) => {
                                const selected = position === slotIndex

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        aria-pressed={selected}
                                        disabled={!canPickSlot}
                                        onClick={() => pickSlot(position)}
                                        className={cn(
                                            'min-h-11 min-w-0 rounded-lg border px-2 py-2 text-sm font-medium leading-snug tabular-nums outline-none [overflow-wrap:anywhere] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring',
                                            selected
                                                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                                : 'border-[#71877f] bg-card text-foreground hover:border-primary hover:bg-secondary/60',
                                            !canPickSlot && !selected && 'opacity-50',
                                            !canPickSlot && 'cursor-default',
                                        )}
                                    >
                                        {item}
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>

                    <div className="border-t border-border pt-6">
                        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground [overflow-wrap:anywhere]">
                            {preview.timelineLabel}
                        </p>
                        <ol className="mt-4 space-y-3">
                            {withPositionKeys(preview.timeline).map(({ key, item }, position) => {
                                const state = timelineState(position)

                                return (
                                    <li
                                        key={key}
                                        className="flex min-w-0 items-start gap-3 text-sm leading-6"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors motion-reduce:transition-none',
                                                state === 'done' &&
                                                    'border-primary bg-primary text-primary-foreground',
                                                state === 'active' && 'border-primary bg-secondary',
                                                state === 'todo' && 'border-border bg-background',
                                            )}
                                        >
                                            {state === 'done' ? <Check className="size-3" /> : null}
                                            {state === 'active' ? (
                                                <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
                                            ) : null}
                                        </span>
                                        <span
                                            className={cn(
                                                'min-w-0 [overflow-wrap:anywhere]',
                                                state === 'todo'
                                                    ? 'text-muted-foreground'
                                                    : 'font-medium text-foreground',
                                            )}
                                        >
                                            {item}
                                        </span>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>

                    {stage === 'confirmed' ? (
                        <div
                            role="status"
                            className="flex gap-3 rounded-xl border border-border bg-secondary/60 p-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1"
                        >
                            <Bell
                                aria-hidden="true"
                                className="mt-1 size-4 shrink-0 text-primary"
                            />
                            <div className="min-w-0 text-sm leading-6 [overflow-wrap:anywhere]">
                                <p className="font-semibold text-foreground">
                                    {preview.notification.title}
                                </p>
                                <p className="text-muted-foreground">{preview.notification.body}</p>
                            </div>
                        </div>
                    ) : null}

                    <Button
                        type="button"
                        variant={stage === 'idle' ? 'default' : 'outline'}
                        className={cn(
                            'h-auto min-h-12 w-full min-w-0 rounded-lg px-5 py-3 text-center text-sm font-semibold leading-snug normal-case tracking-normal whitespace-normal [overflow-wrap:anywhere] shadow-sm focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:active:!translate-y-0',
                            stage !== 'idle' && 'hover:!bg-secondary',
                        )}
                        onClick={advance}
                    >
                        {preview.actions[stage]}
                    </Button>
                </div>
            </div>
        </div>
    )
}
