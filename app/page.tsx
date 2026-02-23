// app/page.tsx — Server Component, no event handlers
import Link from "next/link";
import Navbar from "@/components/Navbar";

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

          {/* Stats */}
          <div style={{ display: "flex", gap: "48px", marginTop: "64px", paddingTop: "40px", borderTop: "2px solid #1a1a1a", flexWrap: "wrap" }}>
            {[["500+", "FREELANCES"], ["2 400+", "PROJETS"], ["12%", "COMMISSION"], ["48", "WILAYAS"]].map(([v, l]) => (
              <div key={l}>
                <p style={{ fontWeight: 700, fontSize: "2rem", color: "#e8ff00", fontFamily: "'Space Mono', monospace" }}>{v}</p>
                <p style={{ fontSize: "10px", color: "#555", letterSpacing: "0.2em", fontFamily: "'Space Mono', monospace", marginTop: "4px" }}>{l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ color: "#555", fontSize: "10px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px" }}>// CATÉGORIES</p>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#f0f0f0", marginBottom: "48px", lineHeight: 1 }}>
            TOUS LES SERVICES<br />DONT TU AS BESOIN.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2px", background: "#1a1a1a" }}>
            {[
              { emoji: "🏗️", title: "RENDU 3D & VISUALISATION", desc: "Perspectives, animations, rendu réaliste.", price: "Dès 3 000 DA" },
              { emoji: "📐", title: "PLANCHES & AFFICHAGE", desc: "Mise en page professionnelle pour soutenances.", price: "Dès 1 500 DA" },
              { emoji: "🧊", title: "MAQUETTES & BIM", desc: "Modélisation BIM, Revit, Rhino, AutoCAD.", price: "Dès 2 000 DA" },
              { emoji: "📄", title: "SAISIE MÉMOIRE PFE", desc: "Frappe, correction, mise en page Word/LaTeX.", price: "Dès 500 DA" },
              { emoji: "🎨", title: "PORTFOLIO & CV CRÉATIF", desc: "Portfolio architecte, CV design, book.", price: "Dès 2 500 DA" },
              { emoji: "🖨️", title: "IMPRESSION & RELIURE", desc: "Impression grand format, reliure mémoires.", price: "Dès 800 DA" },
            ].map((s) => (
              <div key={s.title} style={{ background: "#111", padding: "32px" }}>
                <p style={{ fontSize: "2rem", marginBottom: "16px" }}>{s.emoji}</p>
                <h3 style={{ fontWeight: 700, fontSize: "13px", color: "#f0f0f0", marginBottom: "8px", letterSpacing: "0.05em" }}>{s.title}</h3>
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.6, marginBottom: "16px" }}>{s.desc}</p>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#e8ff00", fontFamily: "'Space Mono', monospace" }}>{s.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto", borderTop: "2px solid #1a1a1a" }}>
          <p style={{ color: "#555", fontSize: "10px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "16px" }}>// PROCESSUS</p>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#f0f0f0", marginBottom: "48px", lineHeight: 1 }}>
            SIMPLE.<br />RAPIDE.<br />SÉCURISÉ.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2px", background: "#1a1a1a" }}>
            {[
              { num: "01", icon: "📝", title: "POSTE TA DEMANDE", desc: "Décris ton projet, fixe ton budget. Gratuit." },
              { num: "02", icon: "💬", title: "REÇOIS DES OFFRES", desc: "Les freelances qualifiés te proposent leurs prix." },
              { num: "03", icon: "🔒", title: "PAIEMENT SÉCURISÉ", desc: "L'argent est bloqué jusqu'à livraison." },
              { num: "04", icon: "✅", title: "VALIDE & NOTE", desc: "Approuve le livrable, libère le paiement." },
            ].map((s) => (
              <div key={s.num} style={{ background: "#111", padding: "32px" }}>
                <p style={{ fontWeight: 700, fontSize: "3rem", color: "#1a1a1a", lineHeight: 1, marginBottom: "16px", fontFamily: "'Space Mono', monospace" }}>{s.num}</p>
                <p style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{s.icon}</p>
                <h3 style={{ fontWeight: 700, fontSize: "12px", color: "#e8ff00", marginBottom: "8px", letterSpacing: "0.1em" }}>{s.title}</h3>
                <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto", borderTop: "2px solid #1a1a1a" }}>
          <div style={{ border: "2px solid #1a1a1a", padding: "64px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "#e8ff00" }} />
            <h2 style={{ fontWeight: 700, fontSize: "clamp(2rem, 6vw, 4rem)", color: "#f0f0f0", marginBottom: "16px", lineHeight: 0.95 }}>
              PRÊT À<br />
              <span style={{ WebkitTextStroke: "2px #e8ff00", WebkitTextFillColor: "transparent" }}>COMMENCER ?</span>
            </h2>
            <p style={{ color: "#555", marginBottom: "32px", fontFamily: "'Space Mono', monospace", fontSize: "12px" }}>
              // Rejoins des centaines de créatifs algériens sur ArchiDZ.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/register" style={{ display: "inline-flex", padding: "14px 32px", background: "#e8ff00", color: "black", fontWeight: 700, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace", textDecoration: "none" }}>
                CRÉER UN COMPTE →
              </Link>
              <Link href="/demandes" style={{ display: "inline-flex", padding: "14px 32px", border: "2px solid #2a2a2a", color: "#888", fontWeight: 700, fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace", textDecoration: "none" }}>
                VOIR LES DEMANDES
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "2px solid #1a1a1a", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontWeight: 700, fontSize: "16px", color: "#f0f0f0" }}>
            ARCHI<span style={{ color: "#e8ff00" }}>DZ</span>
          </span>
          <span style={{ fontSize: "10px", color: "#333", fontFamily: "'Space Mono', monospace" }}>
            © 2026 ARCHIDZ — MARKETPLACE DES CRÉATIFS ALGÉRIENS 🇩🇿
          </span>
        </footer>
      </main>
    </>
  );
}
