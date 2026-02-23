"use client";
// components/Navbar.tsx
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bell, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const role = (session?.user as any)?.role;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4
      bg-[var(--nav-bg,rgba(10,10,10,0.95))] backdrop-blur-xl border-b border-[var(--border,#2a2a2a)]">

      {/* Logo */}
      <Link href="/" className="font-bold text-xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        ARCHI<span style={{ color: "#e8ff00" }}>DZ</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden lg:flex gap-8 list-none">
        {[
          ["Demandes", "/demandes"],
          ["Comment ça marche", "/#comment"],
        ].map(([label, href]) => (
          <li key={href}>
            <Link href={href}
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: "#888", fontFamily: "'Space Grotesk', sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f0f0f0")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {session ? (
          <>
            {/* Notif bell */}
            <Link href="/dashboard/notifications"
              className="w-9 h-9 border-2 flex items-center justify-center transition-all"
              style={{ borderColor: "#2a2a2a", color: "#888" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e8ff00";
                (e.currentTarget as HTMLElement).style.color = "#e8ff00";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
                (e.currentTarget as HTMLElement).style.color = "#888";
              }}>
              <Bell size={14} />
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 px-3 py-2 border-2 transition-all text-sm font-bold"
                style={{
                  borderColor: userMenu ? "#e8ff00" : "#2a2a2a",
                  color: userMenu ? "#e8ff00" : "#888",
                  background: "transparent",
                  fontFamily: "'Space Mono', monospace",
                }}>
                <div className="w-5 h-5 flex items-center justify-center text-xs font-bold"
                  style={{ background: "#e8ff00", color: "black" }}>
                  {session.user?.name?.[0]?.toUpperCase()}
                </div>
                {session.user?.name?.split(" ")[0]?.toUpperCase()}
              </button>

              {userMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 border-2 z-50"
                  style={{ background: "#111", borderColor: "#2a2a2a" }}>
                  <Link href="/dashboard"
                    onClick={() => setUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b"
                    style={{ color: "#888", borderColor: "#1e1e1e", fontFamily: "'Space Mono', monospace" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e8ff00")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                    <LayoutDashboard size={12} /> DASHBOARD
                  </Link>
                  <Link href="/dashboard/profil"
                    onClick={() => setUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b"
                    style={{ color: "#888", borderColor: "#1e1e1e", fontFamily: "'Space Mono', monospace" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e8ff00")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                    <User size={12} /> MON PROFIL
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all"
                    style={{ color: "#888", fontFamily: "'Space Mono', monospace" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ff3c00")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                    <LogOut size={12} /> DÉCONNEXION
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login"
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border-2 transition-all"
              style={{ borderColor: "#2a2a2a", color: "#888", fontFamily: "'Space Mono', monospace" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e8ff00";
                (e.currentTarget as HTMLElement).style.color = "#e8ff00";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
                (e.currentTarget as HTMLElement).style.color = "#888";
              }}>
              CONNEXION
            </Link>
            <Link href="/register"
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
              style={{ background: "#e8ff00", color: "black", fontFamily: "'Space Mono', monospace" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              S'INSCRIRE
            </Link>
          </div>
        )}

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-9 h-9 border-2 flex items-center justify-center"
          style={{ borderColor: "#2a2a2a", color: "#888" }}>
          {menuOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 border-b-2 lg:hidden"
          style={{ background: "#0a0a0a", borderColor: "#2a2a2a" }}>
          <div className="px-6 py-4 space-y-3">
            <Link href="/demandes" onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold uppercase tracking-widest py-2"
              style={{ color: "#888", fontFamily: "'Space Mono', monospace" }}>
              DEMANDES
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-widest py-2"
                  style={{ color: "#888", fontFamily: "'Space Mono', monospace" }}>
                  DASHBOARD
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="block text-sm font-bold uppercase tracking-widest py-2 text-left w-full"
                  style={{ color: "#ff3c00", fontFamily: "'Space Mono', monospace" }}>
                  DÉCONNEXION
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-widest py-2"
                  style={{ color: "#888", fontFamily: "'Space Mono', monospace" }}>
                  CONNEXION
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}
                  className="block text-sm font-bold uppercase tracking-widest py-2"
                  style={{ color: "#e8ff00", fontFamily: "'Space Mono', monospace" }}>
                  S'INSCRIRE
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
