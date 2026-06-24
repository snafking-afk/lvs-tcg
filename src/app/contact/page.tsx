import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — POKÉ LVS TCG",
  description: "Contactez l'équipe POKÉ LVS TCG pour toute question.",
};

// Page contact "simulée" pour la démo : le formulaire est désactivé
// (l'envoi réel sera branché ultérieurement).
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        Contact
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Une question ? Écrivez-nous, nous répondons sous 24 h ouvrées.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">✉️ E-mail</p>
          <p className="mt-1 text-sm text-zinc-500">support@lvstcg.demo</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">⏱️ Délai</p>
          <p className="mt-1 text-sm text-zinc-500">Réponse sous 24 h ouvrées</p>
        </div>
      </div>

      <form className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Votre e-mail
          </label>
          <input
            type="email"
            disabled
            placeholder="vous@exemple.com"
            className="mt-1 w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm placeholder:text-zinc-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Votre message
          </label>
          <textarea
            disabled
            rows={4}
            placeholder="Comment pouvons-nous vous aider ?"
            className="mt-1 w-full cursor-not-allowed resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm placeholder:text-zinc-400"
          />
        </div>
        <button
          type="button"
          disabled
          title="Formulaire de démonstration"
          className="w-full cursor-not-allowed rounded-xl bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-400"
        >
          Envoyer (démo)
        </button>
      </form>
    </div>
  );
}
