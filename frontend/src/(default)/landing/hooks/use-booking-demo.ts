// src/(default)/landing/hooks/use-booking-demo.ts

import { useState } from 'react'

export type BookingDemoStage = 'idle' | 'pending' | 'confirmed'

const NEXT_STAGE: Readonly<Record<BookingDemoStage, BookingDemoStage>> = {
    idle: 'pending',
    pending: 'confirmed',
    confirmed: 'idle',
}

/** State machine of the illustrative booking card: idle → pending → confirmed → idle. */
export function useBookingDemo(defaultSlotIndex: number) {
    const [slotIndex, setSlotIndex] = useState(defaultSlotIndex)
    const [stage, setStage] = useState<BookingDemoStage>('idle')

    return {
        slotIndex,
        stage,
        /** Slots can only be changed before the request is sent. */
        canPickSlot: stage === 'idle',
        pickSlot: setSlotIndex,
        advance: () => setStage((current) => NEXT_STAGE[current]),
    }
}
