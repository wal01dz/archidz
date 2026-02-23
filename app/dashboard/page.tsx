// app/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px]">

        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center px-6 lg:px-16 bg-[var(--ink)] overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: "linear-gradient(rgba(184,146,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,146,42,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/8 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-rust/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-2 rounded-full text-xs font-syne font-bold uppercase tracking-widest text-white/60 mb-8">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              🇩🇿 Plateforme 100% Algérienne — Beta
            </div>

            <h1 className="font-syne font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight mb-6">
              La marketplace des{" "}
              <span className="text-gold relative">
                créatifs
                <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-rust rounded-full" />
              </span>{" "}
              algériens
            </h1>

            <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl">
              Rendus 3D, planches, mémoires, portfolio — Poste ta demande,
              reçois des offres compétitives. Paiement sécurisé via Baridi Mob.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="btn-primary text-sm px-8 py-4">
                Commencer gratuitement →
              </Link>
              <Link href="/demandes" className="btn-secondary text-sm px-8 py-4 border-white/20 text-white hover:border-gold hover:text-gold">
                Voir les demandes
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/10">
              {[
                ["500+", "Freelances actifs"],
                ["2 400+", "Projets réalisés"],
                ["12%", "Commission seulement"],
                ["48", "Wilayas couvertes"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className="font-syne font-extrabold text-2xl text-gold">{val}</p>
                  <p className="text-xs text-white/40 font-syne uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="px-6 lg:px-16 py-20 bg-[var(--bg2)]">
          <div className="max-w-6xl mx-auto">
            <p className="section-label">Catégories</p>
            <h2 className="section-title">Tous les services dont tu as besoin</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: "🏗️", title: "Rendu 3D & Visualisation", desc: "Perspectives, animations, rendu réaliste avec Lumion, SketchUp, Blender.", price: "À partir de 3 000 DA" },
                { icon: "📐", title: "Planches & Affichage", desc: "Mise en page professionnelle pour vos soutenances. InDesign, Illustrator.", price: "À partir de 1 500 DA" },
                { icon: "🧊", title: "Maquettes & BIM", desc: "Modélisation BIM, Revit, Rhino, AutoCAD. Plans, coupes, façades.", price: "À partir de 2 000 DA" },
                { icon: "📄", title: "Saisie Mémoire PFE", desc: "Frappe, correction, mise en page Word/LaTeX pour mémoires et thèses.", price: "À partir de 500 DA" },
                { icon: "🎨", title: "Portfolio & CV Créatif", desc: "Portfolio architecte, CV design, book de présentation.", price: "À partir de 2 500 DA" },
                { icon: "🖨️", title: "Impression & Reliure", desc: "Impression grand format, reliure mémoires, tirage A0/A1.", price: "À partir de 800 DA" },
              ].map((s) => (
                <div key={s.title} className="card card-hover p-6">
                  <span className="text-3xl mb-4 block">{s.icon}</span>
                  <h3 className="font-syne font-bold text-base text-[var(--ink)] mb-2">{s.title}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{s.desc}</p>
                  <p className="text-xs font-syne font-bold text-gold">{s.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 lg:px-16 py-20 bg-[var(--bg)]">
          <div className="max-w-6xl mx-auto">
            <p className="section-label">Comment ça marche</p>
            <h2 className="section-title">Simple, rapide, sécurisé</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { num: "01", icon: "📝", title: "Poste ta demande", desc: "Décris ton projet, fixe ton budget et ta deadline. Gratuit et sans engagement." },
                { num: "02", icon: "💬", title: "Reçois des offres", desc: "Les freelances qualifiés te contactent avec leurs prix et portfolios." },
                { num: "03", icon: "🔒", title: "Paiement sécurisé", desc: "L'argent est bloqué jusqu'à livraison. Via Baridi Mob, BaridiPay ou CIB." },
                { num: "04", icon: "✅", title: "Valide & Note", desc: "Approuve le livrable, l'argent est libéré. Laisse un avis pour la communauté." },
              ].map((step) => (
                <div key={step.num} className="card card-hover p-6">
                  <p className="font-syne font-extrabold text-5xl text-gold/20 leading-none mb-3">{step.num}</p>
                  <span className="text-2xl mb-3 block">{step.icon}</span>
                  <h3 className="font-syne font-bold text-sm text-[var(--ink)] mb-2">{step.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-16 py-20 bg-[var(--ink)] text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-syne font-extrabold text-4xl text-white mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-white/50 mb-8">
              Rejoins des centaines de créatifs algériens sur ArchiDZ.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register" className="btn-primary px-10 py-4">
                Créer un compte gratuit →
              </Link>
              <Link href="/demandes" className="btn-secondary px-10 py-4 border-white/20 text-white hover:border-gold hover:text-gold">
                Parcourir les demandes
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-16 py-8 bg-[var(--ink)] border-t border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <p className="font-syne font-extrabold text-xl text-white">
              Archi<span className="text-gold">DZ</span>
            </p>
            <p className="text-xs text-white/30">
              © 2026 ArchiDZ — Marketplace des Créatifs Algériens 🇩🇿
            </p>
          </div>
        </footer>

      </main>
    </>
  );
}
