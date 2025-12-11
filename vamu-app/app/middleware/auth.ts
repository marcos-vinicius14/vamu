import { useSession, authClient } from '~/lib/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
    const session = useSession()
    await authClient.getSession()
    if (!session.value.data) {
        return navigateTo('/auth')
    }
})
