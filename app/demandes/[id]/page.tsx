// app/demandes/[id]/page.tsx
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import OffreForm from "@/components/OffreForm";
import OffreCard from "@/components/OffreCard";
import {
  Clock, MapPin, Calendar, Users, FileText, CheckCircle, Zap, Share2
} from "lucide-react";

const CATEGORIE_LABELS: Record<string, { label: string; icon: string }> = {
  RENDU_3D: { label: "Rendu 3D & Visualisation", icon: "🏗️" },
  PLANCHES: { label: "Planches & Affichage", icon: "📐" },
  MAQUETTE_BIM: { label: "Maquette & BIM", icon: "🧊" },
  MEMOIRE: { label: "Saisie Mémoire", icon: "📄" },
  PORTFOLIO: { label: "Portfolio & CV", icon: "🎨" },
  IMPRESSION: { label: "Impression & Reliure", icon: "🖨️" },
  AUTRE: { label: "Autre", icon: "📦" },
};

const STATUT_CONFIG: Record<string, { label: string; color: string }> = {
  OUVERTE: { label: "Ouverte", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  EN_COURS: { label: "En cours", color: "bg-gold-pale text-gold border-gold/30" },
  TERMINEE: { label: "Terminée", color: "bg-gray-100 text-gray-500 border-gray-200" },
  ANNULEE: { label: "Annulée", color: "bg-rust/10 text-rust border-rust/20" },
};

export default async function DemandePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const demande = await prisma.demande.findUnique({
    where: { id: params.id },
    include: {
      client: {
        select: {
          id: true, name: true, avatar: true, wilaya: true, createdAt: true,
          _count: { select: { demandesAsClient: true } },
        },
      },
      offres: {
        include: {
          freelance: {
            select: {
              id: true, name: true, avatar: true, wilaya: true,
              freelanceProfile: {
                select: {
                  titre: true, noteGlobale: true, totalProjets: true,
                  totalAvis: true, specialites: true, logiciels: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { offres: true } },
    },
  });

  if (!demande) notFound();

  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;
  const isClient = userId === demande.clientId;
  const isFreelance = role === "FREELANCE";
  const dejaOffert = isFreelance
    ? demande.offres.some((o) => o.freelanceId === userId)
    : false;

  const joursRestants = Math.ceil(
    (new Date(demande.deadline).getTime() - Date.now()) / 86400000
  );
  const cat = CATEGORIE_LABELS[demande.categorie] || { label: demande.categorie, icon: "📦" };
  const statut = STATUT_CONFIG[demande.statut] || { label: demande.statut, color: "" };

  return (
    <>
      <Navbar />

      {/* Hero band */}
      <div className="pt-[72px] bg-[var(--ink)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-rust/5 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(184,146,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,146,42,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/40 font-syne mb-6">
            <a href="/demandes" className="hover:text-white/70 transition-colors">Demandes</a>
            <span>/</span>
            <span className="text-white/60">{cat.icon} {cat.label}</span>
          </div>

          <div className="flex flex-wrap items-start gap-3 mb-5">
            <span className="badge text-[10px] bg-white/10 text-white/70 border border-white/20">
              {cat.icon} {cat.label}
            </span>
            <span className={`badge text-[10px] border ${statut.color}`}>
              {statut.label}
            </span>
            {demande.urgent && (
              <span className="badge text-[10px] bg-rust text-white border-0">
                🚨 Urgent
              </span>
            )}
          </div>

          <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-white leading-tight mb-6 max-w-3xl">
            {demande.titre}
          </h1>

          <div className="flex flex-wrap gap-5 text-sm text-white/50">
            {demande.wilaya && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gold" /> {demande.wilaya}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gold" />
              {new Date(demande.deadline).toLocaleDateString("fr-DZ", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className={`flex items-center gap-1.5 ${joursRestants <= 3 ? "text-rust" : ""}`}>
              <Clock size={14} className={joursRestants <= 3 ? "text-rust" : "text-gold"} />
              {joursRestants > 0 ? `${joursRestants} jours restants` : "Délai dépassé"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-gold" />
              {demande._count.offres} offre{demande._count.offres > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <div className="card p-8">
              <h2 className="font-syne font-bold text-xl text-[var(--ink)] mb-5 flex items-center gap-2">
                <FileText size={18} className="text-gold" /> Description du projet
              </h2>
              <p className="text-[var(--ink2)] leading-relaxed text-base whitespace-pre-wrap">
                {demande.description}
              </p>

              {demande.fichiers && demande.fichiers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <p className="label mb-3">Fichiers joints</p>
                  <div className="flex flex-wrap gap-2">
                    {demande.fichiers.map((f, i) => (
                      <a key={i} href={f} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg2)] border border-[var(--border)]
                          rounded-sm text-xs text-[var(--ink2)] hover:border-gold hover:text-gold transition-all">
                        <FileText size={11} /> Fichier {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Offres reçues — client seulement */}
            {isClient && demande.offres.length > 0 && (
              <div>
                <h2 className="font-syne font-bold text-xl text-[var(--ink)] mb-5 flex items-center gap-2">
                  <Users size={18} className="text-gold" />
                  Offres reçues
                  <span className="ml-1 w-6 h-6 bg-gold text-white text-xs rounded-full font-bold flex items-center justify-center">
                    {demande.offres.length}
                  </span>
                </h2>
                <div className="space-y-4">
                  {demande.offres.map((offre) => (
                    <OffreCard
                      key={offre.id}
                      offre={offre as any}
                      isClient={isClient}
                      demandeOuverte={demande.statut === "OUVERTE"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Attente offres */}
            {isClient && demande.offres.length === 0 && demande.statut === "OUVERTE" && (
              <div className="card p-10 text-center">
                <div className="w-14 h-14 bg-gold-pale rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-gold" size={22} />
                </div>
                <p className="font-syne font-bold text-[var(--ink)] mb-1">En attente d'offres</p>
                <p className="text-sm text-[var(--muted)]">
                  Les freelances consultent ta demande. Tu recevras des offres dans les prochaines heures !
                </p>
              </div>
            )}

            {/* Formulaire offre — freelance */}
            {isFreelance && demande.statut === "OUVERTE" && (
              <div id="offre-form">
                {dejaOffert ? (
                  <div className="card p-6 flex items-start gap-3 bg-emerald-50 border-emerald-200">
                    <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-syne font-bold text-emerald-800">Offre déjà soumise ✓</p>
                      <p className="text-sm text-emerald-700 mt-0.5">
                        Le client va consulter ton offre et te contacter s'il est intéressé.
                      </p>
                    </div>
                  </div>
                ) : (
                  <OffreForm demandeId={demande.id} budgetClient={demande.budget} />
                )}
              </div>
            )}

            {/* CTA visiteurs */}
            {!session && demande.statut === "OUVERTE" && (
              <div className="card p-10 text-center border-dashed border-2 border-[var(--border)]">
                <p className="font-syne font-extrabold text-2xl text-[var(--ink)] mb-2">
                  Tu es freelance ? 🎯
                </p>
                <p className="text-[var(--muted)] mb-6 text-sm max-w-sm mx-auto">
                  Inscris-toi ou connecte-toi pour soumettre ton offre et décrocher ce projet.
                </p>
                <div className="flex gap-3 justify-center">
                  <a href="/register?role=FREELANCE" className="btn-primary inline-block">
                    Créer un compte →
                  </a>
                  <a href={`/login?callbackUrl=/demandes/${demande.id}`} className="btn-secondary inline-block">
                    Se connecter
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Sidebar */}
          <div className="space-y-5">

            {/* Budget */}
            <div className="card p-6 sticky top-24">
              <div className="text-center pb-5 border-b border-[var(--border)]">
                <p className="label mb-1">Budget client</p>
                <p className="font-syne font-extrabold text-4xl text-gold leading-none">
                  {demande.budget.toLocaleString("fr-DZ")}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1 font-syne font-semibold">Dinars algériens</p>
                {demande.urgent && (
                  <p className="text-xs text-rust font-syne font-bold mt-2 flex items-center justify-center gap-1">
                    <Zap size={11} /> Projet urgent
                  </p>
                )}
              </div>

              <div className="py-5 space-y-3 border-b border-[var(--border)]">
                <InfoRow label="Catégorie" value={`${cat.icon} ${cat.label}`} />
                <InfoRow
                  label="Délai"
                  value={joursRestants > 0 ? `${joursRestants} jours` : "Expiré"}
                  urgent={joursRestants <= 3 && joursRestants > 0}
                />
                <InfoRow label="Offres" value={`${demande._count.offres} reçue${demande._count.offres > 1 ? "s" : ""}`} />
                <InfoRow label="Wilaya" value={demande.wilaya || "Toutes wilayas"} />
                <InfoRow
                  label="Publié le"
                  value={new Date(demande.createdAt).toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}
                />
              </div>

              {isFreelance && !dejaOffert && demande.statut === "OUVERTE" && (
                <div className="pt-5">
                  <a href="#offre-form" className="btn-primary w-full text-center block">
                    Soumettre une offre →
                  </a>
                  <p className="text-xs text-center text-[var(--muted)] mt-2">
                    12% de commission ArchiDZ
                  </p>
                </div>
              )}

              {isClient && demande.statut === "OUVERTE" && (
                <div className="pt-5">
                  <a
                    href={`/dashboard/demandes/${demande.id}/edit`}
                    className="btn-secondary w-full text-center block text-xs"
                  >
                    Modifier ma demande
                  </a>
                </div>
              )}
            </div>

            {/* Client card */}
            <div className="card p-5">
              <p className="label mb-3">Publié par</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gold-pale flex items-center justify-center flex-shrink-0 ring-2 ring-gold/20">
                  <span className="font-syne font-extrabold text-gold text-base">
                    {demande.client.name[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-syne font-bold text-sm text-[var(--ink)]">{demande.client.name}</p>
                  {demande.client.wilaya && (
                    <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {demande.client.wilaya}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="font-syne font-extrabold text-xl text-[var(--ink)]">
                    {(demande.client as any)._count?.demandesAsClient ?? 0}
                  </p>
                  <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-syne">Demandes</p>
                </div>
                <div>
                  <p className="font-syne font-extrabold text-xl text-[var(--ink)]">
                    {new Date(demande.client.createdAt).getFullYear()}
                  </p>
                  <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-syne">Depuis</p>
                </div>
              </div>
            </div>

            {/* Share */}
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[var(--border)]
                rounded-sm text-sm text-[var(--muted)] hover:border-gold hover:text-gold transition-all duration-200 font-syne font-semibold"
            >
              <Share2 size={14} /> Partager cette demande
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value, urgent }: { label: string; value: string; urgent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--muted)] font-syne uppercase tracking-wider">{label}</span>
      <span className={`text-xs font-syne font-bold ${urgent ? "text-rust" : "text-[var(--ink)]"}`}>{value}</span>
    </div>
  );
}
