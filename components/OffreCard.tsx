"use client";
// components/OffreCard.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin, Clock, Briefcase, ChevronDown, ChevronUp, AlertCircle, ExternalLink } from "lucide-react";

interface Offre {
  id: string;
  prix: number;
  delai: number;
  message: string;
  statut: string;
  createdAt: string;
  freelance: {
    id: string;
    name: string;
    avatar?: string;
    wilaya?: string;
    freelanceProfile?: {
      titre?: string;
      noteGlobale: number;
      totalProjets: number;
      totalAvis: number;
      specialites: string[];
      logiciels: string[];
    };
  };
}

interface Props {
  offre: Offre;
  isClient: boolean;
  demandeOuverte: boolean;
}

const STATUT_OFFRE: Record<string, { label: string; color: string }> = {
  EN_ATTENTE: { label: "En attente", color: "bg-gold-pale text-gold" },
  ACCEPTEE: { label: "✓ Acceptée", color: "bg-emerald-50 text-emerald-700" },
  REFUSEE: { label: "Refusée", color: "bg-rust/10 text-rust" },
  ANNULEE: { label: "Annulée", color: "bg-gray-100 text-gray-500" },
};

export default function OffreCard({ offre, isClient, demandeOuverte }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const profile = offre.freelance.freelanceProfile;
  const statut = STATUT_OFFRE[offre.statut] || { label: offre.statut, color: "" };

  const handleAccepter = async () => {
    if (!confirm(`Accepter l'offre de ${offre.prix.toLocaleString("fr-DZ")} DA de ${offre.freelance.name} ?`)) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/offres/${offre.id}/accepter`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Redirect to Chargily payment
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAccepted = offre.statut === "ACCEPTEE";

  return (
    <div className={`card transition-all duration-300
      ${isAccepted ? "border-emerald-300 bg-emerald-50/30" : "hover:shadow-card-hover"}`}>

      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gold-pale flex items-center justify-center flex-shrink-0 ring-2 ring-gold/20">
            <span className="font-syne font-extrabold text-gold text-lg">
              {offre.freelance.name[0].toUpperCase()}
            </span>
          </div>

          {/* Info freelance */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-syne font-bold text-[var(--ink)]">{offre.freelance.name}</p>
                {profile?.titre && (
                  <p className="text-xs text-[var(--muted)] mt-0.5">{profile.titre}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {offre.freelance.wilaya && (
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                      <MapPin size={10} /> {offre.freelance.wilaya}
                    </span>
                  )}
                  {profile && profile.noteGlobale > 0 && (
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                      <Star size={10} className="text-gold fill-gold" />
                      {profile.noteGlobale.toFixed(1)}
                      <span className="text-[var(--muted)]">({profile.totalAvis})</span>
                    </span>
                  )}
                  {profile && (
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                      <Briefcase size={10} /> {profile.totalProjets} projets
                    </span>
                  )}
                </div>
              </div>

              {/* Statut badge */}
              <span className={`badge text-[10px] flex-shrink-0 ${statut.color}`}>
                {statut.label}
              </span>
            </div>
          </div>
        </div>

        {/* Prix + délai */}
        <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[var(--border)]">
          <div>
            <p className="text-[10px] text-[var(--muted)] font-syne uppercase tracking-wider">Prix proposé</p>
            <p className="font-syne font-extrabold text-xl text-gold">
              {offre.prix.toLocaleString("fr-DZ")} DA
            </p>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div>
            <p className="text-[10px] text-[var(--muted)] font-syne uppercase tracking-wider">Délai</p>
            <p className="font-syne font-bold text-[var(--ink)] flex items-center gap-1">
              <Clock size={13} className="text-gold" />
              {offre.delai === 1 ? "1 jour" : `${offre.delai} jours`}
            </p>
          </div>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div>
            <p className="text-[10px] text-[var(--muted)] font-syne uppercase tracking-wider">Reçu le</p>
            <p className="font-syne font-bold text-xs text-[var(--ink)]">
              {new Date(offre.createdAt).toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}
            </p>
          </div>
        </div>

        {/* Message preview + expand */}
        <div className="mt-4">
          <p className={`text-sm text-[var(--ink2)] leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            {offre.message}
          </p>
          {offre.message.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-gold hover:text-gold-light mt-1 font-syne font-semibold transition-colors"
            >
              {expanded ? <><ChevronUp size={12} /> Réduire</> : <><ChevronDown size={12} /> Lire plus</>}
            </button>
          )}
        </div>

        {/* Logiciels/spécialités */}
        {expanded && profile && (profile.logiciels.length > 0 || profile.specialites.length > 0) && (
          <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
            {profile.specialites.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {profile.specialites.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-gold-pale text-gold text-[10px] font-syne font-bold rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {profile.logiciels.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {profile.logiciels.map((l) => (
                  <span key={l} className="px-2 py-0.5 bg-[var(--bg2)] text-[var(--muted)] text-[10px] font-syne font-bold rounded-full border border-[var(--border)]">
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions client */}
        {isClient && demandeOuverte && offre.statut === "EN_ATTENTE" && (
          <div className="mt-5 pt-4 border-t border-[var(--border)]">
            {error && (
              <div className="flex items-center gap-2 p-2.5 bg-rust/10 border border-rust/20 rounded-sm mb-3">
                <AlertCircle size={13} className="text-rust flex-shrink-0" />
                <p className="text-xs text-rust">{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <a
                href={`/freelances/${offre.freelance.id}`}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5 flex-1 justify-center"
              >
                <ExternalLink size={12} /> Voir le profil
              </a>
              <button
                onClick={handleAccepter}
                disabled={loading}
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 flex-1 justify-center disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "✓ Accepter cette offre"}
              </button>
            </div>
            <p className="text-[10px] text-center text-[var(--muted)] mt-2">
              Tu seras redirigé vers le paiement sécurisé Chargily Pay
            </p>
          </div>
        )}

        {isAccepted && (
          <div className="mt-4 pt-4 border-t border-emerald-200">
            <p className="text-xs text-emerald-700 font-syne font-bold text-center">
              ✓ Offre acceptée — projet en cours
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
