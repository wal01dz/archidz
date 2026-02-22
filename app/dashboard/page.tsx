// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Zap, Star } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;
  const role = (session!.user as any).role;
  const isClient = role === "CLIENT";

  const hour = new Date().getHours();
  const greet = hour < 5 ? "Bonne nuit" : hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  let stats: any = {};
  let recentItems: any[] = [];
  let activityData: any[] = [];

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
      take: 5,
    });

    stats = {
      totalDemandes,
      projetsActifs,
      offresRecues,
      depenses: depenses._sum.montant || 0,
    };
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
      take: 5,
    });

    const tauxAcceptation = offresEnvoyees > 0 ? Math.round((offresAcceptees / offresEnvoyees) * 100) : 0;

    stats = {
      offresEnvoyees,
      projetsActifs,
      tauxAcceptation,
      gains: gains._sum.montantFreelance || 0,
    };
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/30 text-sm font-syne uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString("fr-DZ", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="font-syne font-extrabold text-3xl md:text-4xl text-white">
            {greet},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              {session!.user?.name?.split(" ")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            {isClient ? "Gérez vos projets et trouvez les meilleurs freelances." : "Découvrez de nouvelles opportunités et gérez vos projets."}
          </p>
        </div>
        {isClient && (
          <Link
            href="/dashboard/demandes/nouvelle"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-syne font-bold
              bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400
              transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5"
          >
            <Plus size={15} /> Nouvelle demande
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isClient ? (
          <>
            <StatCard
              label="Demandes"
              value={stats.totalDemandes}
              icon="📋"
              gradient="from-blue-500/10 to-blue-600/5"
              border="border-blue-500/20"
              textColor="text-blue-400"
            />
            <StatCard
              label="Projets actifs"
              value={stats.projetsActifs}
              icon="⚡"
              gradient="from-amber-500/10 to-orange-600/5"
              border="border-amber-500/20"
              textColor="text-amber-400"
            />
            <StatCard
              label="Offres reçues"
              value={stats.offresRecues}
              icon="💬"
              gradient="from-violet-500/10 to-violet-600/5"
              border="border-violet-500/20"
              textColor="text-violet-400"
              highlight={stats.offresRecues > 0}
            />
            <StatCard
              label="Dépenses (DA)"
              value={stats.depenses.toLocaleString("fr-DZ")}
              icon="💰"
              gradient="from-emerald-500/10 to-emerald-600/5"
              border="border-emerald-500/20"
              textColor="text-emerald-400"
            />
          </>
        ) : (
          <>
            <StatCard
              label="Offres envoyées"
              value={stats.offresEnvoyees}
              icon="📤"
              gradient="from-blue-500/10 to-blue-600/5"
              border="border-blue-500/20"
              textColor="text-blue-400"
            />
            <StatCard
              label="Projets actifs"
              value={stats.projetsActifs}
              icon="⚡"
              gradient="from-amber-500/10 to-orange-600/5"
              border="border-amber-500/20"
              textColor="text-amber-400"
            />
            <StatCard
              label="Taux acceptation"
              value={`${stats.tauxAcceptation}%`}
              icon="🎯"
              gradient="from-violet-500/10 to-violet-600/5"
              border="border-violet-500/20"
              textColor="text-violet-400"
            />
            <StatCard
              label="Gains totaux (DA)"
              value={stats.gains.toLocaleString("fr-DZ")}
              icon="💎"
              gradient="from-emerald-500/10 to-emerald-600/5"
              border="border-emerald-500/20"
              textColor="text-emerald-400"
            />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent activity — 2/3 */}
        <div className="lg:col-span-2">
          <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="font-syne font-bold text-white">
                {isClient ? "Dernières demandes" : "Dernières offres"}
              </h2>
              <Link
                href={isClient ? "/dashboard/demandes" : "/dashboard/offres"}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                Voir tout <ArrowRight size={11} />
              </Link>
            </div>

            {recentItems.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">🎯</p>
                <p className="font-syne font-bold text-white/60 mb-1">Rien encore</p>
                <p className="text-sm text-white/30">
                  {isClient ? "Poste ta première demande !" : "Parcours les opportunités disponibles."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentItems.map((item: any, i: number) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-all duration-200 group"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-base">
                      {isClient ? "📋" : getCategorieEmoji(item.demande?.categorie)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {isClient ? item.titre : item.demande?.titre}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-white/30 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(item.createdAt).toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}
                        </span>
                        {isClient && item._count?.offres > 0 && (
                          <span className="text-xs text-amber-400 font-syne font-bold">
                            {item._count.offres} offre{item._count.offres > 1 ? "s" : ""}
                          </span>
                        )}
                        {!isClient && (
                          <span className="text-xs text-amber-400 font-syne font-bold">
                            {item.demande?.budget?.toLocaleString("fr-DZ")} DA
                          </span>
                        )}
                      </div>
                    </div>
                    <StatutPill statut={item.statut} />
                    <ArrowRight size={14} className="text-white/20 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions — 1/3 */}
        <div className="space-y-4">
          {/* Quick links */}
          <div className="bg-[#0e0e0e] border border-white/5 rounded-2xl p-5">
            <h3 className="font-syne font-bold text-white/60 text-xs uppercase tracking-widest mb-4">
              Actions rapides
            </h3>
            <div className="space-y-2">
              {isClient ? (
                <>
                  <QuickAction href="/dashboard/demandes/nouvelle" icon="➕" label="Nouvelle demande" color="amber" />
                  <QuickAction href="/demandes" icon="🔍" label="Voir le marché" color="blue" />
                  <QuickAction href="/dashboard/projets" icon="⚡" label="Mes projets" color="violet" />
                  <QuickAction href="/dashboard/paiements" icon="💳" label="Paiements" color="emerald" />
                </>
              ) : (
                <>
                  <QuickAction href="/dashboard/opportunites" icon="🎯" label="Opportunités" color="amber" />
                  <QuickAction href="/dashboard/offres" icon="📤" label="Mes offres" color="blue" />
                  <QuickAction href="/dashboard/projets" icon="⚡" label="Mes projets" color="violet" />
                  <QuickAction href="/dashboard/gains" icon="💎" label="Mes gains" color="emerald" />
                </>
              )}
            </div>
          </div>

          {/* Tips card */}
          <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-600/5 border border-amber-500/20 rounded-2xl p-5 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-amber-500/5 blur-2xl" />
            <p className="text-2xl mb-2">💡</p>
            <p className="font-syne font-bold text-amber-400 text-sm mb-1">
              {isClient ? "Conseil du jour" : "Astuce freelance"}
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              {isClient
                ? "Les demandes avec une description détaillée reçoivent 3× plus d'offres de qualité."
                : "Les freelances avec un portfolio complet ont 5× plus de chances de décrocher des projets."}
            </p>
            <Link
              href={isClient ? "/dashboard/demandes/nouvelle" : "/dashboard/profil"}
              className="inline-flex items-center gap-1 mt-3 text-xs text-amber-400 font-syne font-bold hover:text-amber-300 transition-colors"
            >
              {isClient ? "Poster maintenant" : "Compléter mon profil"} <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient, border, textColor, highlight }: any) {
  return (
    <div className={`relative bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-5 overflow-hidden
      hover:-translate-y-0.5 transition-all duration-300 ${highlight ? "ring-1 ring-amber-500/30" : ""}`}>
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/2 blur-2xl" />
      <p className="text-2xl mb-3">{icon}</p>
      <p className={`font-syne font-extrabold text-2xl ${textColor}`}>{value}</p>
      <p className="text-xs text-white/30 font-syne uppercase tracking-wider mt-1">{label}</p>
      {highlight && (
        <span className="absolute top-3 right-3 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
      )}
    </div>
  );
}

function QuickAction({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  const colors: Record<string, string> = {
    amber: "hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30",
    blue: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30",
    violet: "hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/30",
    emerald: "hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30",
  };
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/5 text-white/40 text-sm
        transition-all duration-200 group ${colors[color]}`}
    >
      <span className="text-base">{icon}</span>
      <span className="font-medium flex-1">{label}</span>
      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

function StatutPill({ statut }: { statut: string }) {
  const map: Record<string, [string, string]> = {
    OUVERTE: ["bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "Ouverte"],
    EN_COURS: ["bg-amber-500/10 text-amber-400 border-amber-500/20", "En cours"],
    TERMINEE: ["bg-white/5 text-white/30 border-white/10", "Terminée"],
    EN_ATTENTE: ["bg-amber-500/10 text-amber-400 border-amber-500/20", "En attente"],
    ACCEPTEE: ["bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "Acceptée"],
    REFUSEE: ["bg-red-500/10 text-red-400 border-red-500/20", "Refusée"],
    ANNULEE: ["bg-white/5 text-white/30 border-white/10", "Annulée"],
  };
  const [cls, label] = map[statut] || ["bg-white/5 text-white/30 border-white/10", statut];
  return (
    <span className={`text-[10px] font-syne font-bold px-2 py-1 rounded-full border uppercase tracking-wider flex-shrink-0 ${cls}`}>
      {label}
    </span>
  );
}

function getCategorieEmoji(cat: string) {
  const map: Record<string, string> = {
    RENDU_3D: "🏗️", PLANCHES: "📐", MAQUETTE_BIM: "🧊",
    MEMOIRE: "📄", PORTFOLIO: "🎨", IMPRESSION: "🖨️", AUTRE: "📦",
  };
  return map[cat] || "📦";
}
