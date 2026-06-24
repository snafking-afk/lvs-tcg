import Link from "next/link";

import { ProductImage } from "./ProductImage";
import { AddToCartButton } from "./cart/AddToCartButton";
import { formatPrice, formatDate } from "@/lib/format";
import type { AddableItem } from "./cart/CartProvider";

// ============================================================
//  Carte produit du catalogue.
//  Logique du bouton (gérée par <AddToCartButton>) :
//   - isPreorder        -> "Précommander" + date de sortie
//   - stock > 0         -> "Ajouter au panier"
//   - stock 0 (vente)   -> "Rupture de stock" (désactivé)
//  Le visuel et le titre renvoient vers la fiche produit.
// ============================================================

const TYPE_LABELS: Record<string, string> = {
  DISPLAY: "Display",
  ETB: "Coffret ETB",
  BOOSTER: "Booster",
  COFFRET: "Coffret",
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  type: string;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
  isPreorder: boolean;
  releaseDate: Date | null;
};

export function ProductCard({ product }: { product: CatalogProduct }) {
  const isOutOfStock = !product.isPreorder && product.stock <= 0;
  const isLowStock =
    !product.isPreorder && product.stock > 0 && product.stock <= 5;

  // Snapshot transmis au panier. NB : maxStock = stock physique ici ;
  // la disponibilité réelle (− réservations) est recalculée sur la fiche
  // produit et revérifiée au checkout (Brique 3 — partie B).
  const cartItem: AddableItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    priceCents: product.priceCents,
    imageUrl: product.imageUrl,
    type: product.type,
    isPreorder: product.isPreorder,
    maxStock: product.stock,
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      {/* Visuel */}
      <Link
        href={`/produit/${product.slug}`}
        className="relative aspect-square w-full bg-white"
      >
        <ProductImage src={product.imageUrl} alt={product.name} />

        {/* Badge type */}
        <span className="absolute left-3 top-3 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {TYPE_LABELS[product.type] ?? product.type}
        </span>

        {/* Badge précommande / rupture */}
        {product.isPreorder && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
            Précommande
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-500 px-2.5 py-1 text-xs font-semibold text-white">
            Épuisé
          </span>
        )}
      </Link>

      {/* Infos */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="min-h-[2.5rem]">
          <Link
            href={`/produit/${product.slug}`}
            className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-500"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between">
          <p className="text-lg font-bold text-zinc-900">
            {formatPrice(product.priceCents)}
          </p>

          {/* Indicateur de disponibilité */}
          {product.isPreorder && product.releaseDate ? (
            <p className="text-right text-xs text-amber-600">
              Sortie le
              <br />
              <span className="font-semibold">
                {formatDate(product.releaseDate)}
              </span>
            </p>
          ) : isLowStock ? (
            <p className="text-xs font-medium text-orange-600">
              Plus que {product.stock} !
            </p>
          ) : !isOutOfStock ? (
            <p className="text-xs font-medium text-emerald-600">En stock</p>
          ) : null}
        </div>

        {/* Bouton d'action (Ajouter / Précommander / Rupture) */}
        <AddToCartButton item={cartItem} />
      </div>
    </article>
  );
}
