"use client";

import { useMemo, useState } from "react";
import { ProductCard, type CatalogProduct } from "@/components/ProductCard";

// ============================================================
//  Grille du catalogue avec barre de recherche (filtrage instantané
//  par nom, insensible à la casse et aux accents). Client Component
//  car le filtre est réactif à la frappe. Les produits sont chargés
//  côté serveur puis passés en props (le panier n'est pas impacté).
// ============================================================

/** Normalise une chaîne pour comparaison : minuscules, sans accents. */
function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return products;
    return products.filter((p) => normalize(p.name).includes(q));
  }, [products, query]);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">Notre catalogue</h2>

        {/* Barre de recherche */}
        <div className="relative w-full sm:max-w-xs">
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            aria-hidden
          >
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit…"
            aria-label="Rechercher un produit par nom"
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
          Aucun produit ne correspond à «&nbsp;
          <span className="font-medium text-zinc-700">{query}</span>&nbsp;».
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-zinc-500">
            {filtered.length} produit{filtered.length > 1 ? "s" : ""}
            {query && ` sur ${products.length}`}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
