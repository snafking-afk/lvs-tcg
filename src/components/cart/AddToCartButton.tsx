"use client";

import { useEffect, useRef, useState } from "react";
import { useCart, type AddableItem } from "./CartProvider";

// ============================================================
//  Bouton d'ajout au panier — réutilisé sur la carte catalogue
//  ET sur la fiche produit. Gère un petit feedback "Ajouté ✓".
//
//  Variantes d'apparence :
//   - "preorder" : précommande (ambre)
//   - "default"  : vente normale (neutre, zinc)
//  Si maxStock <= 0 (et hors précommande), le bouton est désactivé.
// ============================================================

type AddToCartButtonProps = {
  item: AddableItem;
  /** Quantité ajoutée par clic (1 sur le catalogue, choisie sur la fiche). */
  quantity?: number;
  /** Apparence pleine largeur (catalogue/fiche) ou compacte. */
  className?: string;
};

export function AddToCartButton({
  item,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isOutOfStock = !item.isPreorder && item.maxStock <= 0;

  function handleClick() {
    if (isOutOfStock) return;
    addItem(item, quantity);
    setJustAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1500);
  }

  if (isOutOfStock) {
    return (
      <button
        type="button"
        disabled
        className={
          className ??
          "w-full cursor-not-allowed rounded-xl bg-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-400"
        }
      >
        Rupture de stock
      </button>
    );
  }

  const baseColor = item.isPreorder
    ? "bg-amber-500 hover:bg-amber-600"
    : "bg-zinc-900 hover:bg-zinc-800";

  const label = item.isPreorder ? "Précommander" : "Ajouter au panier";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={
        className ??
        `w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
          justAdded ? "bg-emerald-600 hover:bg-emerald-700" : baseColor
        }`
      }
    >
      {justAdded ? "Ajouté ✓" : label}
    </button>
  );
}
