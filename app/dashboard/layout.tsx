// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, FileText, MessageSquare, Bell,
  User, Star, CreditCard, LogOut, Plus
} from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as any).role;

  const clientNav = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/dashboard/demandes", icon: FileText, label: "Mes demandes" },
    { href: "/dashboard/projets", icon: Star, label: "Mes projets" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
    { href: "/dashboard/paiements", icon: CreditCard, label: "Paiements" },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/dashboard/profil", icon: User, label: "Mon profil" },
  ];

  const freelanceNav = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/dashboard/opportunites", icon: FileText, label: "Opportunités" },
    { href: "/dashboard/offres", icon: Star, label: "Mes offres" },
    { href: "/dashboard/projets", icon: Star, label: "Mes projets" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages" },
    { href: "/dashboard/gains", icon: CreditCard, label: "Mes gains" },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/dashboard/profil", icon: User, label: "Mon profil" },
  ];

  const nav = role === "FREELANCE" ? freelanceNav : clientNav;

  return (
    <div className="min-h-screen flex bg-[var(--bg)]" style={{ paddingTop: 0 }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[var(--card)] border-r border-[var(--border)] fixed top-0 left-0 bottom-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <Link href="/" className="font-syne font-extrabold text-xl text-[var(--ink)]">
            Archi<span className="text-gold">DZ</span>
          </Link>
          <p className="text-xs text-[var(--muted)] mt-0.5 font-syne uppercase tracking-wider">
            {role === "FREELANCE" ? "Espace Freelance" : "Espace Client"}
          </p>
        </div>

        {/* CTA */}
        {role === "CLIENT" && (
          <div className="px-4 py-4 border-b border-[var(--border)]">
            <Link href="/dashboard/demandes/nouvelle" className="btn-primary text-xs py-2.5 px-4 w-full text-center flex items-center justify-center gap-2">
              <Plus size={14} />
              Nouvelle demande
            </Link>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-[var(--ink2)]
                hover:bg-gold-pale hover:text-gold transition-all duration-200
                [&.active]:bg-gold-pale [&.active]:text-gold"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="px-4 py-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-pale flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-syne font-bold text-gold">
                {session.user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] truncate">{session.user?.name}</p>
              <p className="text-xs text-[var(--muted)] truncate">{session.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
