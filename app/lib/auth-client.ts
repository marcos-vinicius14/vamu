import { createAuthClient } from "better-auth/vue"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3000"
})

export const { signIn, signUp, signOut, useSession } = authClient;