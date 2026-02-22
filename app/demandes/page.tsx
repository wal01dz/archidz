// app/demandes/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Clock, MapPin, Tag, Zap, ArrowRight } from "lucide-react";

const LABEL_MAP: Record<string, string> = {
  RENDU_3D: "🏗️ Rendu 3D",
  PLANCHES: "📐 Planches",
  MAQUETTE_BIM: "🧊 BIM",
  MEMOIRE: "📄 Mémoire",
  PORTFOLIO: "🎨 Portfolio",
  IMPRESSION: "🖨️ Impression",
  AUTRE: "📦 Autre",
};

export default async function DemandesPage({
  searchParams,
}: {
  searchParams: { categorie?: string; wilaya?: string; page?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const where: any = { statut: "OUVERTE" };
  if (searchParams.categorie) where.categorie = searchParams.categorie;
  if (searchParams.wilaya) where.wilaya = searchParams.wilaya;

  const [demandes, total] = await Promise.all([
    prisma.demande.findMany({
      where,
      include: {
        client: { select: { name: true, avatar: true, wilaya: true } },
        _count: { select: { offres: true } },
      },
      orderBy: [{ urgent: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * 12,
      take: 12,
    }),
    prisma.demande.count({ where }),
  ]);

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 px-6 lg:px-16 min-h-screen">
        {/* Header */}
        <div className="mb-10">
          <p className="section-label">Marketplace</p>
          <div className="flex items-end justify-between">
            <h1 className="font-syne font-extrabold text-4xl text-[var(--ink)]">
              Demandes ouvertes
              <span className="text-gold ml-3 text-2xl">{total}</span>
            </h1>
            <Link href="/dashboard/demandes/nouvelle" className="btn-primary text-xs flex items-center gap-2">
              Poster une demande →
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <FilterChip href="/demandes" label="Toutes" active={!searchParams.categorie} />
          {Object.entries(LABEL_MAP).map(([value, label]) => (
            <FilterChip
              key={value}
              href={`/demandes?categorie=${value}`}
              label={label}
              active={searchParams.categorie === value}
            />
          ))}
        </div>

        {/* Grid */}
        {demandes.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-syne font-bold text-2xl text-[var(--ink)] mb-2">Aucune demande</p>
            <p className="text-[var(--muted)]">Sois le premier à poster une demande !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {demandes.map((d) => (
              <DemandeCard key={d.id} demande={d} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/demandes?page=${p}${searchParams.categorie ? `&categorie=${searchParams.categorie}` : ""}`}
                className={`w-9 h-9 flex items-center justify-center rounded-sm text-sm font-syne font-bold border transition-all
                  ${p === page ? "bg-gold text-white border-gold" : "border-[var(--border)] text-[var(--ink2)] hover:border-gold hover:text-gold"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function DemandeCard({ demande }: { demande: any }) {
  const jours = Math.ceil((new Date(demande.deadline).getTime() - Date.now()) / 86400000);

  return (
    <Link href={`/demandes/${demande.id}`} className="card card-hover block group p-6 relative overflow-hidden">
      {demande.urgent && (
        <div className="absolute top-0 right-0">
          <div className="bg-rust text-white text-[10px] font-syne font-bold uppercase tracking-wider px-3 py-1">
            🚨 Urgent
          </div>
        </div>
      )}

      {/* Category */}
      <div className="flex items-center gap-2 mb-4">
        <span className="badge-gold text-[10px]">
          {LABEL_MAP[demande.categorie] || demande.categorie}
        </span>
        {jours <= 3 && (
          <span className="badge badge-rust text-[10px]">
            <Zap size={9} /> {jours}j restants
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-syne font-bold text-base text-[var(--ink)] mb-2 line-clamp-2 group-hover:text-gold transition-colors">
        {demande.titre}
      </h3>

      {/* Description preview */}
      <p className="text-sm text-[var(--muted)] line-clamp-2 mb-4">{demande.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-[var(--muted)] mb-4">
        {demande.client.wilaya && (
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {demande.client.wilaya}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {jours > 0 ? `${jours}j` : "Expiré"}
        </span>
        <span className="flex items-center gap-1">
          <Tag size={11} /> {demande._count.offres} offre{demande._count.offres > 1 ? "s" : ""}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <div>
          <p className="text-xs text-[var(--muted)]">Budget</p>
          <p className="font-syne font-extrabold text-lg text-gold">
            {demande.budget.toLocaleString("fr-DZ")} DA
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold-pale flex items-center justify-center">
            <span className="text-xs font-bold text-gold">{demande.client.name[0]}</span>
          </div>
          <ArrowRight size={16} className="text-[var(--muted)] group-hover:text-gold transition-colors" />
        </div>
      </div>
    </Link>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-full text-xs font-syne font-bold uppercase tracking-wider border transition-all duration-200
        ${active ? "bg-gold text-white border-gold shadow-gold" : "bg-[var(--bg2)] text-[var(--muted)] border-[var(--border)] hover:border-gold hover:text-gold"}`}
    >
      {label}
    </Link>
  );
}
