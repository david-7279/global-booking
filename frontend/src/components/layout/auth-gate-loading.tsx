// src/components/layout/auth-gate-loading.tsx

import { Text } from '@/src/components/ui/text.tsx'

/** Full-screen pending state shown while the auth gate resolves session restore or login. */
export function AuthGateLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Text variant="small">A carregar…</Text>
            </div>
        </div>
    )
}
