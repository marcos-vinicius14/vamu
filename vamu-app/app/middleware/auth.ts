import { useSession } from '~/lib/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
    const session = useSession()
    if (!session.value.data) {
        return navigateTo('/auth')
    }
})
