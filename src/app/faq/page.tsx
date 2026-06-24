import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — POKÉ LVS TCG",
  description:
    "Questions fréquentes : authenticité, livraison, précommandes et paiement.",
};

const FAQ = [
  {
    q: "Vos produits sont-ils authentiques ?",
    a: "Oui, à 100 %. Tous nos articles sont scellés d'origine et vérifiés avant expédition. Nous ne vendons aucune contrefaçon.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "Les commandes en stock sont préparées sous 24 à 48 h et expédiées dans un emballage protecteur adapté aux collectionneurs.",
  },
  {
    q: "Comment fonctionnent les précommandes ?",
    a: "Le paiement est encaissé à la commande pour réserver votre exemplaire. L'article est expédié dès sa date de sortie officielle.",
  },
  {
    q: "Le paiement est-il sécurisé ?",
    a: "Oui. Le paiement sera traité via une plateforme sécurisée (Stripe). Vos données bancaires ne transitent jamais par nos serveurs.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        Questions fréquentes
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Tout ce qu'il faut savoir avant de commander.
      </p>

      <dl className="mt-10 space-y-6">
        {FAQ.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <dt className="text-base font-semibold text-zinc-900">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-zinc-600">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
