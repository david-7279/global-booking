import type {
    AuthenticatedUser,
    AuthenticationGateway,
    AuthenticationStatus,
    AuthenticationStorage,
    AuthSession,
    AuthToken,
    LoginPayload,
    RegisterPayload,
    StoredAuthentication,
} from '@/src/(default)/authentication/types/authentication.types.ts'
import { ApiError, isApiError } from '@/src/lib/api/api-errors.ts'

const REFRESH_LEAD_MS = 30_000
const RETRY_MS = 30_000
const MAX_TIMEOUT_MS = 2_147_483_647
const SESSION_ERROR = 'Não foi possível verificar a sessão. Verifique a ligação e tente novamente.'
const LOGOUT_ERROR =
    'A sessão foi terminada neste dispositivo, mas não foi possível confirmar a revogação no servidor.'

export type AuthenticationSnapshot = {
    status: AuthenticationStatus
    user: AuthenticatedUser | null
    token: string | null
    isAuthenticated: boolean
    isAuthenticating: boolean
    isRefreshing: boolean
    error: string | null
}

function isRejection(error: unknown): boolean {
    return isApiError(error) && (error.status === 401 || error.status === 403)
}

/** JWT payload is used only as an expiry hint, never as proof of identity. */
function jwtExpiry(token: string): number | undefined {
    try {
        const payload = token.split('.')[1]
        if (!payload) return undefined
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
        const parsed: unknown = JSON.parse(
            atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')),
        )
        if (!parsed || typeof parsed !== 'object') return undefined
        const exp = (parsed as { exp?: unknown }).exp
        return typeof exp === 'number' && Number.isFinite(exp) ? exp * 1000 : undefined
    } catch {
        return undefined
    }
}

function storedTokens(token: AuthToken, now: number): StoredAuthentication {
    const lifetime =
        typeof token.expiresIn === 'number' &&
        Number.isFinite(token.expiresIn) &&
        token.expiresIn >= 0
            ? token.expiresIn * 1000
            : undefined
    const expiresAt = lifetime === undefined ? jwtExpiry(token.accessToken) : now + lifetime
    const remaining = expiresAt === undefined ? undefined : Math.max(0, expiresAt - now)
    // For short-lived tokens, use 10% of their lifetime, avoiding an immediate refresh loop.
    const refreshAt =
        expiresAt === undefined || remaining === undefined
            ? undefined
            : expiresAt - Math.min(REFRESH_LEAD_MS, remaining / 10)
    return {
        accessToken: token.accessToken,
        ...(token.refreshToken ? { refreshToken: token.refreshToken } : {}),
        ...(expiresAt !== undefined ? { expiresAt, refreshAt } : {}),
    }
}

/** Framework-independent session state machine. Tokens never appear in errors or logs. */
export class AuthenticationSessionService {
    private snapshot: AuthenticationSnapshot = {
        status: 'restoring',
        user: null,
        token: null,
        isAuthenticated: false,
        isAuthenticating: false,
        isRefreshing: false,
        error: null,
    }
    private readonly listeners = new Set<() => void>()
    private current: StoredAuthentication | null = null
    private generation = 0
    private logoutGeneration = 0
    private restored = false
    private restorePromise: Promise<void> | null = null
    private refreshPromise: Promise<AuthSession> | null = null
    private recoveryPromise: Promise<void> | null = null
    private logoutPromise: Promise<boolean> | null = null
    private readonly pendingAuth = new Set<Promise<AuthSession>>()
    private active = false
    private timer: ReturnType<typeof setTimeout> | null = null
    private readonly gateway: AuthenticationGateway
    private readonly storage: AuthenticationStorage

    constructor(gateway: AuthenticationGateway, storage: AuthenticationStorage) {
        this.gateway = gateway
        this.storage = storage
    }

    getSnapshot = (): AuthenticationSnapshot => this.snapshot
    getAccessToken = (): string | null => this.current?.accessToken ?? null
    subscribe = (listener: () => void): (() => void) => {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    activate(): void {
        this.active = true
        this.scheduleRefresh()
    }
    deactivate(): void {
        this.active = false
        this.clearTimer()
    }
    private update(patch: Partial<AuthenticationSnapshot>): void {
        const next = { ...this.snapshot, ...patch }
        next.isAuthenticated = next.status === 'authenticated' && !!next.user && !!next.token
        this.snapshot = next
        for (const listener of this.listeners) listener()
    }
    private clearTimer(): void {
        if (this.timer !== null) clearTimeout(this.timer)
        this.timer = null
    }
    private scheduleRefresh(delay?: number): void {
        this.clearTimer()
        const session = this.current
        if (!this.active || !session?.refreshToken) return
        const refreshAt =
            session.refreshAt ??
            (session.expiresAt !== undefined ? session.expiresAt - REFRESH_LEAD_MS : undefined)
        if (delay === undefined && refreshAt === undefined) return
        const wait = Math.max(
            1_000,
            Math.min(MAX_TIMEOUT_MS, delay ?? Math.max(0, (refreshAt ?? 0) - Date.now())),
        )
        this.timer = setTimeout(() => {
            this.timer = null
            // Very long timeouts must be recalculated rather than refreshing years early.
            if (delay === undefined && refreshAt !== undefined && refreshAt > Date.now()) {
                this.scheduleRefresh()
                return
            }
            void this.refresh().catch(() => {})
        }, wait)
    }
    private apply(session: AuthSession): void {
        this.current = storedTokens(session.token, Date.now())
        this.storage.save(this.current)
        this.restored = true
        this.update({
            status: 'authenticated',
            user: session.user,
            token: session.token.accessToken,
            error: null,
        })
        this.scheduleRefresh()
    }
    private invalidate(): void {
        this.generation += 1
        this.current = null
        this.restored = true
        this.storage.clear()
        this.clearTimer()
        this.update({
            status: 'unauthenticated',
            user: null,
            token: null,
            isRefreshing: false,
            error: null,
        })
    }

    restore = (): Promise<void> => {
        if (this.restorePromise) return this.restorePromise
        if (this.restored) return Promise.resolve()
        const version = this.generation
        const task = this.doRestore(version)
        this.restorePromise = task
        void task.then(
            () => {
                if (this.restorePromise === task) this.restorePromise = null
            },
            () => {
                if (this.restorePromise === task) this.restorePromise = null
            },
        )
        return task
    }
    private async doRestore(version: number): Promise<void> {
        const stored = this.storage.load()
        if (version !== this.generation) return
        if (!stored) {
            this.restored = true
            this.update({ status: 'unauthenticated', token: null, user: null, error: null })
            return
        }
        const expiresAt = stored.expiresAt ?? jwtExpiry(stored.accessToken)
        this.current = { ...stored, ...(expiresAt !== undefined ? { expiresAt } : {}) }
        this.update({ token: stored.accessToken, error: null })
        try {
            if (this.shouldRefresh()) {
                await this.refresh()
                return
            }
            const user = await this.gateway.me(stored.accessToken)
            if (version !== this.generation || this.current?.accessToken !== stored.accessToken)
                return
            this.restored = true
            this.update({ status: 'authenticated', user, token: stored.accessToken, error: null })
            this.scheduleRefresh()
        } catch (error) {
            if (version !== this.generation || !this.current) return
            // A concurrent refresh may already have replaced the token used by /me.
            if (this.current.accessToken !== stored.accessToken) return
            if (isRejection(error)) {
                if (!this.current.refreshToken) {
                    this.invalidate()
                    return
                }
                try {
                    await this.refresh()
                    return
                } catch (refreshError) {
                    if (version !== this.generation || !this.current) return
                    if (isRejection(refreshError)) return
                }
            }
            // A network/5xx failure is not evidence that the stored session is invalid.
            this.restored = true
            this.update({ status: 'unauthenticated', user: null, error: SESSION_ERROR })
        }
    }
    retryRestore = async (): Promise<void> => {
        if (this.snapshot.status === 'authenticated') return
        if (this.restorePromise) return this.restorePromise
        this.restored = false
        this.update({ status: 'restoring', error: null })
        await this.restore()
    }
    private shouldRefresh(): boolean {
        if (!this.current?.refreshToken) return false
        const due =
            this.current.refreshAt ??
            (this.current.expiresAt !== undefined
                ? this.current.expiresAt - REFRESH_LEAD_MS
                : undefined)
        return due !== undefined && Date.now() >= due
    }

    /** All callers, including the timer and HTTP interceptor, join the same rotation. */
    private refresh(): Promise<AuthSession> {
        if (this.refreshPromise) return this.refreshPromise
        const refreshToken = this.current?.refreshToken
        if (!refreshToken)
            return Promise.reject(new ApiError('Não existe uma sessão renovável.', 401))
        const version = this.generation
        this.clearTimer()
        this.update({ isRefreshing: true })
        const task = Promise.resolve()
            .then(() => this.gateway.refresh(refreshToken))
            .then((session) => {
                if (version === this.generation && this.current?.refreshToken === refreshToken) {
                    this.apply(session)
                }
                return session
            })
            .catch((error: unknown) => {
                if (version === this.generation && this.current?.refreshToken === refreshToken) {
                    if (isRejection(error)) this.invalidate()
                    else {
                        this.update({ error: SESSION_ERROR })
                        this.scheduleRefresh(RETRY_MS)
                    }
                }
                throw error
            })
            .finally(() => {
                if (this.refreshPromise === task) this.refreshPromise = null
                if (version === this.generation) this.update({ isRefreshing: false })
            })
        this.refreshPromise = task
        return task
    }

    /** Called before the shared client's own bearer interceptor (Axios request interceptors are LIFO). */
    ensureFresh = async (): Promise<string | null> => {
        if (!this.current) return null
        const version = this.generation
        if (this.refreshPromise || this.shouldRefresh()) {
            try {
                await this.refresh()
            } catch (error) {
                // A transient failure may still permit using an unexpired access token.
                if (
                    version !== this.generation ||
                    !this.current ||
                    isRejection(error) ||
                    (this.current.expiresAt !== undefined && this.current.expiresAt <= Date.now())
                )
                    throw error
            }
        }
        if (version !== this.generation && !this.current)
            throw new ApiError('A sessão terminou.', 401)
        return this.current?.accessToken ?? null
    }

    /** The shared 401 callback has no request/token argument: revalidate the *current* token. */
    onUnauthorized = (): void => {
        if (this.recoveryPromise || !this.current || this.logoutPromise) return
        const task = this.recoverUnauthorized()
        this.recoveryPromise = task
        void task.finally(() => {
            if (this.recoveryPromise === task) this.recoveryPromise = null
        })
    }
    private async recoverUnauthorized(): Promise<void> {
        try {
            if (this.refreshPromise) await this.refreshPromise
            const token = this.current?.accessToken
            if (!token || this.logoutPromise) return
            const version = this.generation
            try {
                await this.gateway.me(token)
            } catch (error) {
                if (version !== this.generation || this.current?.accessToken !== token) return
                if (isRejection(error)) {
                    if (this.current.refreshToken) await this.refresh()
                    else this.invalidate()
                } else {
                    this.update({ error: SESSION_ERROR })
                }
            }
        } catch {
            // refresh() has already classified the failure and updated state.
        }
    }

    login = (payload: LoginPayload): Promise<void> =>
        this.authenticate(() => this.gateway.login(payload))
    register = (payload: RegisterPayload): Promise<void> =>
        this.authenticate(() => this.gateway.register(payload))
    private async authenticate(request: () => Promise<AuthSession>): Promise<void> {
        while (this.logoutPromise) await this.logoutPromise
        const beforeLogout = this.logoutGeneration
        if (this.refreshPromise) {
            try {
                await this.refreshPromise
            } catch {
                /* Login remains possible after a failed refresh. */
            }
            if (beforeLogout !== this.logoutGeneration) {
                throw new Error('Operação de autenticação cancelada.')
            }
        }
        const version = ++this.generation
        const pending = Promise.resolve().then(request)
        this.pendingAuth.add(pending)
        this.update({ isAuthenticating: true, error: null })
        try {
            const session = await pending
            if (version !== this.generation) {
                // Logout collects all in-flight results and revokes their refresh tokens.
                // A superseded login outside logout must not leave an orphan session either.
                if (!this.logoutPromise && session.token.refreshToken) {
                    void this.gateway.logout(session.token.refreshToken).catch(() => {})
                }
                throw new Error('Operação de autenticação cancelada.')
            }
            this.apply(session)
        } finally {
            this.pendingAuth.delete(pending)
            this.update({ isAuthenticating: this.pendingAuth.size > 0 })
        }
    }

    /** Returns false if server-side revocation could not be confirmed; never rejects. */
    logout = (): Promise<boolean> => {
        if (this.logoutPromise) return this.logoutPromise
        const current = this.current ?? (!this.restored ? this.storage.load() : null)
        const rotating = this.refreshPromise
        const pending = [...this.pendingAuth]
        this.generation += 1
        this.logoutGeneration += 1
        this.current = null
        this.restored = true
        this.storage.clear()
        this.clearTimer()
        this.update({
            status: 'unauthenticated',
            user: null,
            token: null,
            isRefreshing: false,
            error: null,
        })
        const task = this.finishLogout(current, rotating, pending)
        this.logoutPromise = task
        void task.then(() => {
            if (this.logoutPromise === task) this.logoutPromise = null
        })
        return task
    }
    private async finishLogout(
        current: StoredAuthentication | null,
        rotating: Promise<AuthSession> | null,
        pending: Promise<AuthSession>[],
    ): Promise<boolean> {
        const all = await Promise.allSettled([...(rotating ? [rotating] : []), ...pending])
        const tokens = new Set<string>()
        let uncertain = false
        if (rotating) {
            const result = all[0]
            if (result?.status === 'fulfilled') {
                if (result.value.token.refreshToken) tokens.add(result.value.token.refreshToken)
                else uncertain = true
            } else {
                if (current?.refreshToken) tokens.add(current.refreshToken)
                // The server could have rotated a token even if its response was lost.
                if (result?.status === 'rejected' && !isRejection(result.reason)) uncertain = true
            }
        } else if (current?.refreshToken) tokens.add(current.refreshToken)
        else if (current) uncertain = true // Legacy access-only sessions cannot be revoked here.
        for (const result of all.slice(rotating ? 1 : 0)) {
            if (result.status === 'fulfilled') {
                if (result.value.token.refreshToken) tokens.add(result.value.token.refreshToken)
                else uncertain = true
            } else if (!isRejection(result.reason)) {
                // A lost login response could also have created a server-side session.
                uncertain = true
            }
        }
        const revoked = await Promise.allSettled(
            [...tokens].map((token) => Promise.resolve().then(() => this.gateway.logout(token))),
        )
        if (revoked.some((result) => result.status === 'rejected')) uncertain = true
        if (uncertain) this.update({ error: LOGOUT_ERROR })
        return !uncertain
    }
}
