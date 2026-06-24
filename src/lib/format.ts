// ============================================================
//  Helpers de formatage (prix en centimes, dates)
// ============================================================

/**
 * Formate un montant en CENTIMES vers une chaîne en dollars : 14999 -> "149.99 $".
 * Format : séparateur décimal point, symbole "$" en suffixe (ex: "1,234.56 $").
 */
export function formatPrice(cents: number, currencySymbol = "$"): string {
  const amount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
  return `${amount} ${currencySymbol}`;
}

/** Formate une date en français long : "15 août 2025". */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
