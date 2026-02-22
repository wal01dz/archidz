// app/dashboard/projets/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import ChatProjet from "@/components/ChatProjet";
import LivrableSection from "@/components/LivrableSection";
import Link from "next/link";
import {
  ArrowLeft, Clock, CheckCircle, AlertTriangle,
  CreditCard, Star, FileText
} from "lucide-react";

export default async function ProjetPage({ params, searchParams }: {
  params: { id: string };
  searchParams: { paiement?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = (session.user as any).id;

  const projet = await prisma.projet.findUnique({
    where: { id: params.id },
    include: {
      demande: {
        include: { client: { select: { id: true, name: true, avatar: true } } }
      },
      offre: {
        include: { freelance: { select: { id: true, name: true, avatar: true } } }
      },
      paiement: true,
      avis: true,
    },
  });

  if (!projet) notFound();

  const isClient = userId === projet.demande.clientId;
  const isFreelance = userId === projet.offre.freelanceId;
  if (!isClient && !isFreelance) redirect("/dashboard");

  const otherUser = isClient ? projet.offre.freelance : projet.demande.client;

  const statutConfig: Record<string, { label: string; color: string; icon: any; desc: string }> = {
    EN_COURS: {
      label: "En cours", color: "bg-gold-pale text-gold border-gold/30",
      icon: Clock, desc: "Le freelance travaille sur ton projet."
    },
    LIVRAISON_EN_ATTENTE: {
      label: "Livraison reçue", color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: FileText, desc: "Le freelance a livré le travail. Vérifie et valide !"
    },
    VALIDE: {
      label: "Validé ✓", color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle, desc: "Projet terminé avec succès. Paiement libéré."
    },
    LITIGE: {
      label: "Litige", color: "bg-rust/10 text-rust border-rust/20",
      icon: AlertTriangle, desc: "Un litige est en cours. L'équipe ArchiDZ intervient."
    },
    ANNULE: {
      label: "Annulé", color: "bg-gray-100 text-gray-500 border-gray-200",
      icon: AlertTriangle, desc: "Ce projet a été annulé."
    },
  };

  const statut = statutConfig[projet.statut] || statutConfig.EN_COURS;
  const StatutIcon = statut.icon;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <Link href="/dashboard/projets" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-gold transition-colors mb-4">
          <ArrowLeft size={14} /> Mes projets
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-syne font-extrabold text-2xl text-[var(--ink)] leading-tight">
              {projet.demande.titre}
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Projet #{projet.id.slice(-8).toUpperCase()} ·
              Démarré le {new Date(projet.createdAt).toLocaleDateString("fr-DZ", { day: "numeric", month: "long" })}
            </p>
          </div>

          <span className={`flex items-center gap-2 text-xs font-syne font-bold px-4 py-2 rounded-full border uppercase tracking-wider ${statut.color}`}>
            <StatutIcon size={13} />
            {statut.label}
          </span>
        </div>
      </div>

      {/* Banner paiement */}
      {searchParams.paiement === "success" && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="font-syne font-bold text-green-800">Paiement sécurisé avec succès !</p>
            <p className="text-sm text-green-700">L'argent est bloqué jusqu'à ta validation du livrable.</p>
          </div>
        </div>
      )}

      {searchParams.paiement === "failed" && (
        <div className="flex items-center gap-3 p-4 bg-rust/10 border border-rust/20 rounded-lg">
          <AlertTriangle size={20} className="text-rust flex-shrink-0" />
          <div>
            <p className="font-syne font-bold text-rust">Paiement échoué</p>
            <p className="text-sm text-rust/80">Une erreur s'est produite. Réessaie depuis les détails de l'offre.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Colonne principale ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Statut & progression */}
          <div className="card p-6">
            <div className={`flex items-start gap-3 p-4 rounded-lg border ${statut.color}`}>
              <StatutIcon size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-syne font-bold">{statut.label}</p>
                <p className="text-sm mt-0.5 opacity-80">{statut.desc}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-5 flex items-center gap-0">
              {[
                { label: "Offre acceptée", done: true },
                { label: "Paiement sécurisé", done: !!projet.paiement && projet.paiement.statut !== "EN_ATTENTE" },
                { label: "Livraison", done: ["LIVRAISON_EN_ATTENTE", "VALIDE"].includes(projet.statut) },
                { label: "Validé", done: projet.statut === "VALIDE" },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all
                      ${step.done ? "bg-gold border-gold" : "bg-[var(--bg2)] border-[var(--border)]"}`}>
                      {step.done
                        ? <CheckCircle size={14} className="text-white" />
                        : <div className="w-2 h-2 rounded-full bg-[var(--muted)]" />
                      }
                    </div>
                    <p className={`text-[10px] font-syne font-bold mt-1.5 text-center leading-tight
                      ${step.done ? "text-gold" : "text-[var(--muted)]"}`}>
                      {step.label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 ${step.done ? "bg-gold" : "bg-[var(--border)]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section livrable */}
          <LivrableSection
            projetId={projet.id}
            statut={projet.statut}
            livrables={projet.livrables}
            isClient={isClient}
            isFreelance={isFreelance}
            hasAvis={!!projet.avis}
          />

          {/* Chat */}
          <div>
            <h2 className="font-syne font-bold text-lg text-[var(--ink)] mb-4 flex items-center gap-2">
              💬 Messagerie du projet
              <span className="text-xs font-normal text-[var(--muted)]">— Temps réel</span>
            </h2>
            <ChatProjet projetId={projet.id} otherUser={otherUser} />
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">

          {/* Interlocuteur */}
          <div className="card p-5">
            <p className="section-label">{isClient ? "Freelance" : "Client"}</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-11 h-11 rounded-full bg-gold-pale flex items-center justify-center">
                {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="font-syne font-bold text-xl text-gold">{otherUser.name[0]}</span>
                )}
              </div>
              <div>
                <p className="font-syne font-bold text-[var(--ink)]">{otherUser.name}</p>
                <p className="text-xs text-[var(--muted)]">{isClient ? "Prestataire" : "Commanditaire"}</p>
              </div>
            </div>
          </div>

          {/* Détails financiers */}
          <div className="card p-5">
            <p className="section-label">Paiement</p>
            {projet.paiement ? (
              <div className="space-y-3 mt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--muted)]">Montant total</span>
                  <span className="font-syne font-bold text-[var(--ink)]">
                    {projet.paiement.montant.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--muted)]">Commission (12%)</span>
                  <span className="text-[var(--ink)]">{projet.paiement.commission.toLocaleString("fr-DZ")} DA</span>
                </div>
                {isFreelance && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-[var(--border)]">
                    <span className="font-medium text-[var(--ink)]">Tu reçois</span>
                    <span className="font-syne font-bold text-green-700">
                      {projet.paiement.montantFreelance.toLocaleString("fr-DZ")} DA
                    </span>
                  </div>
                )}
                <PaiementStatut statut={projet.paiement.statut} />
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)] mt-2">Paiement en attente</p>
            )}
          </div>

          {/* Infos projet */}
          <div className="card p-5">
            <p className="section-label">Détails</p>
            <div className="space-y-2.5 mt-2">
              {[
                ["Offre acceptée", new Date(projet.createdAt).toLocaleDateString("fr-DZ")],
                ["Délai prévu", `${projet.offre.delai} jours`],
                ["Référence", `#${projet.id.slice(-8).toUpperCase()}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{k}</span>
                  <span className="font-medium text-[var(--ink)]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaiementStatut({ statut }: { statut: string }) {
  const config: Record<string, [string, string]> = {
    EN_ATTENTE: ["bg-amber-50 text-amber-700", "⏳ En attente de paiement"],
    PAYE: ["bg-blue-50 text-blue-700", "🔒 Sécurisé (en attente de validation)"],
    LIBERE: ["bg-green-50 text-green-700", "✅ Libéré au freelance"],
    REMBOURSE: ["bg-rust/10 text-rust", "↩ Remboursé"],
    ECHEC: ["bg-rust/10 text-rust", "✗ Paiement échoué"],
  };
  const [cls, label] = config[statut] || ["bg-gray-100 text-gray-500", statut];
  return (
    <div className={`text-xs font-syne font-bold px-3 py-2 rounded-sm ${cls} mt-1`}>
      {label}
    </div>
  );
}
