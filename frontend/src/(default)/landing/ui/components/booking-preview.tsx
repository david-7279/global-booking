// src/(default)/landing/ui/components/booking-preview.tsx

import { Bell, Check } from 'lucide-react'
import { useBookingDemo } from '@/src/(default)/landing/hooks/use-booking-demo.ts'
import type { LandingBookingPreview } from '@/src/(default)/landing/types/landing.types.ts'
import { Button } from '@/src/components/ui/button.tsx'
import { cn } from '@/src/lib/utils.ts'
import {withPositionKeys} from "@/src/lib/utils/with-position-keys.ts";

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
        <div className="relative">
            <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 border border-border bg-muted/50"
            />
            <div className="relative border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                    <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {preview.caption}
                    </p>
                    <p
                        aria-live="polite"
                        className="inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em]"
                    >
                        <span className="sr-only">{preview.statusLabel}:</span>
                        <span
                            aria-hidden="true"
                            className={cn(
                                'size-1.5 transition-colors',
                                stage === 'confirmed' ? 'bg-foreground' : 'bg-muted-foreground/60',
                                stage === 'pending' && 'motion-safe:animate-pulse',
                            )}
                        />
                        {preview.status[stage]}
                    </p>
                </div>

                <div className="space-y-6 p-5 sm:p-6">
                    <div>
                        <p className="font-heading text-2xl tracking-tight">{preview.heading}</p>
                        <dl className="mt-4 border border-border bg-background px-4 py-3">
                            <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                {preview.serviceLabel}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold">{preview.serviceName}</dd>
                            <dd className="text-sm text-muted-foreground">{preview.serviceMeta}</dd>
                        </dl>
                    </div>

                    <fieldset>
                        <legend className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {preview.slotsLabel}
                        </legend>
                        <div className="mt-3 grid grid-cols-3 gap-2">
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
                                            'h-10 border text-sm tabular-nums transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                            selected
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border hover:bg-muted',
                                            !canPickSlot && !selected && 'opacity-40',
                                            !canPickSlot && 'cursor-default',
                                        )}
                                    >
                                        {item}
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>

                    <div>
                        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {preview.timelineLabel}
                        </p>
                        <ol className="mt-3 space-y-2.5">
                            {withPositionKeys(preview.timeline).map(({ key, item }, position) => {
                                const state = timelineState(position)

                                return (
                                    <li key={key} className="flex items-center gap-3 text-sm">
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'flex size-5 shrink-0 items-center justify-center border transition-colors',
                                                state === 'done' &&
                                                    'border-primary bg-primary text-primary-foreground',
                                                state === 'active' && 'border-foreground',
                                                state === 'todo' && 'border-border',
                                            )}
                                        >
                                            {state === 'done' ? <Check className="size-3" /> : null}
                                            {state === 'active' ? (
                                                <span className="size-1.5 bg-foreground motion-safe:animate-pulse" />
                                            ) : null}
                                        </span>
                                        <span
                                            className={
                                                state === 'todo'
                                                    ? 'text-muted-foreground'
                                                    : 'text-foreground'
                                            }
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
                            className="flex gap-3 border border-border bg-muted/50 p-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1"
                        >
                            <Bell aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                            <div className="text-sm leading-6">
                                <p className="font-semibold">{preview.notification.title}</p>
                                <p className="text-muted-foreground">{preview.notification.body}</p>
                            </div>
                        </div>
                    ) : null}

                    <Button
                        type="button"
                        variant={stage === 'idle' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={advance}
                    >
                        {preview.actions[stage]}
                    </Button>
                </div>
            </div>
        </div>
    )
}
