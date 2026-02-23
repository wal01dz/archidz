"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CLIENT" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription");
      setLoading(false);
    } else {
      router.push("/login");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: "22px", color: "#f0f0f0", textDecoration: "none", fontFamily: "sans-serif" }}>
            ARCHI<span style={{ color: "#e8ff00" }}>DZ</span>
          </Link>
          <p style={{ color: "#555", fontSize: "11px", marginTop: "6px", fontFamily: "monospace", letterSpacing: "0.15em" }}>// INSCRIPTION</p>
        </div>
        <div style={{ border: "2px solid #1a1a1a", padding: "36px", background: "#111" }}>
          {error && (
            <div style={{ background: "#1a0000", border: "1px solid #ff3c00", padding: "10px 14px", marginBottom: "16px", color: "#ff3c00", fontSize: "12px", fontFamily: "monospace" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>NOM COMPLET</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Ton nom"
                style={{ width: "100%", background: "#0a0a0a", border: "2px solid #2a2a2a", padding: "11px 14px", color: "#f0f0f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>EMAIL</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="ton@email.com"
                style={{ width: "100%", background: "#0a0a0a", border: "2px solid #2a2a2a", padding: "11px 14px", color: "#f0f0f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>MOT DE PASSE</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="••••••••"
                style={{ width: "100%", background: "#0a0a0a", border: "2px solid #2a2a2a", padding: "11px 14px", color: "#f0f0f0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", fontFamily: "monospace" }}>JE SUIS</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["CLIENT", "FREELANCE"].map(r => (
                  <button key={r} type="button" onClick={() => setForm({...form, role: r})}
                    style={{ flex: 1, padding: "10px", border: `2px solid ${form.role === r ? "#e8ff00" : "#2a2a2a"}`, background: form.role === r ? "#e8ff00" : "transparent", color: form.role === r ? "black" : "#888", fontWeight: 700, fontSize: "10px", letterSpacing: "0.15em", cursor: "pointer", fontFamily: "monospace" }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", background: loading ? "#333" : "#e8ff00", color: loading ? "#888" : "black", fontWeight: 700, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "monospace" }}>
              {loading ? "..." : "CRÉER MON COMPTE"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#555" }}>
            Déjà un compte ? <Link href="/login" style={{ color: "#e8ff00", fontWeight: 700, textDecoration: "none" }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
