import { PrismaClient } from "@prisma/client";
import { preferVercelPostgresConnectionEnv } from "./databaseEnv";

preferVercelPostgresConnectionEnv();

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

