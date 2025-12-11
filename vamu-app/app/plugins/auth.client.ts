import { authClient } from '~/lib/auth-client'

export default defineNuxtPlugin(async () => {
    await authClient.getSession()
})
