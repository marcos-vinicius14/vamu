import { authClient } from '~/lib/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
    const { data } = await authClient.getSession()

    if (!data) {
        return navigateTo('/auth')
    }
})
