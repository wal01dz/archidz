// app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, User, Briefcase } from "lucide-react";

export default function loginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"CLIENT" | "FREELANCE" | "">("");
  const [form, setForm] = useState({ name: "", email: "", password: "", wilaya: "", phone: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      router.push("/login?logined=true");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)] py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-syne font-extrabold text-3xl text-[var(--ink)] inline-block">
            Archi<span className="text-gold">DZ</span>
          </Link>
          <p className="text-[var(--muted)] mt-2 text-sm">Crée ton compte gratuitement</p>
        </div>

        <div className="card p-8">
          {/* Step 1 — Choix du rôle */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-syne font-bold text-xl text-[var(--ink)] mb-1">Je suis...</h2>
                <p className="text-sm text-[var(--muted)]">Choisis ton profil pour personnaliser ton expérience.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {([
                  { value: "CLIENT", icon: User, label: "Client", desc: "Je cherche des freelances pour mes projets" },
                  { value: "FREELANCE", icon: Briefcase, label: "Freelance", desc: "Je propose mes services créatifs" },
                ] as any[]).map(({ value, icon: Icon, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setRole(value)}
                    className={`p-5 rounded-sm border text-left transition-all duration-200
                      ${role === value
                        ? "border-gold bg-gold-pale shadow-gold"
                        : "border-[var(--border)] bg-[var(--bg2)] hover:border-gold/50"}`}
                  >
                    <Icon size={24} className={role === value ? "text-gold" : "text-[var(--muted)]"} />
                    <p className={`font-syne font-bold text-base mt-3 ${role === value ? "text-gold" : "text-[var(--ink)]"}`}>
                      {label}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{desc}</p>
                  </button>
                ))}
              </div>

              <button
                className="btn-primary w-full"
                disabled={!role}
                onClick={() => setStep(2)}
              >
                Continuer →
              </button>
            </div>
          )}

          {/* Step 2 — Infos personnelles */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setStep(1)} className="text-[var(--muted)] hover:text-[var(--ink)]">←</button>
                <h2 className="font-syne font-bold text-lg text-[var(--ink)]">
                  {role === "CLIENT" ? "Compte Client" : "Compte Freelance"}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Nom complet *</label>
                  <input className="input" placeholder="Yacine Benali" value={form.name} onChange={(e) => update("name", e.target.value)} required />
                </div>
                <div className="col-span-2">
                  <label className="label">Email *</label>
                  <input type="email" className="input" placeholder="ton@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                </div>
                <div className="col-span-2 relative">
                  <label className="label">Mot de passe * (min 8 caractères)</label>
                  <input
                    type={showPwd ? "text" : "password"}
                    className="input pr-11"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    minLength={8}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 bottom-3 text-[var(--muted)]">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div>
                  <label className="label">Téléphone</label>
                  <input className="input" placeholder="06XXXXXXXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>
                <div>
                  <label className="label">Wilaya</label>
                  <input className="input" placeholder="Alger" value={form.wilaya} onChange={(e) => update("wilaya", e.target.value)} />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-rust/10 border border-rust/20 rounded-sm">
                  <AlertCircle size={14} className="text-rust" />
                  <p className="text-sm text-rust">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Création du compte...
                  </span>
                ) : "Créer mon compte →"}
              </button>

              <p className="text-xs text-center text-[var(--muted)]">
                En créant un compte, tu acceptes nos{" "}
                <Link href="/cgu" className="text-gold">conditions d'utilisation</Link>
              </p>
            </form>
          )}
        </div>

        <p className="text-center mt-5 text-sm text-[var(--muted)]">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-gold font-semibold hover:text-gold-light transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
