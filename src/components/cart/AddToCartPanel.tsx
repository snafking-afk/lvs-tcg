"use client";

import { useEffect, useRef, useState } from "react";
import { useCart, type AddableItem } from "./CartProvider";

// ============================================================
//  Panneau d'achat de la FICHE produit : sélecteur de quantité
//  (− / +) + bouton d'ajout au panier avec feedback "Ajouté ✓".
//  Le pas de quantité est borné par le stock disponible (hors
//  précommande, plafonnée à 99).
// ============================================================

const PREORDER_MAX = 99;

export function AddToCartPanel({ item }: { item: AddableItem }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const max = item.isPreorder ? PREORDER_MAX : Math.max(0, item.maxStock);
  const isOutOfStock = max <= 0;

  function changeBy(delta: number) {
    setQuantity((q) => Math.min(Math.max(1, q + delta), max));
  }

  function handleAdd() {
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
        className="w-full cursor-not-allowed rounded-xl bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-400"
      >
        Rupture de stock
      </button>
    );
  }

  const addColor = item.isPreorder
    ? "bg-amber-500 hover:bg-amber-600"
    : "bg-zinc-900 hover:bg-zinc-800";
  const addLabel = item.isPreorder ? "Précommander" : "Ajouter au panier";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Sélecteur de quantité */}
      <div className="inline-flex items-center rounded-xl border border-zinc-300">
        <button
          type="button"
          onClick={() => changeBy(-1)}
          disabled={quantity <= 1}
          aria-label="Diminuer la quantité"
          className="px-3.5 py-2.5 text-lg font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
        >
          −
        </button>
        <span
          className="min-w-[2.5rem] text-center text-sm font-semibold text-zinc-900"
          aria-live="polite"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => changeBy(1)}
          disabled={quantity >= max}
          aria-label="Augmenter la quantité"
          className="px-3.5 py-2.5 text-lg font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-300"
        >
          +
        </button>
      </div>

      {/* Bouton d'ajout */}
      <button
        type="button"
        onClick={handleAdd}
        aria-live="polite"
        className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors ${
          justAdded ? "bg-emerald-600 hover:bg-emerald-700" : addColor
        }`}
      >
        {justAdded ? "Ajouté au panier ✓" : addLabel}
      </button>
    </div>
  );
}
