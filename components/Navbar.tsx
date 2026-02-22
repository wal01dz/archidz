// components/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bell, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-4
        bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border)]
        transition-all duration-300 ${scrolled ? "shadow-[0_4px_32px_rgba(18,16,14,0.12)]" : ""}`}
    >
      {/* Logo */}
      <Link href="/" className="font-syne font-extrabold text-2xl tracking-tight flex items-center gap-2 text-[var(--ink)]">
        Archi<span className="text-gold">DZ</span>
        <span className="hidden sm:inline text-[10px] font-syne font-bold uppercase tracking-[0.15em] text-[var(--muted)] ml-1">
          🇩🇿 Beta
        </span>
      </Link>

      {/* Nav links — desktop */}
      <ul className="hidden lg:flex gap-7 list-none">
        {[
          ["Demandes", "/demandes"],
          ["Freelances", "/freelances"],
          ["Comment ça marche", "/#comment"],
          ["Tarifs", "/#pricing"],
        ].map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[var(--ink2)] text-sm opacity-60 hover:opacity-100 hover:text-gold transition-all duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)]
            bg-[var(--bg2)] text-base transition-all hover:border-gold"
          title="Changer le thème"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {session ? (
          <>
            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)]
                bg-[var(--bg2)] relative hover:border-gold transition-all"
            >
              <Bell size={15} className="text-[var(--muted)]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rust rounded-full" />
            </Link>

            {/* User menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-sm border border-[var(--border)]
                bg-[var(--bg2)] hover:border-gold transition-all">
                <div className="w-6 h-6 rounded-full bg-gold-pale flex items-center justify-center">
                  <span className="text-xs font-syne font-bold text-gold">
                    {session.user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-[var(--ink)] hidden sm:block">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <ChevronDown size={13} className="text-[var(--muted)]" />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--card)] border border-[var(--border)]
                rounded-lg shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                <div className="p-3 border-b border-[var(--border)]">
                  <p className="text-xs text-[var(--muted)] font-syne uppercase tracking-wider">Connecté en tant que</p>
                  <p className="text-sm font-medium text-[var(--ink)] mt-0.5">{session.user?.name}</p>
                </div>
                <div className="p-2">
                  <Link href="/dashboard" className="block px-3 py-2 text-sm text-[var(--ink2)] hover:text-gold hover:bg-gold-pale rounded-sm transition-all">
                    Mon Dashboard
                  </Link>
                  <Link href="/dashboard/profil" className="block px-3 py-2 text-sm text-[var(--ink2)] hover:text-gold hover:bg-gold-pale rounded-sm transition-all">
                    Mon Profil
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-3 py-2 text-sm text-rust hover:bg-rust/5 rounded-sm transition-all"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-[var(--ink)] opacity-60 hover:opacity-100 transition-all hidden sm:block">
              Connexion
            </Link>
            <Link href="/register" className="btn-primary text-xs px-5 py-2.5">
              Commencer →
            </Link>
          </>
        )}

        {/* Mobile menu button */}
        <button
          className="lg:hidden w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[var(--card)] border-b border-[var(--border)] p-6 lg:hidden">
          <ul className="space-y-4">
            {[["Demandes", "/demandes"], ["Freelances", "/freelances"], ["Comment ça marche", "/#comment"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-[var(--ink)] font-medium" onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
