// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Plus, ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;
  const role = (session!.user as any).role;
  const isClient = role === "CLIENT";

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  let stats: any = {};
  let recentItems: any[] = [];

  if (isClient) {
    const [totalDemandes, projetsActifs, offresRecues, depenses] = await Promise.all([
      prisma.demande.count({ where: { clientId: userId } }),
      prisma.projet.count({ where: { demande: { clientId: userId }, statut: "EN_COURS" } }),
      prisma.offre.count({ where: { demande: { clientId: userId }, statut: "EN_ATTENTE" } }),
      prisma.paiement.aggregate({
        where: { userId, statut: { in: ["PAYE", "LIBERE"] } },
        _sum: { montant: true },
      }),
    ]);
    recentItems = await prisma.demande.findMany({
      where: { clientId: userId },
      include: { _count: { select: { offres: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    stats = { totalDemandes, projetsActifs, offresRecues, depenses: depenses._sum.montant || 0 };
  } else {
    const [offresEnvoyees, projetsActifs, offresAcceptees, gains] = await Promise.all([
      prisma.offre.count({ where: { freelanceId: userId } }),
      prisma.projet.count({ where: { offre: { freelanceId: userId }, statut: "EN_COURS" } }),
      prisma.offre.count({ where: { freelanceId: userId, statut: "ACCEPTEE" } }),
      prisma.paiement.aggregate({
        where: { projet: { offre: { freelanceId: userId } }, statut: "LIBERE" },
        _sum: { montantFreelance: true },
      }),
    ]);
    recentItems = await prisma.offre.findMany({
      where: { freelanceId: userId },
      include: { demande: { select: { titre: true, budget: true, categorie: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    const tauxAcceptation = offresEnvoyees > 0 ? Math.round((offresAcceptees / offresEnvoyees) * 100) : 0;
    stats = { offresEnvoyees, projetsActifs, tauxAcceptation, gains: gains._sum.montantFreelance || 0 };
  }

  const CATEGORIE_MAP: Record<string, { label: string; emoji: string; color: string }> = {
    RENDU_3D: { label: "Rendu 3D", emoji: "🏗️", color: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400" },
    PLANCHES: { label: "Planches", emoji: "📐", color: "from-violet-500/20 to-violet-600/5 border-violet-500/20 text-violet-400" },
    MAQUETTE_BIM: { label: "BIM", emoji: "🧊", color: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400" },
    MEMOIRE: { label: "Mémoire", emoji: "📄", color: "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400" },
    PORTFOLIO: { label: "Portfolio", emoji: "🎨", color: "from-pink-500/20 to-pink-600/5 border-pink-500/20 text-pink-400" },
    IMPRESSION: { label: "Impression", emoji: "🖨️", color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400" },
    AUTRE: { label: "Autre", emoji: "📦", color: "from-white/10 to-white/5 border-white/10 text-white/40" },
  };

  return (
    <div className="space-y-10 pb-10">

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-8 md:p-10">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-6">
          <div>
            <p className="text-white/30 text-xs font-mono tracking-[0.2em] uppercase mb-3">
              {new Date().toLocaleDateString("fr-DZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 className="font-syne font-extrabold text-4xl md:text-5xl text-white leading-tight">
              {greet},<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
                {session!.user?.name?.split(" ")[0]}
              </span>
            </h1>
            <p className="text-white/35 mt-3 text-sm max-w-md leading-relaxed">
              {isClient
                ? "Bienvenue sur ton espace. Gère tes projets et trouve les meilleurs freelances algériens."
                : "Bienvenue sur ton espace freelance. Découvre les opportunités et booste tes revenus."}
            </p>
          </div>
          {isClient && (
            <Link
              href="/dashboard/demandes/nouvelle"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-syne font-bold text-sm
                bg-gradient-to-r from-amber-400 to-orange-500 text-black
                hover:from-amber-300 hover:to-orange-400 transition-all duration-200
                shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              <Plus size={16} strokeWidth={2.5} />
              Nouvelle demande
            </Link>
          )}
        </div>

        {/* Role badge */}
        <div className="relative z-10 mt-6 flex items-center gap-2">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isClient ? "Compte Client" : "Compte Freelance"} · ArchiDZ Beta
          </span>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(isClient ? [
          { label: "Demandes", value: stats.totalDemandes, emoji: "📋", sub: "publiées", accent: "#60a5fa" },
          { label: "Projets actifs", value: stats.projetsActifs, emoji: "⚡", sub: "en cours", accent: "#f59e0b" },
          { label: "Offres reçues", value: stats.offresRecues, emoji: "💬", sub: "en attente", accent: "#a78bfa", pulse: stats.offresRecues > 0 },
          { label: "Dépensé", value: `${stats.depenses.toLocaleString("fr-DZ")} DA`, emoji: "💳", sub: "total", accent: "#34d399" },
        ] : [
          { label: "Offres", value: stats.offresEnvoyees, emoji: "📤", sub: "envoyées", accent: "#60a5fa" },
          { label: "Projets actifs", value: stats.projetsActifs, emoji: "⚡", sub: "en cours", accent: "#f59e0b" },
          { label: "Taux succès", value: `${stats.tauxAcceptation}%`, emoji: "🎯", sub: "acceptation", accent: "#a78bfa" },
          { label: "Gains", value: `${stats.gains.toLocaleString("fr-DZ")} DA`, emoji: "💎", sub: "libérés", accent: "#34d399" },
        ]).map((s, i) => (
          <div key={i} className="relative bg-[#0e0e0e] border border-white/5 rounded-2xl p-5 overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle at 70% 20%, ${s.accent}08, transparent 70%)` }} />
            {(s as any).pulse && <span className="absolute top-3 right-3 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />}
            <p className="text-xl mb-3">{s.emoji}</p>
            <p className="font-syne font-extrabold text-2xl text-white tabular-nums">{s.value}</p>
            <p className="text-xs text-white/25 mt-1 font-mono uppercase tracking-widest">{s.sub}</p>
            <p className="text-[10px] text-white/20 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── DEMANDES / OFFRES ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-syne font-extrabold text-xl text-white">
              {isClient ? "Mes demandes récentes" : "Mes offres récentes"}
            </h2>
            <p className="text-white/30 text-xs mt-0.5">
              {recentItems.length} élément{recentItems.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href={isClient ? "/dashboard/demandes" : "/dashboard/offres"}
            className="flex items-center gap-1.5 text-xs font-syne font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Voir tout <ArrowRight size={12} />
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <div className="bg-[#0e0e0e] border border-white/5 rounded-3xl p-16 text-center">
            <p className="text-5xl mb-4">🎯</p>
            <p className="font-syne font-bold text-white/50 text-lg mb-2">Aucun élément</p>
            <p className="text-white/25 text-sm mb-6">
              {isClient ? "Poste ta première demande pour recevoir des offres !" : "Parcours les opportunités disponibles."}
            </p>
            <Link href={isClient ? "/dashboard/demandes/nouvelle" : "/dashboard/opportunites"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-syne font-bold text-sm
                bg-gradient-to-r from-amber-400 to-orange-500 text-black">
              {isClient ? "Poster une demande" : "Voir les opportunités"} →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentItems.map((item: any) => {
              const cat = isClient
                ? CATEGORIE_MAP[item.categorie] || CATEGORIE_MAP.AUTRE
                : CATEGORIE_MAP[item.demande?.categorie] || CATEGORIE_MAP.AUTRE;
              const titre = isClient ? item.titre : item.demande?.titre;
              const joursRestants = isClient
                ? Math.ceil((new Date(item.deadline).getTime() - Date.now()) / 86400000)
                : null;
              const statutConfig: Record<string, [string, string]> = {
                OUVERTE: ["bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "Ouverte"],
                EN_COURS: ["bg-amber-500/10 text-amber-400 border-amber-500/20", "En cours"],
                TERMINEE: ["bg-white/5 text-white/30 border-white/10", "Terminée"],
                EN_ATTENTE: ["bg-amber-500/10 text-amber-400 border-amber-500/20", "En attente"],
                ACCEPTEE: ["bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "Acceptée"],
                REFUSEE: ["bg-red-500/10 text-red-400 border-red-500/20", "Refusée"],
                ANNULEE: ["bg-white/5 text-white/30 border-white/10", "Annulée"],
              };
              const [statCls, statLabel] = statutConfig[item.statut] || ["bg-white/5 text-white/30 border-white/10", item.statut];

              return (
                <Link
                  key={item.id}
                  href={isClient ? `/demandes/${item.id}` : `/demandes/${item.demandeId}`}
                  className="group relative bg-[#0e0e0e] border border-white/5 rounded-2xl p-5 overflow-hidden
                    hover:border-white/10 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Card glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color.split(" ")[0]} ${cat.color.split(" ")[1]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color.split(" ")[0]} ${cat.color.split(" ")[1]} border ${cat.color.split(" ")[2]} flex items-center justify-center text-lg`}>
                        {cat.emoji}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.urgent && (
                          <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                            URGENT
                          </span>
                        )}
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${statCls}`}>
                          {statLabel}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-syne font-bold text-white text-sm leading-snug mb-3 line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {titre}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[11px] text-white/25 font-mono mb-4">
                      <span>{new Date(item.createdAt).toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}</span>
                      {joursRestants !== null && (
                        <span className={joursRestants <= 3 ? "text-red-400" : ""}>
                          · {joursRestants > 0 ? `${joursRestants}j restants` : "Expiré"}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div>
                        <p className="font-syne font-extrabold text-lg text-white">
                          {isClient
                            ? `${item.budget?.toLocaleString("fr-DZ")} DA`
                            : `${item.prix?.toLocaleString("fr-DZ")} DA`}
                        </p>
                        {isClient && item._count?.offres > 0 && (
                          <p className="text-[10px] text-amber-400 font-mono mt-0.5">
                            {item._count.offres} offre{item._count.offres > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-amber-500/10 flex items-center justify-center transition-all">
                        <ArrowUpRight size={14} className="text-white/30 group-hover:text-amber-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Add new card */}
            {isClient && (
              <Link
                href="/dashboard/demandes/nouvelle"
                className="group bg-[#0a0a0a] border border-dashed border-white/10 rounded-2xl p-5
                  hover:border-amber-500/30 hover:bg-amber-500/3 transition-all duration-300
                  flex flex-col items-center justify-center min-h-[180px] gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-amber-500/10 flex items-center justify-center transition-all">
                  <Plus size={20} className="text-white/20 group-hover:text-amber-400 transition-colors" />
                </div>
                <p className="font-syne font-bold text-white/20 group-hover:text-amber-400 text-sm transition-colors">
                  Nouvelle demande
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
