"use client";
// components/HomeInteractive.tsx — Slider projets avec effets
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const PROJETS = [
  {
    id: 1, num: "001",
    titre: "Villa Moderne Alger",
    cat: "RENDU 3D",
    desc: "Rendu photoréaliste d'une villa contemporaine à Hydra. Intégration paysagère complète.",
    budget: "8 500 DA",
    duree: "5 jours",
    color: "#e8ff00",
    bg: "#111",
    icon: "🏗️",
  },
  {
    id: 2, num: "002",
    titre: "Planches PFE Architecture Durable",
    cat: "PLANCHES",
    desc: "12 planches A1 pour soutenance PFE sur l'architecture bioclimatique en Algérie.",
    budget: "4 200 DA",
    duree: "3 jours",
    color: "#ff3c00",
    bg: "#111",
    icon: "📐",
  },
  {
    id: 3, num: "003",
    titre: "Mémoire Master Urbanisme",
    cat: "MÉMOIRE",
    desc: "Saisie et mise en page complète d'un mémoire de 180 pages sur l'urbanisme en Kabylie.",
    budget: "2 800 DA",
    duree: "7 jours",
    color: "#3b82f6",
    bg: "#111",
    icon: "📄",
  },
  {
    id: 4, num: "004",
    titre: "Modélisation BIM Complexe Sportif",
    cat: "BIM",
    desc: "Modélisation Revit complète d'un complexe sportif de 2 500 m² avec coordination MEP.",
    budget: "15 000 DA",
    duree: "14 jours",
    color: "#a78bfa",
    bg: "#111",
    icon: "🧊",
  },
  {
    id: 5, num: "005",
    titre: "Portfolio Architecte Junior",
    cat: "PORTFOLIO",
    desc: "Book de 24 pages pour candidature à l'étranger. Design contemporain et percutant.",
    budget: "3 500 DA",
    duree: "4 jours",
    color: "#22d3ee",
    bg: "#111",
    icon: "🎨",
  },
];

export default function HomeInteractive() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setProgress(0);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  const next = () => goTo((current + 1) % PROJETS.length);
  const prev = () => goTo((current - 1 + PROJETS.length) % PROJETS.length);

  // Auto-play
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current]);

  const p = PROJETS[current];

  return (
    <section style={{ padding: "80px 0", background: "#060606", borderTop: "2px solid #1a1a1a", borderBottom: "2px solid #1a1a1a", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ color: "#555", fontSize: "10px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "12px" }}>
              // PROJETS RÉALISÉS
            </p>
            <h2 style={{ fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#f0f0f0", lineHeight: 1 }}>
              EXEMPLES DE<br />PROJETS.
            </h2>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={prev} style={{ width: "44px", height: "44px", border: "2px solid #2a2a2a", background: "transparent", color: "#888", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8ff00"; (e.currentTarget as HTMLElement).style.color = "#e8ff00"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLElement).style.color = "#888"; }}>
              ←
            </button>
            <button onClick={next} style={{ width: "44px", height: "44px", border: "2px solid #2a2a2a", background: "transparent", color: "#888", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8ff00"; (e.currentTarget as HTMLElement).style.color = "#e8ff00"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLElement).style.color = "#888"; }}>
              →
            </button>
          </div>
        </div>

        {/* Slide */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px",
          background: "#1a1a1a",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}>
          {/* Left — Info */}
          <div style={{ background: "#111", padding: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <span style={{ fontSize: "2rem" }}>{p.icon}</span>
              <div>
                <p style={{ fontSize: "10px", fontFamily: "'Space Mono', monospace", color: "#333", letterSpacing: "0.2em" }}>PROJET {p.num}</p>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 10px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.15em", color: "black", background: p.color }}>
                  {p.cat}
                </span>
              </div>
            </div>

            <h3 style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#f0f0f0", lineHeight: 1.1, marginBottom: "20px" }}>
              {p.titre.toUpperCase()}
            </h3>

            <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.8, marginBottom: "32px" }}>
              {p.desc}
            </p>

            <div style={{ display: "flex", gap: "32px", paddingTop: "24px", borderTop: "2px solid #1a1a1a" }}>
              <div>
                <p style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: "#333", letterSpacing: "0.2em", marginBottom: "6px" }}>BUDGET</p>
                <p style={{ fontWeight: 700, fontSize: "1.5rem", color: p.color, fontFamily: "'Space Mono', monospace" }}>{p.budget}</p>
              </div>
              <div>
                <p style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace", color: "#333", letterSpacing: "0.2em", marginBottom: "6px" }}>DÉLAI</p>
                <p style={{ fontWeight: 700, fontSize: "1.5rem", color: "#f0f0f0", fontFamily: "'Space Mono', monospace" }}>{p.duree}</p>
              </div>
            </div>

            <Link href="/register" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              marginTop: "32px", padding: "12px 24px",
              background: p.color, color: "black",
              fontWeight: 700, fontSize: "11px", letterSpacing: "0.2em",
              textTransform: "uppercase", fontFamily: "'Space Mono', monospace",
              textDecoration: "none"
            }}>
              POSTER UN PROJET SIMILAIRE →
            </Link>
          </div>

          {/* Right — Visual */}
          <div style={{ background: "#0d0d0d", padding: "48px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "400px", position: "relative", overflow: "hidden" }}>
            {/* Background number */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "12rem", fontWeight: 700, color: "#0f0f0f", fontFamily: "'Space Mono', monospace", userSelect: "none", lineHeight: 1 }}>
                {p.num}
              </span>
            </div>

            {/* Accent line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: p.color }} />

            {/* Icon big */}
            <div style={{ position: "relative", zIndex: 1, fontSize: "5rem", textAlign: "center", marginTop: "40px" }}>
              {p.icon}
            </div>

            {/* Bottom tags */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Livraison garantie", "Paiement sécurisé", "Révisions incluses"].map(tag => (
                <span key={tag} style={{ fontSize: "9px", fontWeight: 700, padding: "4px 10px", border: `1px solid ${p.color}33`, color: p.color, fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
                  ✓ {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar + dots */}
        <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ flex: 1, height: "2px", background: "#1a1a1a" }}>
            <div style={{ height: "100%", background: p.color, width: `${progress}%`, transition: "width 0.1s linear" }} />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {PROJETS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                background: i === current ? p.color : "#2a2a2a",
                border: "none", cursor: "pointer",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          <span style={{ fontSize: "10px", fontFamily: "'Space Mono', monospace", color: "#333" }}>
            {String(current + 1).padStart(2, "0")} / {String(PROJETS.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
