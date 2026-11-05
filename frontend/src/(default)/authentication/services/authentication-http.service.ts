import { AxiosError, type AxiosInstance } from 'axios'
import type { AuthenticationSessionService } from '@/src/(default)/authentication/services/authentication-session.service.ts'
import { isApiError } from '@/src/lib/api/api-errors.ts'

function isAuthenticationEndpoint(url: string): boolean {
    try {
        const pathname = new URL(url, 'http://localhost').pathname
        return /(?:^|\/)auth(?:\/|$)/.test(pathname)
    } catch {
        return /(?:^|\/)auth(?:\/|\?|$)/.test(url)
    }
}

/** Axios runs request interceptors in reverse order: install after the bearer interceptor. */
export function installAuthenticationInterceptor(
    client: AxiosInstance,
    session: Pick<AuthenticationSessionService, 'ensureFresh'>,
): () => void {
    const id = client.interceptors.request.use(async (config) => {
        // The refresh and /me requests must not recursively await their own refresh.
        if (!isAuthenticationEndpoint(config.url ?? '')) {
            try {
                await session.ensureFresh()
            } catch (error) {
                // The shared response interceptor expects Axios errors. Preserve the status
                // of a failed refresh instead of misclassifying 401/5xx as a network error.
                if (isApiError(error) && error.status > 0) {
                    const message = 'Não foi possível verificar a sessão.'
                    throw new AxiosError(message, undefined, config, undefined, {
                        status: error.status,
                        statusText: '',
                        data: { error: { message } },
                        headers: {},
                        config,
                    })
                }
                throw error
            }
        }
        return config
    })
    return () => client.interceptors.request.eject(id)
}
