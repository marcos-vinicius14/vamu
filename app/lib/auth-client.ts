import { createAuthClient } from "better-auth/vue"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" //TODO: Em produção isso virá do .env
})

export const { signIn, signUp, signOut, useSession } = authClient