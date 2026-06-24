import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ============================================================
//  Singleton Prisma (Prisma 7 — Query Compiler + driver adapter)
//
//  Prisma 7 n'embarque plus de moteur Rust : la connexion passe
//  par un "driver adapter". Ici on utilise node-postgres (pg),
//  compatible avec Neon en connexion directe.
//
//  Le singleton évite de recréer une connexion à chaque hot-reload
//  de Next.js en dev (ce qui saturerait la base).
// ============================================================

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL est manquante. Renseigne-la dans le fichier .env (chaîne de connexion Neon).",
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
