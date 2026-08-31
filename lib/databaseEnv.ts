/**
 * Vercel's Supabase integration owns the POSTGRES_* variables. Prefer those
 * values when present so a stale legacy DATABASE_URL cannot route the app to
 * a disconnected Supabase project.
 */
export function preferVercelPostgresConnectionEnv(
  env: Record<string, string | undefined> = process.env,
): void {
  if (env.POSTGRES_PRISMA_URL) {
    env.DATABASE_URL = env.POSTGRES_PRISMA_URL;
  }

  if (env.POSTGRES_URL_NON_POOLING) {
    env.DIRECT_URL = env.POSTGRES_URL_NON_POOLING;
  }
}
