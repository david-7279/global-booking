// src/main.tsx

import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from '@/src/(default)/authentication/context/authentication.provider.tsx'
import { Toaster } from '@/src/components/ui/toast.tsx'
import { queryClient } from '@/src/lib/query/query-client.ts'
import AppRouter from '@/src/router/app-router.tsx'
import './global.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('Root element "#root" not found')
}

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <AppRouter />
                    <Toaster />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
)
