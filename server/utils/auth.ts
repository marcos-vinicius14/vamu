import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    emailAndPassword: {
        enabled: true
    },
    baseURL: process.env.BETTER_AUTH_URL,
    advanced: {
        cookiePrefix: "vamu-app",
    },
    session: {
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        },
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60
        }
    },
    trustedOrigins: ["http://localhost:3000", "http://192.168.0.15:3000"],
});
