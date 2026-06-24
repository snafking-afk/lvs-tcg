"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";

// ============================================================
//  Page panier. Côté client (lit le panier dans localStorage via
//  le contexte). Le bouton "Commander" sera branché sur Stripe
//  Checkout + réservation de stock en Brique 3 — partie B.
// ============================================================

const PREORDER_MAX = 99;

export default function CartPage() {
  const { items, hydrated, totalItems, subtotalCents, setQuantity, removeItem } =
    useCart();

  // Avant hydratation, on évite d'afficher "panier vide" à tort.
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-zinc-400 sm:px-6 lg:px-8">
        Chargement du panier…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <p className="text-4xl">🛒</p>
          <h1 className="mt-4 text-xl font-semibold text-zinc-900">
            Votre panier est vide
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Parcourez le catalogue pour ajouter des produits.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Votre panier{" "}
        <span className="text-base font-normal text-zinc-500">
          ({totalItems} article{totalItems > 1 ? "s" : ""})
        </span>
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Liste des articles */}
        <ul className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => {
            const max = item.isPreorder
              ? PREORDER_MAX
              : Math.max(0, item.maxStock);
            const lineTotal = item.priceCents * item.quantity;

            return (
              <li
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4"
              >
                {/* Visuel */}
                <Link
                  href={`/produit/${item.slug}`}
                  className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white"
                >
                  <ProductImage src={item.imageUrl} alt={item.name} />
                </Link>

                {/* Détails */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/produit/${item.slug}`}
                      className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-500"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="flex-shrink-0 text-xs text-zinc-400 transition-colors hover:text-zinc-700"
                    >
                      Retirer
                    </button>
                  </div>

                  {item.isPreorder && (
                    <span className="mt-1 w-fit rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Précommande
                    </span>
                  )}

                  <div className="mt-auto flex items-end justify-between pt-3">
                    {/* Sélecteur de quantité */}
                    <div className="inline-flex items-center rounded-xl border border-zinc-300">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="Diminuer la quantité"
                        className="px-3 py-1.5 text-base font-semibold text-zinc-600 transition-colors hover:bg-zinc-50"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm font-semibold text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= max}
                        aria-label="Augmenter la quantité"
                        className="px-3 py-1.5 text-base font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-zinc-900">
                        {formatPrice(lineTotal)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-zinc-400">
                          {formatPrice(item.priceCents)} / unité
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Récapitulatif */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Récapitulatif</h2>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Sous-total</dt>
                <dd className="font-semibold text-zinc-900">
                  {formatPrice(subtotalCents)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Livraison</dt>
                <dd className="text-zinc-400">Calculée à l'étape suivante</dd>
              </div>
            </dl>

            <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4">
              <span className="font-semibold text-zinc-900">Total</span>
              <span className="text-lg font-bold text-zinc-900">
                {formatPrice(subtotalCents)}
              </span>
            </div>

            <button
              type="button"
              disabled
              title="Le paiement sera disponible très bientôt"
              className="mt-6 w-full cursor-not-allowed rounded-xl bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-400"
            >
              Commander (bientôt)
            </button>
            <p className="mt-3 text-center text-xs text-zinc-400">
              Paiement sécurisé Stripe — disponible à la prochaine étape.
            </p>

            <Link
              href="/"
              className="mt-4 block text-center text-sm text-zinc-700 transition-colors hover:text-zinc-900"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
