import { createAuthClient } from "better-auth/vue"
import type { H3Event } from "h3"

/**
 * Creates an auth client with optional SSR cookie forwarding.
 * During SSR, pass the H3Event to forward browser cookies to Better Auth.
 */
export function createSSRAwareAuthClient(event?: H3Event | null) {
    const config = useRuntimeConfig()

    return createAuthClient({
        baseURL: config.public.betterAuthUrl as string || "http://localhost:3000",
        fetchOptions: {
            // Forward cookies during SSR
            headers: import.meta.server && event
                ? { cookie: event.headers.get('cookie') || '' }
                : undefined
        }
    })
}

/**
 * Composable for auth operations. Use this in components.
 */
export function useAuthClient() {
    const config = useRuntimeConfig()

    const authClient = createAuthClient({
        baseURL: config.public.betterAuthUrl as string || "http://localhost:3000"
    })

    return {
        authClient,
        signIn: authClient.signIn,
        signUp: authClient.signUp,
        signOut: authClient.signOut,
        useSession: authClient.useSession,
    }
}

// Re-export useSession as a standalone composable for convenience
export function useSession() {
    const { useSession: getSession } = useAuthClient()
    return getSession()
}