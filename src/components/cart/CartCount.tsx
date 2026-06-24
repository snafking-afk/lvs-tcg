"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

// ============================================================
//  Lien "Panier" du header avec pastille de quantité.
//  Tant que le panier n'est pas hydraté (relu depuis localStorage),
//  on n'affiche pas la pastille pour éviter un flash 0 -> N.
// ============================================================

export function CartCount() {
  const { totalItems, hydrated } = useCart();
  const showBadge = hydrated && totalItems > 0;

  return (
    <Link
      href="/panier"
      className="relative flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 transition-colors hover:bg-zinc-50"
    >
      <span>🛒</span>
      <span>Panier</span>
      {showBadge && (
        <span className="ml-0.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-zinc-900 px-1.5 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
