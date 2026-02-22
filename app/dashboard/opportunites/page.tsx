// app/dashboard/opportunites/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, MapPin, Zap, ArrowRight, Search } from "lucide-react";

const CATEGORIE_LABELS: Record<string, string> = {
  RENDU_3D: "🏗️ Rendu 3D",
  PLANCHES: "📐 Planches",
  MAQUETTE_BIM: "🧊 BIM",
  MEMOIRE: "📄 Mémoire",
  PORTFOLIO: "🎨 Portfolio",
  IMPRESSION: "🖨️ Impression",
  AUTRE: "📦 Autre",
};

export default async function OpportunitesPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  // Demandes ouvertes + on exclut celles sur lesquelles le freelance a déjà offert
  const offresFreelance = await prisma.offre.findMany({
    where: { freelanceId: userId },
    select: { demandeId: true },
  });
  const demandesDejaTraitees = offresFreelance.map((o) => o.demandeId);

  const demandes = await prisma.demande.findMany({
    where: {
      statut: "OUVERTE",
      id: { notIn: demandesDejaTraitees },
    },
    include: {
      client: { select: { name: true, wilaya: true } },
      _count: { select: { offres: true } },
    },
    orderBy: [{ urgent: "desc" }, { createdAt: "desc" }],
    take: 20,
  });

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <p className="section-label">Freelance</p>
        <h1 className="font-syne font-extrabold text-3xl text-[var(--ink)]">Opportunités disponibles</h1>
        <p className="text-[var(--muted)] mt-1">
          {demandes.length} demande{demandes.length > 1 ? "s" : ""} ouverte{demandes.length > 1 ? "s" : ""} — soumets tes offres
        </p>
      </div>

      {demandes.length === 0 ? (
        <div className="card p-14 text-center">
          <Search size={32} className="text-[var(--muted)] mx-auto mb-4" />
          <p className="font-syne font-bold text-lg text-[var(--ink)] mb-1">Aucune opportunité disponible</p>
          <p className="text-sm text-[var(--muted)]">Tu as répondu à toutes les demandes ouvertes. Reviens plus tard !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demandes.map((d) => {
            const joursRestants = Math.ceil((new Date(d.deadline).getTime() - Date.now()) / 86400000);
            return (
              <Link
                key={d.id}
                href={`/demandes/${d.id}#offre-form`}
                className="card p-5 block hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
              >
                {d.urgent && (
                  <div className="absolute top-0 right-0 bg-rust text-white text-[10px] font-syne font-bold px-3 py-1">
                    🚨 Urgent
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-gold text-[10px]">
                    {CATEGORIE_LABELS[d.categorie] || d.categorie}
                  </span>
                  {joursRestants <= 3 && joursRestants > 0 && (
                    <span className="badge text-[10px] bg-rust/10 text-rust">
                      <Zap size={9} /> {joursRestants}j restants
                    </span>
                  )}
                </div>

                <h3 className="font-syne font-bold text-[var(--ink)] group-hover:text-gold transition-colors mb-1 line-clamp-2">
                  {d.titre}
                </h3>

                <div className="flex items-center gap-3 text-xs text-[var(--muted)] mt-2">
                  {d.client.wilaya && (
                    <span className="flex items-center gap-1"><MapPin size={10} />{d.client.wilaya}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={10} />{joursRestants > 0 ? `${joursRestants}j` : "Expiré"}
                  </span>
                  <span>{d._count.offres} offre{d._count.offres > 1 ? "s" : ""}</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="font-syne font-extrabold text-xl text-gold">
                    {d.budget.toLocaleString("fr-DZ")} DA
                  </p>
                  <span className="flex items-center gap-1 text-xs font-syne font-bold text-gold group-hover:gap-2 transition-all">
                    Faire une offre <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
