// src/(default)/layout.tsx

import { Outlet } from 'react-router'
import SafeArea from '@/src/components/shared/safe-area.tsx'

/** App shell: page content covers the reveal footer. */
export function AppLayout() {
    return (
        <SafeArea>
            <div className="relative z-10 flex min-h-dvh flex-col bg-background">
                <Outlet />
            </div>
        </SafeArea>
    )
}
