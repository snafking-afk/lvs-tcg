import { prisma } from "@/lib/prisma";

// ============================================================
//  Disponibilité réelle = stock physique − réservations PENDING.
//
//  Le stock physique (Product.stock) n'est décrémenté qu'au paiement
//  confirmé (webhook Stripe, Brique 4). Pendant le tunnel, des
//  StockReservation PENDING "bloquent" des unités sans toucher au
//  stock. La quantité réellement vendable est donc :
//        disponible = stock − Σ(quantité des réservations PENDING)
//
//  NB : tant que le checkout Stripe n'est pas branché (partie B),
//  il n'existe aucune réservation, donc disponible = stock.
// ============================================================

/**
 * Somme des quantités réservées (PENDING, non expirées) pour un produit.
 */
export async function getPendingReservedQuantity(
  productId: string,
): Promise<number> {
  const result = await prisma.stockReservation.aggregate({
    where: {
      productId,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}

/**
 * Stock réellement disponible à la vente pour un produit (jamais négatif).
 */
export async function getAvailableStock(
  productId: string,
  physicalStock: number,
): Promise<number> {
  const reserved = await getPendingReservedQuantity(productId);
  return Math.max(0, physicalStock - reserved);
}
