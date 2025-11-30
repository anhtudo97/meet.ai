import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL || ''
  },
  breakpoints: true, // Enable type-safe migrations
  strict: true, // Enable strict mode
  verbose: true // Enable verbose logging
})
