// src/(default)/landing/ui/components/landing-icon.tsx

import {
    Bell,
    Building2,
    CalendarDays,
    Clock,
    EyeOff,
    FileText,
    Layers,
    ListChecks,
    Lock,
    type LucideIcon,
    Mail,
    Send,
    Settings2,
    ShieldCheck,
    Store,
    User,
    Users,
} from 'lucide-react'
import type { LandingIconKey } from '@/src/(default)/landing/types/landing.types.ts'

const ICONS: Readonly<Record<LandingIconKey, LucideIcon>> = {
    building: Building2,
    user: User,
    store: Store,
    layers: Layers,
    clock: Clock,
    'list-checks': ListChecks,
    bell: Bell,
    users: Users,
    lock: Lock,
    shield: ShieldCheck,
    'eye-off': EyeOff,
    'file-text': FileText,
    calendar: CalendarDays,
    send: Send,
    settings: Settings2,
    mail: Mail,
}

type LandingIconProps = {
    name: LandingIconKey
    className?: string
}

/** Resolves a language-neutral icon key to its (decorative) icon. */
export function LandingIcon({ name, className }: LandingIconProps) {
    const Icon = ICONS[name]
    return <Icon aria-hidden="true" className={className} />
}
