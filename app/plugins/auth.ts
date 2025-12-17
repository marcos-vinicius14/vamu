import { createSSRAwareAuthClient } from '~/lib/auth-client'

export default defineNuxtPlugin(async (nuxtApp) => {
    const event = useRequestEvent()
    const authClient = createSSRAwareAuthClient(event)

    // Fetch session on both server and client to ensure hydration
    if (import.meta.server || !nuxtApp.payload.serverRendered) {
        await authClient.getSession()
    }
})
