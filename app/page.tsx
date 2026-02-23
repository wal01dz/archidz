// app/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HomeInteractive from "@/components/HomeInteractive";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#0a0a0a", minHeight: "100vh", paddingTop: "72px" }}>

        {/* HERO */}
        <section style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#555", fontSize: "11px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "24px" }}>
            🇩🇿 Plateforme 100% Algérienne — Beta
          </p>
          <h1 style={{ fontWeight: 700, lineHeight: 0.9, letterSpacing: "-2px", marginBottom: "32px" }}>
            <span style={{ fontSize: "clamp(3rem, 10vw, 7rem)", display: "block", color: "#f0f0f0" }}>LA MARKETPLACE</span>
            <span style={{ fontSize: "clamp(3rem, 10vw, 7rem)", display: "block", WebkitTextStroke: "2px #e8ff00", WebkitTextFillColor: "transparent" }}>DES CRÉATIFS</span>
            <span style={{ fontSize: "clamp(3rem, 10vw, 7rem)", display: "block", color: "#f0f0f0" }}>ALGÉRIENS.</span>
          </h1>
          <p style={{ color: "#555", maxWidth: "480px", lineHeight: 1.7, marginBottom: "40px", fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>
            // Rendus 3D, planches, mémoires, portfolio — Poste ta demande, reçois des offres compétitives.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/register" style={{ display: "inline-flex", alignItems: "center", padding: "14px 32px", background: "#e8ff00", color: "black", fontWeight: 700, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace", textDecoration: "none" }}>
              COMMENCER GRATUITEMENT →
            </Link>
            <Link href="/demandes" style={{ display: "inline-flex", alignItems: "center", padding: "14px 32px", background: "transparent", color: "#888", fontWeight: 700, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace", textDecoration: "none", border: "2px solid #2a2a2a" }}>
              VOIR LES DEMANDES
            </Link>
          </div>
          <div style={{ display: "flex", gap: "48px", marginTop: "64px", paddingTop: "40px", borderTop: "2px solid #1a1a1a", flexWrap: "wrap" }}>
            {[["500+", "FREELANCES"], ["2 400+", "PROJETS"], ["12%", "COMMISSION"], ["48", "WILAYAS"]].map(([v, l]) => (
              <div key={l}>
                <p style={{ fontWeight: 700, fontSize: "2rem", color: "#e8ff00", fontFamily: "'Space Mono', monospace" }}>{v}</p>
                <p style={{ fontSize: "10px", color: "#555", letterSpacing: "0.2em", fontFamily: "'Space Mono', monospace", marginTop: "4px" }}>{l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES — cliquables */}
        <section id="services" style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#555", fontSize: "10px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px" }}>// CATÉGORIES</p>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#f0f0f0", marginBottom: "48px", lineHeight: 1 }}>
            TOUS LES SERVICES<br />DONT TU AS BESOIN.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2px", background: "#1a1a1a" }}>
            {[
              { emoji: "🏗️", title: "RENDU 3D & VISUALISATION", desc: "Perspectives, animations, rendu réaliste.", price: "Dès 3 000 DA", cat: "RENDU_3D" },
              { emoji: "📐", title: "PLANCHES & AFFICHAGE", desc: "Mise en page professionnelle pour soutenances.", price: "Dès 1 500 DA", cat: "PLANCHES" },
              { emoji: "🧊", title: "MAQUETTES & BIM", desc: "Modélisation BIM, Revit, Rhino, AutoCAD.", price: "Dès 2 000 DA", cat: "MAQUETTE_BIM" },
              { emoji: "📄", title: "SAISIE MÉMOIRE PFE", desc: "Frappe, correction, mise en page Word/LaTeX.", price: "Dès 500 DA", cat: "MEMOIRE" },
              { emoji: "🎨", title: "PORTFOLIO & CV CRÉATIF", desc: "Portfolio architecte, CV design, book.", price: "Dès 2 500 DA", cat: "PORTFOLIO" },
              { emoji: "🖨️", title: "IMPRESSION & RELIURE", desc: "Impression grand format, reliure mémoires.", price: "Dès 800 DA", cat: "IMPRESSION" },
            ].map((s) => (
              <Link key={s.title} href={`/demandes?cat=${s.cat}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ background: "#111", padding: "32px", borderLeft: "3px solid transparent", transition: "all 0.2s", cursor: "pointer" }}
                  className="service-card">
                  <p style={{ fontSize: "2rem", marginBottom: "16px" }}>{s.emoji}</p>
                  <h3 style={{ fontWeight: 700, fontSize: "13px", color: "#f0f0f0", marginBottom: "8px", letterSpacing: "0.05em" }}>{s.title}</h3>
                  <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.6, marginBottom: "16px" }}>{s.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#e8ff00", fontFamily: "'Space Mono', monospace" }}>{s.price}</p>
                    <span style={{ fontSize: "11px", color: "#333", fontFamily: "'Space Mono', monospace" }}>VOIR →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PROJETS SLIDER — Client Component */}
        <HomeInteractive />

        {/* COMMENT ÇA MARCHE */}
        <section id="comment" style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto", borderTop: "2px solid #1a1a1a" }}>
          <p style={{ color: "#555", fontSize: "10px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px" }}>// PROCESSUS</p>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#f0f0f0", marginBottom: "48px", lineHeight: 1 }}>
            SIMPLE.<br />RAPIDE.<br />SÉCURISÉ.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2px", background: "#1a1a1a" }}>
            {[
              { num: "01", icon: "📝", title: "POSTE TA DEMANDE", desc: "Décris ton projet en détail, fixe ton budget et ta deadline. C'est 100% gratuit." },
              { num: "02", icon: "💬", title: "REÇOIS DES OFFRES", desc: "Des freelances algériens qualifiés te contactent avec leurs propositions sous 24h." },
              { num: "03", icon: "🔒", title: "PAIEMENT SÉCURISÉ", desc: "Ton argent est bloqué sur ArchiDZ jusqu'à la livraison validée. Zéro risque." },
              { num: "04", icon: "✅", title: "VALIDE & NOTE", desc: "Approuve le livrable, libère le paiement, laisse un avis. Simple et transparent." },
            ].map((s) => (
              <div key={s.num} style={{ background: "#111", padding: "32px" }}>
                <p style={{ fontWeight: 700, fontSize: "3rem", color: "#1a1a1a", lineHeight: 1, marginBottom: "16px", fontFamily: "'Space Mono', monospace" }}>{s.num}</p>
                <p style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{s.icon}</p>
                <h3 style={{ fontWeight: 700, fontSize: "12px", color: "#e8ff00", marginBottom: "12px", letterSpacing: "0.1em" }}>{s.title}</h3>
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA sous comment */}
          <div style={{ marginTop: "48px", padding: "40px", border: "2px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1.5rem", color: "#f0f0f0", marginBottom: "8px" }}>Prêt à commencer ?</p>
              <p style={{ fontSize: "12px", color: "#555", fontFamily: "'Space Mono', monospace" }}>// Inscription gratuite en 2 minutes</p>
            </div>
            <Link href="/register" style={{ display: "inline-flex", padding: "14px 32px", background: "#e8ff00", color: "black", fontWeight: 700, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace", textDecoration: "none" }}>
              CRÉER UN COMPTE →
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: "2px solid #1a1a1a", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontWeight: 700, fontSize: "16px", color: "#f0f0f0" }}>
            ARCHI<span style={{ color: "#e8ff00" }}>DZ</span>
          </span>
          <div style={{ display: "flex", gap: "32px" }}>
            <Link href="/demandes" style={{ fontSize: "10px", color: "#333", fontFamily: "'Space Mono', monospace", textDecoration: "none" }}>DEMANDES</Link>
            <Link href="/login" style={{ fontSize: "10px", color: "#333", fontFamily: "'Space Mono', monospace", textDecoration: "none" }}>CONNEXION</Link>
            <Link href="/register" style={{ fontSize: "10px", color: "#333", fontFamily: "'Space Mono', monospace", textDecoration: "none" }}>S'INSCRIRE</Link>
          </div>
          <span style={{ fontSize: "10px", color: "#222", fontFamily: "'Space Mono', monospace" }}>
            © 2026 ARCHIDZ 🇩🇿
          </span>
        </footer>

        <style>{`
          .service-card:hover {
            border-left: 3px solid #e8ff00 !important;
            background: #161616 !important;
          }
        `}</style>
      </main>
    </>
  );
}
