import Link from "next/link";

// Page 404 globale (déclenchée notamment par notFound() sur une fiche
// produit dont le slug n'existe pas ou qui est inactive).
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-5xl">🃏</p>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
        Page introuvable
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Le produit ou la page que vous cherchez n&apos;existe pas (ou plus).
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}
