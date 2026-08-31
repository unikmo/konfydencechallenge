import { preferVercelPostgresConnectionEnv } from "../lib/databaseEnv";

describe("preferVercelPostgresConnectionEnv", () => {
  it("replaces stale legacy URLs with Vercel Supabase integration URLs", () => {
    const env: Record<string, string | undefined> = {
      DATABASE_URL: "postgresql://legacy-pooler.invalid/postgres",
      DIRECT_URL: "postgresql://legacy-direct.invalid/postgres",
      POSTGRES_PRISMA_URL: "postgresql://current-pooler.example/postgres",
      POSTGRES_URL_NON_POOLING: "postgresql://current-direct.example/postgres",
    };

    preferVercelPostgresConnectionEnv(env);

    expect(env.DATABASE_URL).toBe(env.POSTGRES_PRISMA_URL);
    expect(env.DIRECT_URL).toBe(env.POSTGRES_URL_NON_POOLING);
  });

  it("keeps legacy URLs when integration variables are unavailable", () => {
    const env: Record<string, string | undefined> = {
      DATABASE_URL: "postgresql://local-pooler.example/postgres",
      DIRECT_URL: "postgresql://local-direct.example/postgres",
    };

    preferVercelPostgresConnectionEnv(env);

    expect(env.DATABASE_URL).toBe("postgresql://local-pooler.example/postgres");
    expect(env.DIRECT_URL).toBe("postgresql://local-direct.example/postgres");
  });
});
