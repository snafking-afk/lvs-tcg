import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { getAvailableStock } from "@/lib/stock";
import { formatPrice, formatDate } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { AddToCartPanel } from "@/components/cart/AddToCartPanel";
import type { AddableItem } from "@/components/cart/CartProvider";

// Le stock évolue en permanence : rendu dynamique pour refléter l'état réel.
export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  DISPLAY: "Display",
  ETB: "Coffret ETB",
  BOOSTER: "Booster",
  COFFRET: "Coffret",
};

/** Récupère un produit actif par son slug (ou null s'il n'existe pas / inactif). */
async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      type: true,
      description: true,
      priceCents: true,
      stock: true,
      imageUrl: true,
      isPreorder: true,
      releaseDate: true,
    },
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Produit introuvable — POKÉ LVS TCG" };
  }

  return {
    title: `${product.name} — POKÉ LVS TCG`,
    description:
      product.description ??
      `${product.name} disponible sur POKÉ LVS TCG. Stock garanti, expédition soignée.`,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const available = await getAvailableStock(product.id, product.stock);
  const isOutOfStock = !product.isPreorder && available <= 0;
  const isLowStock = !product.isPreorder && available > 0 && available <= 5;

  // Snapshot transmis au panier (côté client).
  const cartItem: AddableItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    priceCents: product.priceCents,
    imageUrl: product.imageUrl,
    type: product.type,
    isPreorder: product.isPreorder,
    maxStock: available,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Fil d'Ariane */}
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-zinc-900">
          Boutique
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Visuel */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <ProductImage src={product.imageUrl} alt={product.name} />

          <span className="absolute left-4 top-4 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {TYPE_LABELS[product.type] ?? product.type}
          </span>
          {product.isPreorder && (
            <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
              Précommande
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute right-4 top-4 rounded-full bg-zinc-500 px-3 py-1 text-xs font-semibold text-white">
              Épuisé
            </span>
          )}
        </div>

        {/* Infos & achat */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">
            Réf. {product.sku}
          </p>

          <p className="mt-4 text-3xl font-bold text-zinc-900">
            {formatPrice(product.priceCents)}
          </p>

          {/* Disponibilité */}
          <div className="mt-3 text-sm">
            {product.isPreorder ? (
              <p className="text-amber-600">
                Précommande
                {product.releaseDate && (
                  <>
                    {" "}
                    — sortie le{" "}
                    <span className="font-semibold">
                      {formatDate(product.releaseDate)}
                    </span>
                  </>
                )}
              </p>
            ) : isOutOfStock ? (
              <p className="font-medium text-zinc-500">Indisponible pour le moment</p>
            ) : isLowStock ? (
              <p className="font-medium text-orange-600">
                Plus que {available} en stock !
              </p>
            ) : (
              <p className="font-medium text-emerald-600">En stock</p>
            )}
          </div>

          {product.description && (
            <p className="mt-5 text-sm leading-relaxed text-zinc-600">
              {product.description}
            </p>
          )}

          {/* Achat */}
          <div className="mt-8">
            <AddToCartPanel item={cartItem} />
          </div>

          {product.isPreorder && (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
              🔮 Article en précommande : il sera expédié à sa date de sortie.
              Le paiement est encaissé à la commande pour réserver votre
              exemplaire.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
