// app/dashboard/projets/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, CheckCircle, AlertTriangle, MessageSquare, ArrowRight, FileText } from "lucide-react";

const STATUT_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  EN_COURS: { label: "En cours", color: "text-gold bg-gold-pale", icon: Clock },
  LIVRAISON_EN_ATTENTE: { label: "À valider !", color: "text-amber-700 bg-amber-50", icon: FileText },
  VALIDE: { label: "Terminé", color: "text-green-700 bg-green-50", icon: CheckCircle },
  LITIGE: { label: "Litige", color: "text-rust bg-rust/10", icon: AlertTriangle },
  ANNULE: { label: "Annulé", color: "text-gray-500 bg-gray-100", icon: AlertTriangle },
};

export default async function ProjetsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;
  const role = (session!.user as any).role;

  const projets = await prisma.projet.findMany({
    where: role === "CLIENT"
      ? { demande: { clientId: userId } }
      : { offre: { freelanceId: userId } },
    include: {
      demande: {
        select: { titre: true, categorie: true },
        include: { client: { select: { name: true } } }
      },
      offre: {
        select: { prix: true, delai: true },
        include: { freelance: { select: { name: true } } }
      },
      paiement: { select: { statut: true, montantFreelance: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const enCours = projets.filter(p => p.statut === "EN_COURS" || p.statut === "LIVRAISON_EN_ATTENTE");
  const termines = projets.filter(p => p.statut === "VALIDE");
  const autres = projets.filter(p => !["EN_COURS", "LIVRAISON_EN_ATTENTE", "VALIDE"].includes(p.statut));

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <p className="section-label">Mes projets</p>
        <h1 className="font-syne font-extrabold text-3xl text-[var(--ink)]">
          Tableau de bord projets
        </h1>
      </div>

      {projets.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">🏗️</p>
          <p className="font-syne font-bold text-xl text-[var(--ink)] mb-2">Aucun projet pour l'instant</p>
          <p className="text-[var(--muted)] text-sm mb-6">
            {role === "CLIENT"
              ? "Poste une demande et accepte l'offre d'un freelance pour démarrer un projet."
              : "Soumets des offres sur les demandes disponibles pour décrocher des projets."
            }
          </p>
          <Link href={role === "CLIENT" ? "/dashboard/demandes/nouvelle" : "/demandes"} className="btn-primary text-xs inline-block">
            {role === "CLIENT" ? "Poster une demande" : "Voir les demandes"}
          </Link>
        </div>
      ) : (
        <>
          {enCours.length > 0 && (
            <section>
              <h2 className="font-syne font-bold text-lg text-[var(--ink)] mb-4 flex items-center gap-2">
                <Clock size={18} className="text-gold" /> Projets actifs
                <span className="text-sm font-normal text-[var(--muted)]">({enCours.length})</span>
              </h2>
              <div className="grid gap-4">
                {enCours.map(p => <ProjetCard key={p.id} projet={p} role={role} />)}
              </div>
            </section>
          )}

          {termines.length > 0 && (
            <section>
              <h2 className="font-syne font-bold text-lg text-[var(--ink)] mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" /> Projets terminés
                <span className="text-sm font-normal text-[var(--muted)]">({termines.length})</span>
              </h2>
              <div className="grid gap-4">
                {termines.map(p => <ProjetCard key={p.id} projet={p} role={role} />)}
              </div>
            </section>
          )}

          {autres.length > 0 && (
            <section>
              <h2 className="font-syne font-bold text-lg text-[var(--ink)] mb-4">Autres</h2>
              <div className="grid gap-4">
                {autres.map(p => <ProjetCard key={p.id} projet={p} role={role} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function ProjetCard({ projet, role }: { projet: any; role: string }) {
  const cfg = STATUT_CONFIG[projet.statut] || STATUT_CONFIG.EN_COURS;
  const Icon = cfg.icon;
  const isAttention = projet.statut === "LIVRAISON_EN_ATTENTE" && role === "CLIENT";

  return (
    <Link
      href={`/dashboard/projets/${projet.id}`}
      className={`card card-hover flex items-center gap-5 p-5 group
        ${isAttention ? "border-amber-300 ring-1 ring-amber-200" : ""}`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-syne font-bold text-[var(--ink)] truncate group-hover:text-gold transition-colors">
            {projet.demande.titre}
          </h3>
          {isAttention && (
            <span className="text-[10px] font-syne font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 flex-shrink-0">
              Action requise !
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--muted)] flex items-center gap-3">
          <span>{role === "CLIENT" ? `Freelance : ${projet.offre.freelance.name}` : `Client : ${projet.demande.client.name}`}</span>
          <span>·</span>
          <span>{new Date(projet.createdAt).toLocaleDateString("fr-DZ")}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-5 flex-shrink-0">
        <div className="text-center hidden sm:block">
          <p className="font-syne font-bold text-lg text-gold">
            {(role === "CLIENT" ? projet.offre.prix : projet.paiement?.montantFreelance || projet.offre.prix)
              .toLocaleString("fr-DZ")} DA
          </p>
          <p className="text-[10px] text-[var(--muted)]">{role === "CLIENT" ? "Total" : "Tes gains"}</p>
        </div>

        {projet._count.messages > 0 && (
          <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
            <MessageSquare size={13} /> {projet._count.messages}
          </div>
        )}

        <span className={`text-[11px] font-syne font-bold px-3 py-1.5 rounded-full ${cfg.color}`}>
          {cfg.label}
        </span>

        <ArrowRight size={16} className="text-[var(--muted)] group-hover:text-gold transition-colors" />
      </div>
    </Link>
  );
}
