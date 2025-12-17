import { createSSRAwareAuthClient } from '~/lib/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
    const event = useRequestEvent()
    const authClient = createSSRAwareAuthClient(event)

    const { data } = await authClient.getSession()

    if (!data) {
        return navigateTo('/auth')
    }
})
