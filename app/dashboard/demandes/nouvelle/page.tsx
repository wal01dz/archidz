// app/dashboard/demandes/nouvelle/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";

const CATEGORIES = [
  { value: "RENDU_3D", label: "🏗️ Rendu 3D & Visualisation", desc: "Perspectives, Lumion, SketchUp" },
  { value: "PLANCHES", label: "📐 Planches & Affichage", desc: "InDesign, Illustrator, mise en page" },
  { value: "MAQUETTE_BIM", label: "🧊 Maquette & BIM", desc: "Revit, Rhino, AutoCAD" },
  { value: "MEMOIRE", label: "📄 Saisie Mémoire", desc: "Word, LaTeX, mise en page PFE" },
  { value: "PORTFOLIO", label: "🎨 Portfolio & CV", desc: "Book créatif, CV design" },
  { value: "IMPRESSION", label: "🖨️ Impression & Reliure", desc: "Grand format, A0/A1, reliure" },
  { value: "AUTRE", label: "📦 Autre", desc: "Autre type de projet" },
];

const WILAYAS = [
  "Adrar", "Aïn Defla", "Aïn Témouchent", "Alger", "Annaba", "Batna", "Béjaïa", "Biskra",
  "Blida", "Bordj Bou Arréridj", "Bouira", "Boumerdès", "Chlef", "Constantine", "Djelfa",
  "El Bayadh", "El Oued", "El Tarf", "Ghardaïa", "Guelma", "Illizi", "Jijel", "Khenchela",
  "Laghouat", "Mascara", "Médéa", "Mila", "Mostaganem", "M'Sila", "Naâma", "Oran",
  "Ouargla", "Oum El Bouaghi", "Relizane", "Saïda", "Sétif", "Sidi Bel Abbès", "Skikda",
  "Souk Ahras", "Tamanrasset", "Tébessa", "Tiaret", "Tindouf", "Tipaza", "Tissemsilt",
  "Tizi Ouzou", "Tlemcen",
];

export default function NouvelleDemandePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titre: "",
    description: "",
    categorie: "",
    budget: "",
    deadline: "",
    wilaya: "",
    urgent: false,
    fichiers: [] as string[],
  });

  const update = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: parseInt(form.budget),
          deadline: new Date(form.deadline).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/dashboard/demandes?success=true`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <div className="mb-8">
        <p className="section-label">Poster une demande</p>
        <h1 className="font-syne font-extrabold text-3xl text-[var(--ink)]">Décris ton projet</h1>
        <p className="text-[var(--muted)] mt-1">Les freelances te contacteront avec leurs offres sous 24h.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-syne font-bold transition-all
              ${s < step ? "bg-gold text-white" : s === step ? "bg-gold text-white ring-4 ring-gold-pale" : "bg-[var(--bg2)] text-[var(--muted)]"}`}>
              {s < step ? "✓" : s}
            </div>
            <span className={`text-xs font-syne font-semibold hidden sm:block ${s === step ? "text-gold" : "text-[var(--muted)]"}`}>
              {s === 1 ? "Détails" : s === 2 ? "Budget & Délai" : "Confirmation"}
            </span>
            {s < 3 && <div className={`flex-1 h-px w-8 ${s < step ? "bg-gold" : "bg-[var(--border)]"}`} />}
          </div>
        ))}
      </div>

      <div className="card p-8">
        {/* Étape 1 — Détails du projet */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="label">Titre du projet *</label>
              <input
                className="input"
                placeholder="ex: Rendu 3D villa contemporaine — Alger"
                value={form.titre}
                onChange={(e) => update("titre", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Catégorie *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => update("categorie", cat.value)}
                    className={`p-3 rounded-sm border text-left transition-all duration-200
                      ${form.categorie === cat.value
                        ? "border-gold bg-gold-pale"
                        : "border-[var(--border)] bg-[var(--bg2)] hover:border-gold/50"}`}
                  >
                    <p className="text-sm font-medium text-[var(--ink)]">{cat.label}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Description détaillée *</label>
              <textarea
                className="input resize-none h-32"
                placeholder="Décris ton projet en détail : logiciels préférés, style, références, contraintes..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
              <p className="text-xs text-[var(--muted)] mt-1">{form.description.length} / 20 min</p>
            </div>

            <div>
              <label className="label">Wilaya</label>
              <select className="input" value={form.wilaya} onChange={(e) => update("wilaya", e.target.value)}>
                <option value="">Toutes les wilayas</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={!form.titre || !form.categorie || form.description.length < 20}
              onClick={() => setStep(2)}
            >
              Continuer <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Étape 2 — Budget & Délai */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="label">Budget (en DA) *</label>
              <div className="relative">
                <input
                  type="number"
                  className="input pr-16"
                  placeholder="5000"
                  min="500"
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)] font-syne font-bold">DA</span>
              </div>
              {form.budget && parseInt(form.budget) > 0 && (
                <p className="text-xs text-[var(--muted)] mt-1">
                  Commission ArchiDZ (12%) : {Math.round(parseInt(form.budget) * 0.12).toLocaleString("fr-DZ")} DA —
                  Le freelance reçoit : {Math.round(parseInt(form.budget) * 0.88).toLocaleString("fr-DZ")} DA
                </p>
              )}
            </div>

            <div>
              <label className="label">Date limite de livraison *</label>
              <input
                type="date"
                className="input"
                min={new Date().toISOString().split("T")[0]}
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 p-4 rounded-sm border border-[var(--border)] bg-[var(--bg2)]">
              <input
                type="checkbox"
                id="urgent"
                checked={form.urgent}
                onChange={(e) => update("urgent", e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <label htmlFor="urgent" className="cursor-pointer">
                <p className="text-sm font-medium text-[var(--ink)]">🚨 Marquer comme urgent</p>
                <p className="text-xs text-[var(--muted)]">Ta demande sera mise en avant. Les freelances disponibles rapidement te contacteront en priorité.</p>
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2 flex-1 justify-center">
                <ChevronLeft size={16} /> Retour
              </button>
              <button
                className="btn-primary flex items-center justify-center gap-2 flex-1"
                disabled={!form.budget || !form.deadline}
                onClick={() => setStep(3)}
              >
                Continuer <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 — Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-syne font-bold text-lg text-[var(--ink)]">Résumé de ta demande</h3>

            <div className="space-y-3">
              {[
                ["Titre", form.titre],
                ["Catégorie", CATEGORIES.find(c => c.value === form.categorie)?.label || ""],
                ["Budget", `${parseInt(form.budget).toLocaleString("fr-DZ")} DA`],
                ["Deadline", new Date(form.deadline).toLocaleDateString("fr-DZ", { day: "numeric", month: "long", year: "numeric" })],
                ["Wilaya", form.wilaya || "Toutes"],
                ["Urgent", form.urgent ? "Oui 🚨" : "Non"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start py-2.5 border-b border-[var(--border)] last:border-0">
                  <span className="text-xs font-syne font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</span>
                  <span className="text-sm font-medium text-[var(--ink)] text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rust/10 border border-rust/20 rounded-sm">
                <AlertCircle size={15} className="text-rust flex-shrink-0" />
                <p className="text-sm text-rust">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex items-center gap-2 flex-1 justify-center">
                <ChevronLeft size={16} /> Retour
              </button>
              <button
                className="btn-primary flex items-center justify-center gap-2 flex-1"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publication...
                  </span>
                ) : (
                  <><CheckCircle size={16} /> Publier ma demande</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
