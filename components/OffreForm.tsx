"use client";
// components/OffreForm.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, AlertCircle, Info, CheckCircle } from "lucide-react";

interface Props {
  demandeId: string;
  budgetClient: number;
}

const DELAI_OPTIONS = [1, 2, 3, 5, 7, 10, 14, 21, 30];

export default function OffreForm({ demandeId, budgetClient }: Props) {
  const router = useRouter();
  const [prix, setPrix] = useState("");
  const [delai, setDelai] = useState(7);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const prixNum = parseInt(prix) || 0;
  const commission = prixNum ? Math.round(prixNum * 0.12) : 0;
  const gain = prixNum - commission;
  const aboveBudget = prixNum > budgetClient && prixNum > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/demandes/${demandeId}/offres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prix: prixNum, delai, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card p-10 text-center bg-emerald-50 border-emerald-200">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <p className="font-syne font-extrabold text-xl text-emerald-800 mb-2">Offre envoyée ! 🎉</p>
        <p className="text-sm text-emerald-700 max-w-xs mx-auto">
          Le client va consulter ton offre. Tu recevras une notification s'il l'accepte.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Header accent */}
      <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-rust" />

      <div className="p-8">
        <div className="flex items-start justify-between mb-7">
          <div>
            <h2 className="font-syne font-bold text-xl text-[var(--ink)]">Soumettre une offre</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Propose ton prix et convaincs le client</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[var(--muted)] font-syne uppercase tracking-wider">Budget client</p>
            <p className="font-syne font-extrabold text-2xl text-gold leading-tight">
              {budgetClient.toLocaleString("fr-DZ")} DA
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Prix */}
          <div>
            <label className="label">Ton prix (DA) *</label>
            <div className="relative">
              <input
                type="number"
                className="input pr-16 text-lg font-syne font-bold"
                placeholder="5 000"
                min={500}
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] font-syne font-bold">DA</span>
            </div>

            {/* Calcul gain en temps réel */}
            {prixNum > 0 && (
              <div className={`mt-2 p-3 rounded-sm border text-xs font-syne space-y-1.5
                ${aboveBudget ? "bg-rust/5 border-rust/20" : "bg-gold-pale border-gold/30"}`}>
                {aboveBudget && (
                  <p className="text-rust font-bold flex items-center gap-1 mb-2">
                    <AlertCircle size={11} />
                    Au-dessus du budget ({budgetClient.toLocaleString("fr-DZ")} DA) — le client doit accepter
                  </p>
                )}
                <div className="flex justify-between text-[var(--ink2)]">
                  <span>Ton prix</span>
                  <span>{prixNum.toLocaleString("fr-DZ")} DA</span>
                </div>
                <div className="flex justify-between text-[var(--ink2)]">
                  <span>Commission ArchiDZ (12%)</span>
                  <span className="text-rust">− {commission.toLocaleString("fr-DZ")} DA</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-1.5">
                  <span className="font-bold text-[var(--ink)]">Tu recevras</span>
                  <span className="font-extrabold text-gold text-sm">{gain.toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>
            )}
          </div>

          {/* Délai */}
          <div>
            <label className="label">Délai de livraison *</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {DELAI_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDelai(d)}
                  className={`px-3 py-2 rounded-sm border text-xs font-syne font-bold transition-all duration-200
                    ${delai === d
                      ? "bg-gold text-white border-gold shadow-gold"
                      : "bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-gold hover:text-gold"
                    }`}
                >
                  {d === 1 ? "1 jour" : `${d}j`}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="label">Ton message au client *</label>
            <textarea
              className="input resize-none h-40"
              placeholder={"Bonjour,\n\nJ'ai bien lu ta demande et je suis qualifié pour ce projet. Avec mon expérience sur [logiciel/projet similaire], je peux garantir un résultat de qualité dans les délais.\n\nN'hésite pas à me contacter !"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              minLength={30}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-[var(--muted)]">Minimum 30 caractères</p>
              <p className={`text-xs font-syne font-bold ${message.length >= 30 ? "text-emerald-600" : "text-[var(--muted)]"}`}>
                {message.length} car.
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 p-3.5 bg-[var(--bg2)] border border-[var(--border)] rounded-sm">
            <Info size={14} className="text-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--ink)]">💡 Conseil :</strong> Les offres qui mentionnent des projets similaires réalisés,
              les logiciels maîtrisés, et un lien vers ton portfolio ont 3× plus de chances d'être acceptées.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rust/10 border border-rust/20 rounded-sm">
              <AlertCircle size={14} className="text-rust flex-shrink-0" />
              <p className="text-sm text-rust">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || prixNum < 500 || message.length < 30}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send size={15} />
                Envoyer mon offre
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
