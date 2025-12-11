import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schemas/index.ts',
  out: './server/database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});