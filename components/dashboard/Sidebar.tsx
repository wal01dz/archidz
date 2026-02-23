"use client";
// components/dashboard/Sidebar.tsx — BRUTALIST
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FileText, Search, Zap, Star,
  MessageSquare, Bell, User, TrendingUp, CreditCard,
  LogOut, Plus, Menu, X
} from "lucide-react";

interface Props {
  user: { name: string; email: string; role: string };
  notifCount: number;
}

export default function DashboardSidebar({ user, notifCount }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isClient = user.role === "CLIENT";

  const navItems = isClient ? [
    { href: "/dashboard", icon: LayoutDashboard, label: "DASHBOARD" },
    { href: "/dashboard/demandes", icon: FileText, label: "DEMANDES" },
    { href: "/dashboard/projets", icon: Star, label: "PROJETS" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "MESSAGES" },
    { href: "/dashboard/paiements", icon: CreditCard, label: "PAIEMENTS" },
    { href: "/dashboard/notifications", icon: Bell, label: "NOTIFS", badge: notifCount },
    { href: "/dashboard/profil", icon: User, label: "PROFIL" },
  ] : [
    { href: "/dashboard", icon: LayoutDashboard, label: "DASHBOARD" },
    { href: "/dashboard/opportunites", icon: Search, label: "OPPORTUNITÉS" },
    { href: "/dashboard/offres", icon: Zap, label: "MES OFFRES" },
    { href: "/dashboard/projets", icon: Star, label: "PROJETS" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "MESSAGES" },
    { href: "/dashboard/gains", icon: TrendingUp, label: "GAINS" },
    { href: "/dashboard/notifications", icon: Bell, label: "NOTIFS", badge: notifCount },
    { href: "/dashboard/profil", icon: User, label: "PROFIL" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* Logo */}
      <div className="px-6 py-5 border-b-2" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight" style={{ color: "var(--ink)" }}>
            ARCHI<span style={{ color: "var(--accent)" }}>DZ</span>
          </span>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden" style={{ color: "var(--muted)" }}>
            <X size={18} />
          </button>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mt-1"
          style={{ color: "var(--muted)", fontFamily: "'Space Mono', monospace" }}>
          {isClient ? "// CLIENT" : "// FREELANCE"}
        </p>
      </div>

      {/* CTA */}
      {isClient && (
        <div className="p-4 border-b-2" style={{ borderColor: "var(--border)" }}>
          <Link href="/dashboard/demandes/nouvelle"
            className="flex items-center justify-center gap-2 w-full py-3 font-bold text-[11px] uppercase tracking-widest transition-all duration-150"
            style={{ background: "var(--accent)", color: "black" }}>
            <Plus size={12} strokeWidth={3} /> NOUVELLE DEMANDE
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, badge }: any) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest
                transition-all duration-100 relative group"
              style={{
                color: active ? "var(--accent)" : "var(--muted)",
                background: active ? "rgba(232,255,0,0.04)" : "transparent",
                borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                fontFamily: "'Space Mono', monospace",
              }}>
              <Icon size={14} />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 min-w-[18px] text-center"
                  style={{ background: "var(--accent)", color: "black", fontFamily: "'Space Mono', monospace" }}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t-2 p-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 flex items-center justify-center font-bold text-sm"
            style={{ background: "var(--accent)", color: "black", fontFamily: "'Space Mono', monospace" }}>
            {user.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide truncate" style={{ color: "var(--ink)" }}>
              {user.name}
            </p>
            <p className="text-[9px] font-mono truncate" style={{ color: "var(--muted)" }}>
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 py-2 px-3 text-[10px] font-bold uppercase tracking-widest
            border-2 transition-all duration-150 hover:border-red-500 hover:text-red-500"
          style={{ borderColor: "var(--border)", color: "var(--muted)", fontFamily: "'Space Mono', monospace" }}>
          <LogOut size={11} /> DÉCONNEXION
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-56 border-r-2 z-40"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 border-2 flex items-center justify-center"
        style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--ink)" }}>
        <Menu size={16} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 border-r-2 flex flex-col"
            style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
