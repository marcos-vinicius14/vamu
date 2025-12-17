import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';

const apiUrl = process.env.VITE_API_BASE_URL || process.env.NUXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000';
const isSecure = apiUrl.startsWith('https://');

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),

    emailAndPassword: {
        enabled: true
    },

    baseURL: apiUrl,

    advanced: {
        cookiePrefix: "vamu-app",
        useSecureCookies: isSecure,
        useHttpOnlyCookies: true,
        ipAddress: {
            disableIpTracking: true,
        }
    },

    session: {
        cookie: {
            secure: isSecure,
            sameSite: 'lax',
        },
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,

        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    },

    trustedOrigins: [
        "http://localhost:3000",
        "http://192.168.0.15:3000",
        apiUrl
    ],
});