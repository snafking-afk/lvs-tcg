import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { ProductType } from "../src/generated/prisma/enums";

// ============================================================
//  SEED — remplissage initial du catalogue
//  Lancer avec : npx prisma db seed   (ou: npm run db:seed)
//  Idempotent : on "upsert" par SKU, donc on peut le relancer
//  sans créer de doublons.
// ============================================================

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL manquante : renseigne-la dans .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/** Convertit un prix en euros (ex: 149.99) en centimes entiers (14999). */
function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

/** Génère un slug SEO à partir d'un nom (gère les accents). */
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les diacritiques (accents)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // tout ce qui n'est pas alphanum -> tiret
    .replace(/^-+|-+$/g, ""); // tirets de bord
}

type SeedProduct = {
  name: string;
  sku: string;
  type: ProductType;
  priceEuros: number;
  stock: number;
  imageUrl: string | null; // null -> fallback propre dans <ProductImage>
  description: string;
  isPreorder?: boolean;
  releaseDate?: string; // ISO (YYYY-MM-DD)
};

// Images : URLs CDN officielles TCGPlayer (vérifiées) ou null (fallback
// affiché par <ProductImage> tant qu'on n'a pas d'URL vérifiée).
const products: SeedProduct[] = [
  {
    // Ancien Display SV06 transformé en simple booster (nouveau SKU).
    name: "Booster individuel - Mascarade Crépusculaire",
    sku: "BOOST-SV06-TWM-FR",
    type: "BOOSTER",
    priceEuros: 5.49,
    stock: 40,
    imageUrl:
      "https://tcgplayer-cdn.tcgplayer.com/product/543843_in_1000x1000.jpg",
    description:
      "Booster individuel Écarlate et Violet — Mascarade Crépusculaire (SV06), version française.",
  },
  {
    name: "Coffret Dresseur d'élite (ETB) - Twilight Masquerade",
    sku: "ETB-TWM-EN",
    type: "ETB",
    priceEuros: 59.99,
    stock: 8,
    imageUrl:
      "https://tcgplayer-cdn.tcgplayer.com/product/543845_in_1000x1000.jpg",
    description:
      "Elite Trainer Box Twilight Masquerade : 9 boosters et accessoires de dresseur.",
  },
  {
    // Surging Sparks : plus en précommande -> en stock normal (disponible).
    name: "Coffret Dresseur d'élite (ETB) - Surging Sparks",
    sku: "ETB-SSP-EN",
    type: "ETB",
    priceEuros: 59.99,
    stock: 12,
    imageUrl:
      "https://tcgplayer-cdn.tcgplayer.com/product/565630_in_1000x1000.jpg",
    description:
      "Elite Trainer Box Surging Sparks : 9 boosters et accessoires de dresseur. En stock, expédition immédiate.",
  },
  {
    name: "Booster individuel - 151 Japonais",
    sku: "BOOST-151-JP",
    type: "BOOSTER",
    priceEuros: 27.99,
    stock: 20,
    imageUrl:
      "https://tcgplayer-cdn.tcgplayer.com/product/565242_in_1000x1000.jpg",
    description:
      "Booster individuel Pokémon Card 151 (sv2a) — version japonaise.",
  },
  {
    name: "Booster individuel - Mega Symphonia Japonais",
    sku: "BOOST-M1S-JP",
    type: "BOOSTER",
    priceEuros: 4.99,
    stock: 30,
    imageUrl:
      "https://tcgplayer-cdn.tcgplayer.com/product/647499_in_1000x1000.jpg",
    description:
      "Booster individuel Mega Symphonia (m1S) — version japonaise.",
  },
  {
    // Nouvelle précommande.
    name: "Coffret Dresseur d'élite (ETB) - Pitch Black",
    sku: "ETB-PBL-EN",
    type: "ETB",
    priceEuros: 64.99,
    stock: 0,
    isPreorder: true,
    releaseDate: "2026-07-17",
    imageUrl:
      "https://tcgplayer-cdn.tcgplayer.com/product/692947_in_1000x1000.jpg",
    description:
      "Elite Trainer Box Mega Évolution — Pitch Black (ME05). En précommande, réservez la vôtre dès maintenant.",
  },
  {
    // Nouveau booster (remplace les produits retirés).
    name: "Booster individuel - Destinées Rivales",
    sku: "BOOST-DRI-EN",
    type: "BOOSTER",
    priceEuros: 8.99,
    stock: 22,
    imageUrl:
      "https://tcgplayer-cdn.tcgplayer.com/product/624683_in_1000x1000.jpg",
    description:
      "Booster individuel Écarlate et Violet — Destinées Rivales (SV10).",
  },
];

async function main() {
  console.log(`🌱 Seed : ${products.length} produits...`);

  for (const p of products) {
    const data = {
      name: p.name,
      slug: slugify(p.name),
      sku: p.sku,
      type: p.type,
      description: p.description,
      priceCents: eurosToCents(p.priceEuros),
      stock: p.stock,
      imageUrl: p.imageUrl,
      isPreorder: p.isPreorder ?? false,
      releaseDate: p.releaseDate ? new Date(p.releaseDate) : null,
      isActive: true,
    };

    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: data,
      create: data,
    });

    console.log(`  ✓ ${product.sku.padEnd(18)} ${product.name}`);
  }

  // --- Purge : produits dont le SKU n'est plus dans le seed ---------------
  // L'upsert ne supprime rien : on nettoie ici les anciens produits.
  // Garde-fou : un produit déjà commandé (OrderItem, onDelete: Restrict)
  // ne peut pas être supprimé -> on le MASQUE (isActive=false) à la place.
  const keepSkus = products.map((p) => p.sku);
  const stale = await prisma.product.findMany({
    where: { sku: { notIn: keepSkus } },
    select: {
      id: true,
      sku: true,
      name: true,
      _count: { select: { orderItems: true } },
    },
  });

  for (const s of stale) {
    if (s._count.orderItems > 0) {
      await prisma.product.update({
        where: { id: s.id },
        data: { isActive: false },
      });
      console.log(`  ⊘ ${s.sku.padEnd(18)} masqué (déjà commandé) : ${s.name}`);
    } else {
      await prisma.product.delete({ where: { id: s.id } });
      console.log(`  ✗ ${s.sku.padEnd(18)} supprimé : ${s.name}`);
    }
  }

  const total = await prisma.product.count({ where: { isActive: true } });
  console.log(`✅ Terminé. ${total} produits actifs en base.`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur de seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
