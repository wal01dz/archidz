"use client";
// components/dashboard/Sidebar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FileText, Star, MessageSquare,
  Bell, User, CreditCard, LogOut, Plus, Zap,
  ChevronLeft, Menu, TrendingUp, Search
} from "lucide-react";

interface Props {
  user: { name: string; email: string; role: string };
  notifCount: number;
}

export default function DashboardSidebar({ user, notifCount }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isClient = user.role === "CLIENT";

  const navItems = isClient ? [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { href: "/dashboard/demandes", icon: FileText, label: "Mes demandes", badge: null },
    { href: "/dashboard/projets", icon: Star, label: "Projets actifs", badge: null },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages", badge: null },
    { href: "/dashboard/paiements", icon: CreditCard, label: "Paiements", badge: null },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications", badge: notifCount > 0 ? notifCount : null },
    { href: "/dashboard/profil", icon: User, label: "Mon profil", badge: null },
  ] : [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { href: "/dashboard/opportunites", icon: Search, label: "Opportunités", badge: null },
    { href: "/dashboard/offres", icon: Zap, label: "Mes offres", badge: null },
    { href: "/dashboard/projets", icon: Star, label: "Projets", badge: null },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Messages", badge: null },
    { href: "/dashboard/gains", icon: TrendingUp, label: "Mes gains", badge: null },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications", badge: notifCount > 0 ? notifCount : null },
    { href: "/dashboard/profil", icon: User, label: "Profil", badge: null },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo + collapse */}
      <div className={`flex items-center justify-between px-5 py-5 border-b border-white/5 ${collapsed ? "px-3" : ""}`}>
        {!collapsed && (
          <Link href="/" className="font-syne font-extrabold text-xl">
            Archi<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">DZ</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white/50 hover:text-white"
        >
          <ChevronLeft size={14} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Clock */}
      {!collapsed && (
        <div className="px-5 py-3 border-b border-white/5">
          <p className="text-xs text-white/30 font-syne uppercase tracking-widest">
            {time.toLocaleDateString("fr-DZ", { weekday: "long", day: "numeric", month: "short" })}
          </p>
          <p className="text-2xl font-syne font-bold text-white/80 tabular-nums mt-0.5">
            {time.toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      )}

      {/* CTA */}
      {isClient && !collapsed && (
        <div className="px-4 py-3 border-b border-white/5">
          <Link
            href="/dashboard/demandes/nouvelle"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-syne font-bold uppercase tracking-wider
              bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400
              transition-all duration-200 shadow-lg shadow-amber-500/20"
          >
            <Plus size={13} /> Nouvelle demande
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative
                ${active
                  ? "bg-gradient-to-r from-amber-500/15 to-orange-500/5 text-amber-400 border border-amber-500/20"
                  : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
            >
              <Icon size={16} className={active ? "text-amber-400" : "text-white/40 group-hover:text-white"} />
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium">{label}</span>
                  {badge && (
                    <span className="w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[10px] font-bold text-black flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className={`border-t border-white/5 p-3 ${collapsed ? "px-2" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-syne font-bold text-black">
                {user.name[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/30 truncate">{user.role === "CLIENT" ? "Client" : "Freelance"}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title="Déconnexion"
            >
              <LogOut size={14} className="text-white/40 hover:text-red-400 transition-colors" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center py-2 text-white/30 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-[#0c0c0c] border-r border-white/5
        transition-all duration-300 z-40 ${collapsed ? "w-16" : "w-64"}`}>
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#0c0c0c] border border-white/10 rounded-lg flex items-center justify-center"
      >
        <Menu size={18} className="text-white" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-[#0c0c0c] border-r border-white/5 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
