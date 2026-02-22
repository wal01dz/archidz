// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Star, MessageSquare, TrendingUp, Clock, CheckCircle, Plus, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;
  const role = (session!.user as any).role;

  let stats: any = {};
  let recentItems: any[] = [];

  if (role === "CLIENT") {
    const [demandes, projets, notifications] = await Promise.all([
      prisma.demande.count({ where: { clientId: userId } }),
      prisma.projet.count({ where: { demande: { clientId: userId } } }),
      prisma.notification.count({ where: { userId, lu: false } }),
    ]);

    const demandesRecentes = await prisma.demande.findMany({
      where: { clientId: userId },
      include: { _count: { select: { offres: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    stats = { demandes, projets, notifications };
    recentItems = demandesRecentes;
  } else {
    const [offres, projets, gains] = await Promise.all([
      prisma.offre.count({ where: { freelanceId: userId } }),
      prisma.projet.count({ where: { offre: { freelanceId: userId } } }),
      prisma.paiement.aggregate({
        where: { projet: { offre: { freelanceId: userId } }, statut: "LIBERE" },
        _sum: { montantFreelance: true },
      }),
    ]);

    const offresRecentes = await prisma.offre.findMany({
      where: { freelanceId: userId },
      include: { demande: { select: { titre: true, budget: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    stats = { offres, projets, gains: gains._sum.montantFreelance || 0 };
    recentItems = offresRecentes;
  }

  const greet = new Date().getHours() < 12 ? "Bonjour" : new Date().getHours() < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-[var(--ink)]">
            {greet}, {session!.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-[var(--muted)] mt-1">Voici un résumé de ton activité sur ArchiDZ</p>
        </div>
        {role === "CLIENT" && (
          <Link href="/dashboard/demandes/nouvelle" className="btn-primary flex items-center gap-2 text-xs">
            <Plus size={14} />
            Nouvelle demande
          </Link>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {role === "CLIENT" ? (
          <>
            <StatCard icon={FileText} label="Mes demandes" value={stats.demandes} color="gold" />
            <StatCard icon={CheckCircle} label="Projets actifs" value={stats.projets} color="green" />
            <StatCard icon={MessageSquare} label="Notifications" value={stats.notifications} color="rust" />
          </>
        ) : (
          <>
            <StatCard icon={Star} label="Offres soumises" value={stats.offres} color="gold" />
            <StatCard icon={CheckCircle} label="Projets réalisés" value={stats.projets} color="green" />
            <StatCard icon={TrendingUp} label="Gains totaux (DA)" value={stats.gains.toLocaleString("fr-DZ")} color="rust" />
          </>
        )}
      </div>

      {/* Recent activity */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-syne font-bold text-lg text-[var(--ink)]">
            {role === "CLIENT" ? "Mes dernières demandes" : "Mes dernières offres"}
          </h2>
          <Link
            href={role === "CLIENT" ? "/dashboard/demandes" : "/dashboard/offres"}
            className="text-xs text-gold hover:text-gold-light flex items-center gap-1 transition-colors"
          >
            Voir tout <ArrowRight size={12} />
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <EmptyState role={role} />
        ) : (
          <div className="space-y-3">
            {recentItems.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-sm bg-[var(--bg2)] hover:bg-gold-pale transition-all duration-200 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--ink)] truncate">
                    {role === "CLIENT" ? item.titre : item.demande.titre}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5 flex items-center gap-2">
                    <Clock size={11} />
                    {new Date(item.createdAt).toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}
                    {role === "CLIENT" && item._count && (
                      <span className="text-gold font-medium">{item._count.offres} offre(s)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatutBadge statut={item.statut} />
                  <ArrowRight size={14} className="text-[var(--muted)]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: Record<string, string> = {
    gold: "text-gold bg-gold-pale",
    green: "text-green-700 bg-green-50",
    rust: "text-rust bg-rust/10",
  };
  return (
    <div className="card p-5 card-hover">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="font-syne font-extrabold text-2xl text-[var(--ink)]">{value}</p>
      <p className="text-xs text-[var(--muted)] mt-0.5 font-syne uppercase tracking-wider">{label}</p>
    </div>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const map: Record<string, [string, string]> = {
    OUVERTE: ["bg-green-50 text-green-700", "Ouverte"],
    EN_COURS: ["bg-gold-pale text-gold", "En cours"],
    TERMINEE: ["bg-gray-100 text-gray-600", "Terminée"],
    EN_ATTENTE: ["bg-gold-pale text-gold", "En attente"],
    ACCEPTEE: ["bg-green-50 text-green-700", "Acceptée"],
    REFUSEE: ["bg-rust/10 text-rust", "Refusée"],
  };
  const [cls, label] = map[statut] || ["bg-gray-100 text-gray-500", statut];
  return (
    <span className={`text-xs font-syne font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}

function EmptyState({ role }: { role: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-14 h-14 bg-gold-pale rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="text-gold" size={24} />
      </div>
      <p className="font-syne font-bold text-[var(--ink)] mb-1">Rien pour l'instant</p>
      <p className="text-sm text-[var(--muted)] mb-4">
        {role === "CLIENT"
          ? "Poste ta première demande et reçois des offres en quelques heures !"
          : "Parcours les demandes disponibles et soumets tes premières offres."}
      </p>
      <Link
        href={role === "CLIENT" ? "/dashboard/demandes/nouvelle" : "/demandes"}
        className="btn-primary text-xs inline-flex items-center gap-2"
      >
        {role === "CLIENT" ? <><Plus size={13} /> Poster une demande</> : <><ArrowRight size={13} /> Voir les demandes</>}
      </Link>
    </div>
  );
}
