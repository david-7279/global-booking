// src/(services)/dashboard/ui/page.tsx

import { PlusIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuthenticatedUser } from '@/src/(default)/authentication/hooks/use-authenticated-user.ts'
import AsideTopBar from '@/src/(services)/ui/layout/components/aside-top-bar.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { paths } from '@/src/router/paths.ts'

function greeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
}

/**
 * Booking dashboard — the authenticated home.
 * Three async reads (balances, upcoming leave, team presence) share the
 * query cache with the list/calendar screens; each section owns its own
 * pending/error/empty state.
 */
export default function BookingDashboardPage() {
    const user = useAuthenticatedUser()
    const navigate = useNavigate()

    return (
        <SafeArea>
            <div className="shrink-0">
                <AsideTopBar title="Dashboard" />
            </div>

            <Wrapper className="flex w-full max-w-5xl flex-1 flex-col gap-10 overflow-y-auto p-10 pb-16">
                {/* ── Headline block — the page's one display moment ───────── */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Text
                            variant="xs"
                            className="uppercase tracking-widest text-muted-foreground"
                        >
                            Overview &amp; attendance · Planner
                        </Text>
                        <h1 className="font-display mt-2 text-6xl font-medium leading-[1.05] tracking-tight md:text-8xl">
                            {greeting()}, <em className="font-display italic">{user.name}</em>.
                        </h1>
                    </div>
                    <Button
                        className="shrink-0 rounded-none uppercase tracking-widest"
                        onClick={() => navigate(paths.workspace.booking.root)}
                    >
                        Request leave <PlusIcon className="size-4" aria-hidden="true" />
                    </Button>
                </div>
            </Wrapper>
        </SafeArea>
    )
}
