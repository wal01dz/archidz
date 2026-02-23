"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: "22px", color: "#f0f0f0", textDecoration: "none", fontFamily: "sans-serif" }}>
            ARCHI<span style={{ color: "#e8ff00" }}>DZ</span>
          </Link>
          <p style={{ color: "#555", fontSize: "11px", marginTop: "6px", fontFamily: "monospace", letterSpacing: "0.15em" }}>// CONNEXION</p>
        </div>
        <div style={{ border: "2px solid #1a1a1a", padding: "36px", background: "#111" }}>
          {error && (
            <div style={{ background: "#1a0000", border: "1px solid #ff3c00", padding: "10px 14px", marginBottom: "16px", color: "#ff3c00", fontSize: "12px", fontFamily: "monospace" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ton@email.com"
                style={{ width: "100%", background: "#0a0a0a", border: "2px solid #2a2a2a", padding: "11px 14px", color: "#f0f0f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>MOT DE PASSE</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width: "100%", background: "#0a0a0a", border: "2px solid #2a2a2a", padding: "11px 14px", color: "#f0f0f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", background: loading ? "#333" : "#e8ff00", color: loading ? "#888" : "black", fontWeight: 700, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "monospace" }}>
              {loading ? "..." : "SE CONNECTER"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#555" }}>
            Pas de compte ? <Link href="/register" style={{ color: "#e8ff00", fontWeight: 700, textDecoration: "none" }}>S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
