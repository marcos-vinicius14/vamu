import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schemas'
import { env } from './env'

const createClient = () => {
    const isNeon = env.DATABASE_URL.includes('neon.tech')
    const sslMode = isNeon ? 'require' : (env.DB_SSL === 'disable' ? false : env.DB_SSL)

    return postgres(env.DATABASE_URL, {
        max: env.DB_MAX_CONNECTIONS,
        idle_timeout: 20,
        ssl: sslMode,
        prepare: false,
    })
}

// Type declaration for global singleton (used only in development)
declare global {
    // eslint-disable-next-line no-var
    var __db_client: ReturnType<typeof postgres> | undefined
}

/**
 * Database client with environment-aware connection strategy:
 * - Production: Creates a standard connection (no singleton needed)
 * - Development: Uses globalThis singleton to prevent "Too many connections" during HMR
 */
const getClient = (): ReturnType<typeof postgres> => {
    if (env.NODE_ENV === 'production') {
        // Production: standard connection - no HMR, no need for singleton
        return createClient()
    }

    // Development/Test: use global singleton to survive HMR
    if (!globalThis.__db_client) {
        globalThis.__db_client = createClient()
    }
    return globalThis.__db_client
}

const client = getClient()

export const db = drizzle(client, { schema })