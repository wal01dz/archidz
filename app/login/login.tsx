// app/login/page.tsx
"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
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
      router.push(searchParams.get("callbackUrl") || "/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-rust/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-syne font-extrabold text-3xl text-[var(--ink)] inline-block">
            Archi<span className="text-gold">DZ</span>
          </Link>
          <p className="text-[var(--muted)] mt-2 text-sm">Connecte-toi à ton compte</p>
        </div>

        <div className="card p-8">
          {searchParams.get("registered") && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-sm mb-6">
              <span className="text-green-600 text-sm">✅ Compte créé ! Tu peux te connecter.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Mot de passe</label>
                <Link href="/forgot-password" className="text-xs text-gold hover:text-gold-light transition-colors">
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="input pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rust/10 border border-rust/20 rounded-sm">
                <AlertCircle size={14} className="text-rust flex-shrink-0" />
                <p className="text-sm text-rust">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Se connecter <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)] font-syne">OU</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <p className="text-center text-sm text-[var(--muted)]">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-gold hover:text-gold-light font-semibold transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[var(--muted)]">
          <span>🔒 Connexion sécurisée</span>
          <span>·</span>
          <span>🇩🇿 Plateforme 100% algérienne</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
