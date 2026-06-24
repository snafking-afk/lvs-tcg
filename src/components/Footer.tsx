import Link from "next/link";

// ============================================================
//  Pied de page professionnel : marque, navigation, réassurance
//  (livraison rapide) et mentions. Les liens FAQ/Contact pointent
//  vers des pages simulées.
// ============================================================

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-lg">
                🎴
              </span>
              <span className="font-sans text-lg tracking-tight text-zinc-900">
                <span className="font-semibold">POKÉ </span>
                <span className="font-bold">LVS</span>{" "}
                <span className="font-medium tracking-[0.25em] text-zinc-400">TCG</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Votre boutique de cartes à collectionner scellées et de
              précommandes. Produits authentiques, stock réel garanti.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Boutique</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-500">
              <li>
                <Link href="/" className="transition-colors hover:text-zinc-900">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:text-zinc-900"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-zinc-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Réassurance */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Livraison rapide
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-500">
              <li className="flex items-start gap-2">
                <span aria-hidden>🚚</span>
                Expédition sous 24–48 h
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden>📦</span>
                Emballage soigné &amp; protégé
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden>🔒</span>
                Paiement 100 % sécurisé
              </li>
            </ul>
          </div>

          {/* Engagement */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Notre engagement
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-500">
              <li className="flex items-start gap-2">
                <span aria-hidden>✅</span>
                Produits 100 % authentiques
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden>⭐</span>
                Vendeur de confiance
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden>💬</span>
                Service client réactif
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
          © 2026 POKÉ LVS TCG — Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
