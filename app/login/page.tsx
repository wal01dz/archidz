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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: "24px", color: "#f0f0f0", textDecoration: "none" }}>
            ARCHI<span style={{ color: "#e8ff00" }}>DZ</span>
          </Link>
          <p style={{ color: "#555", fontSize: "12px", marginTop: "8px", fontFamily: "'Space Mono', monospace" }}>
            // CONNEXION
          </p>
        </div>

        <div style={{ border: "2px solid #1a1a1a", padding: "40px", background: "#111" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Space Mono', monospace" }}>
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                style={{ width: "100%", background: "#0a0a0a", border: "2px solid #2a2a2a", padding: "12px 16px", color: "#f0f0f0", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Space Mono', monospace" }}>
                MOT DE PASSE
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: "100%", background: "#0a0a0a", border: "2px solid #2a2a2a", padding: "12px 16px", color: "#f0f0f0", fontSize: "14px", outline: "none", fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box" }}
              />
            </div>

            {error && (
              <div style={{ background: "rgba(255,60,0,0.1)", border: "1px solid rgba(255,60,0,0.3)", padding: "12px 16px", marginBottom: "20px", color: "#ff3c00", fontSize: "12px", fontFamily: "'Space Mono', monospace" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "14px", background: loading ? "#333" : "#e8ff00", color: loading ? "#888" : "black", fontWeight: 700, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Space Mono', monospace" }}>
              {loading ? "CONNEXION..." : "SE CONNECTER"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #1a1a1a" }}>
            <p style={{ fontSize: "12px", color: "#555" }}>
              Pas de compte ?{" "}
              <Link href="/register" style={{ color: "#e8ff00", fontWeight: 700, textDecoration: "none" }}>
                S'INSCRIRE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
