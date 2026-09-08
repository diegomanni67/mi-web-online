import { neon } from '@neondatabase/serverless'

let cachedSql: ReturnType<typeof neon> | null = null

export function getKoterieSql() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured')
  }

  if (!cachedSql) cachedSql = neon(databaseUrl)
  return cachedSql
}
