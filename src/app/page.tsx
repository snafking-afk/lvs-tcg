import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/ProductGrid";
import type { CatalogProduct } from "@/components/ProductCard";

// Le stock évolue en permanence : on force le rendu dynamique pour
// que le catalogue reflète toujours l'état réel de la base.
export const dynamic = "force-dynamic";

async function getCatalogProducts(): Promise<CatalogProduct[]> {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isPreorder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      priceCents: true,
      stock: true,
      imageUrl: true,
      isPreorder: true,
      releaseDate: true,
    },
  });
}

const COMMITMENTS = [
  {
    icon: "✅",
    title: "100 % authentique",
    text: "Chaque produit est scellé d'origine et vérifié. Aucune contrefaçon, jamais.",
  },
  {
    icon: "📦",
    title: "Stock réel garanti",
    text: "Ce que vous voyez est en main. Pas de survente : votre commande est honorée.",
  },
  {
    icon: "🚚",
    title: "Expédition rapide & soignée",
    text: "Préparation sous 24–48 h, emballage protecteur adapté aux collectionneurs.",
  },
];

export default async function Home() {
  const products = await getCatalogProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1117] to-[#1a202c] px-8 py-16 text-white shadow-lg sm:px-12">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
          Cartes Pokémon scellées &amp; précommandes
        </h1>
        <p className="mt-4 max-w-xl text-base text-zinc-300 sm:text-lg">
          Displays, coffrets ETB et boosters au meilleur prix. Stock réel
          garanti, expédition rapide et soignée.
        </p>
        <a
          href="#catalogue"
          className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-transform hover:scale-[1.03]"
        >
          Découvrir le catalogue
        </a>
      </section>

      {/* Notre Engagement */}
      <section className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Notre engagement
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-500">
            Une boutique pensée pour les collectionneurs exigeants : qualité,
            authenticité et confiance avant tout.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {COMMITMENTS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl">
                {c.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-zinc-900">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalogue */}
      <div id="catalogue" className="scroll-mt-24">
        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
            Aucun produit pour le moment. Lance le seed avec{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5">
              npm run db:seed
            </code>
            .
          </p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
