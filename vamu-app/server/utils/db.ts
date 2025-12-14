import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schemas'
import { env } from './env'

const createClient = () => {
    return postgres(env.DATABASE_URL, {
        max: env.DB_MAX_CONNECTIONS,
        idle_timeout: 20,
        ssl: env.DB_SSL === 'disable' ? false : env.DB_SSL,
        prepare: false,
    })
}

// Singleton pattern for development HMR safety
const globalForDb = globalThis as unknown as {
    client: ReturnType<typeof postgres> | undefined
}

const client = globalForDb.client ?? createClient()

if (process.env.NODE_ENV === 'development') {
    globalForDb.client = client
}

export const db = drizzle(client, { schema })