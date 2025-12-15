import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().url(),
    DB_MAX_CONNECTIONS: z.coerce.number().min(1).max(100).default(10),
    DB_SSL: z.enum(['require', 'prefer', 'disable']).default('disable'),
})

export const env = envSchema.parse(process.env)
