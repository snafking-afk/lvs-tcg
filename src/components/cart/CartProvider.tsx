"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ============================================================
//  PANIER (guest) — état global côté client + persistance.
//
//  Le panier vit dans le navigateur (React Context + localStorage)
//  car il n'y a pas de compte obligatoire (guest checkout).
//  La VRAIE validation du stock et des prix se fera côté serveur
//  au moment du checkout (Brique 3 — partie B / Stripe) : ici on
//  ne fait que de l'affichage et de la gestion de quantités.
// ============================================================

const STORAGE_KEY = "lvs-tcg-cart-v1";

/** Plafond de quantité pour un article en précommande (pas de stock connu). */
const PREORDER_MAX = 99;

/**
 * Données figées d'un produit ajouté au panier. On stocke un "snapshot"
 * (nom, prix, image...) pour l'affichage instantané ; ces valeurs seront
 * revérifiées en base au checkout.
 */
export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  type: string;
  isPreorder: boolean;
  /** Stock disponible au moment de l'ajout (indicatif, recontrôlé au checkout). */
  maxStock: number;
  quantity: number;
};

/** Article ajoutable : un CartItem sans la quantité (gérée par le panier). */
export type AddableItem = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  /** true une fois le panier relu depuis localStorage (évite le flash SSR). */
  hydrated: boolean;
  totalItems: number;
  subtotalCents: number;
  addItem: (item: AddableItem, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Quantité maximale autorisée pour un article donné. */
function maxQuantityFor(item: Pick<CartItem, "isPreorder" | "maxStock">): number {
  return item.isPreorder ? PREORDER_MAX : Math.max(0, item.maxStock);
}

/** Relit le panier depuis localStorage en filtrant les entrées invalides. */
function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (it): it is CartItem =>
        !!it &&
        typeof it === "object" &&
        typeof (it as CartItem).productId === "string" &&
        typeof (it as CartItem).quantity === "number" &&
        (it as CartItem).quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydratation : on relit le panier APRÈS le premier rendu pour que
  // le HTML serveur (panier vide) et le premier rendu client coïncident.
  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  // Persistance : on n'écrit qu'une fois hydraté, sinon on écraserait
  // le panier sauvegardé avec le tableau vide initial.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage indisponible (mode privé, quota...) : on ignore.
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: AddableItem, quantity = 1) => {
    setItems((prev) => {
      const max = maxQuantityFor(item);
      if (max <= 0) return prev; // rien à ajouter (rupture)

      const existing = prev.find((it) => it.productId === item.productId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, max);
        return prev.map((it) =>
          it.productId === item.productId
            ? { ...it, ...item, quantity: nextQty }
            : it,
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, max) }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((it) => it.productId !== productId);
      }
      return prev.map((it) =>
        it.productId === productId
          ? { ...it, quantity: Math.min(quantity, maxQuantityFor(it)) }
          : it,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items],
  );

  const subtotalCents = useMemo(
    () => items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      totalItems,
      subtotalCents,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [
      items,
      hydrated,
      totalItems,
      subtotalCents,
      addItem,
      setQuantity,
      removeItem,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook d'accès au panier. À utiliser dans un Client Component. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>.");
  }
  return ctx;
}
