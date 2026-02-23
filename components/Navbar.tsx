"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", background: "rgba(10,10,10,0.95)", borderBottom: "2px solid #1a1a1a", backdropFilter: "blur(12px)", fontFamily: "'Space Grotesk', sans-serif" }}>

      <Link href="/" style={{ fontWeight: 700, fontSize: "20px", color: "#f0f0f0", textDecoration: "none" }}>
        ARCHI<span style={{ color: "#e8ff00" }}>DZ</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {session ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/dashboard" style={{ padding: "8px 16px", border: "2px solid #2a2a2a", color: "#888", fontWeight: 700, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", fontFamily: "'Space Mono', monospace" }}>
              DASHBOARD
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              style={{ padding: "8px 16px", border: "2px solid #2a2a2a", background: "transparent", color: "#888", fontWeight: 700, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>
              DÉCONNEXION
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => signIn()}
              style={{ padding: "10px 20px", border: "2px solid #2a2a2a", background: "transparent", color: "#888", fontWeight: 700, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>
              CONNEXION
            </button>
            <Link href="/register"
              style={{ padding: "10px 20px", background: "#e8ff00", color: "black", fontWeight: 700, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", fontFamily: "'Space Mono', monospace" }}>
              S'INSCRIRE
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
