import { authClient } from '~/lib/auth-client'

export default defineNuxtPlugin(async (nuxtApp) => {
    // Fetch session on both server and client to ensure hydration
    if (import.meta.server || !nuxtApp.payload.serverRendered) {
        await authClient.getSession()
    }
})
