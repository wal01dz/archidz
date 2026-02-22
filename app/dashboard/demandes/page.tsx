// app/dashboard/demandes/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Clock, Users, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

const STATUT_CONFIG: Record<string, { label: string; color: string }> = {
  OUVERTE: { label: "Ouverte", color: "bg-emerald-50 text-emerald-700" },
  EN_COURS: { label: "En cours", color: "bg-gold-pale text-gold" },
  TERMINEE: { label: "Terminée", color: "bg-gray-100 text-gray-500" },
  ANNULEE: { label: "Annulée", color: "bg-rust/10 text-rust" },
};

export default async function MesDemandesPage({ searchParams }: { searchParams: { success?: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  const demandes = await prisma.demande.findMany({
    where: { clientId: userId },
    include: {
      offres: { select: { id: true, statut: true } },
      _count: { select: { offres: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label">Mon espace</p>
          <h1 className="font-syne font-extrabold text-3xl text-[var(--ink)]">Mes demandes</h1>
        </div>
        <Link href="/dashboard/demandes/nouvelle" className="btn-primary flex items-center gap-2 text-xs">
          <Plus size={14} /> Nouvelle demande
        </Link>
      </div>

      {/* Success toast */}
      {searchParams.success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            Demande publiée ! Les freelances vont commencer à soumettre des offres.
          </p>
        </div>
      )}

      {demandes.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-gold-pale rounded-full flex items-center justify-center mx-auto mb-5">
            <Plus className="text-gold" size={24} />
          </div>
          <p className="font-syne font-bold text-xl text-[var(--ink)] mb-2">Aucune demande pour l'instant</p>
          <p className="text-sm text-[var(--muted)] mb-6 max-w-xs mx-auto">
            Poste ta première demande et reçois des offres de freelances qualifiés en quelques heures.
          </p>
          <Link href="/dashboard/demandes/nouvelle" className="btn-primary inline-flex items-center gap-2">
            <Plus size={14} /> Poster une demande
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map((demande) => {
            const offresEnAttente = demande.offres.filter(o => o.statut === "EN_ATTENTE").length;
            const joursRestants = Math.ceil(
              (new Date(demande.deadline).getTime() - Date.now()) / 86400000
            );
            const statut = STATUT_CONFIG[demande.statut] || { label: demande.statut, color: "" };

            return (
              <Link
                key={demande.id}
                href={`/demandes/${demande.id}`}
                className="card block p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge text-[10px] ${statut.color}`}>{statut.label}</span>
                      {demande.urgent && (
                        <span className="badge text-[10px] bg-rust text-white">🚨 Urgent</span>
                      )}
                      {offresEnAttente > 0 && demande.statut === "OUVERTE" && (
                        <span className="badge text-[10px] bg-gold text-white">
                          {offresEnAttente} nouvelle{offresEnAttente > 1 ? "s" : ""} offre{offresEnAttente > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <h3 className="font-syne font-bold text-[var(--ink)] group-hover:text-gold transition-colors mb-2 truncate">
                      {demande.titre}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {demande._count.offres} offre{demande._count.offres > 1 ? "s" : ""}
                      </span>
                      <span className={`flex items-center gap-1 ${joursRestants <= 3 && joursRestants > 0 ? "text-rust font-bold" : ""}`}>
                        <Clock size={11} />
                        {joursRestants > 0 ? `${joursRestants}j restants` : "Délai expiré"}
                      </span>
                      <span className="font-syne font-bold text-gold">
                        {demande.budget.toLocaleString("fr-DZ")} DA
                      </span>
                    </div>
                  </div>

                  <ArrowRight size={16} className="text-[var(--muted)] group-hover:text-gold transition-colors flex-shrink-0 mt-1" />
                </div>

                {/* Warning si deadline proche */}
                {joursRestants <= 3 && joursRestants > 0 && demande.statut === "OUVERTE" && (
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
                    <AlertCircle size={12} className="text-rust" />
                    <p className="text-xs text-rust font-syne font-bold">
                      Deadline dans {joursRestants} jour{joursRestants > 1 ? "s" : ""} — accepte une offre rapidement !
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
