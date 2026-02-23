// app/dashboard/page.tsx — BRUTALIST DESIGN
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Search, SlidersHorizontal, TrendingUp, Zap, FileText, Star } from "lucide-react";

// Mock data structure — replace with real server fetch
export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("TOUS");
  const [filterBudget, setFilterBudget] = useState("TOUS");
  const [theme, setTheme] = useState("dark");
  const [time, setTime] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const CATS = ["TOUS", "RENDU_3D", "PLANCHES", "MAQUETTE_BIM", "MEMOIRE", "PORTFOLIO", "IMPRESSION"];
  const CAT_LABELS: Record<string, string> = {
    TOUS: "Tout", RENDU_3D: "3D", PLANCHES: "Planches", MAQUETTE_BIM: "BIM",
    MEMOIRE: "Mémoire", PORTFOLIO: "Portfolio", IMPRESSION: "Impression"
  };
  const BUDGETS = [
    { key: "TOUS", label: "Tous budgets" },
    { key: "0-2000", label: "< 2 000 DA" },
    { key: "2000-5000", label: "2k — 5k DA" },
    { key: "5000-10000", label: "5k — 10k DA" },
    { key: "10000+", label: "> 10 000 DA" },
  ];

  // Stats hardcoded for demo (replace with server data)
  const stats = [
    { label: "DEMANDES", value: "12", delta: "+3", icon: FileText },
    { label: "PROJETS ACTIFS", value: "4", delta: "+1", icon: Zap },
    { label: "OFFRES REÇUES", value: "27", delta: "+8", icon: Star },
    { label: "DÉPENSÉ (DA)", value: "124K", delta: "+12K", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[var(--border)] sticky top-0 bg-[var(--bg)] z-30">
        <div className="flex items-center gap-6">
          <span className="font-bold text-xl tracking-tight">
            ARCHI<span style={{ color: "var(--accent)" }}>DZ</span>
          </span>
          <span className="hidden md:block text-[10px] font-mono text-[var(--muted)] uppercase tracking-widest"
            style={{ fontFamily: "'Space Mono', monospace" }}>
            ⬤ LIVE — {time}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            className="px-4 py-2 border-2 border-[var(--border)] text-[10px] font-bold uppercase tracking-widest
              hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {theme === "dark" ? "☀ LIGHT" : "◑ DARK"}
          </button>
          <Link href="/dashboard/demandes/nouvelle"
            className="btn-primary text-[11px] flex items-center gap-2">
            <Plus size={13} strokeWidth={3} /> NOUVELLE DEMANDE
          </Link>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-10">

        {/* ── HERO ── */}
        <div className="relative border-2 border-[var(--border)] p-8 md:p-12 overflow-hidden">
          {/* Accent corner */}
          <div className="absolute top-0 left-0 w-1 h-full" style={{ background: "var(--accent)" }} />
          <div className="absolute top-0 left-0 h-1 w-24" style={{ background: "var(--accent)" }} />

          <p className="section-label mb-2">Dashboard — Espace Client</p>
          <h1 className="font-bold leading-none text-5xl md:text-8xl tracking-tight mb-4" style={{ color: "var(--ink)" }}>
            BONJOUR,<br />
            <span style={{ color: "var(--accent)", WebkitTextStroke: "2px var(--accent)", WebkitTextFillColor: "transparent" }}>
              YACINE.
            </span>
          </h1>
          <p className="text-[var(--muted)] text-sm max-w-md mt-4" style={{ fontFamily: "'Space Mono', monospace" }}>
            // Gérez vos projets. Trouvez les meilleurs créatifs algériens.
          </p>

          {/* Big number accent */}
          <div className="absolute right-8 bottom-4 text-[80px] md:text-[140px] font-bold leading-none opacity-5 select-none"
            style={{ color: "var(--accent)", fontFamily: "'Space Mono', monospace" }}>
            DZ
          </div>
        </div>

        {/* ── STATS GRID ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="border-2 border-[var(--border)] p-5 hover:border-[var(--accent)] transition-all duration-150 group">
              <div className="flex items-start justify-between mb-4">
                <s.icon size={18} className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 border border-[var(--border)]"
                  style={{ color: "var(--accent)", fontFamily: "'Space Mono', monospace" }}>
                  {s.delta}
                </span>
              </div>
              <p className="font-bold text-3xl md:text-4xl tracking-tight" style={{ color: "var(--ink)", fontFamily: "'Space Mono', monospace" }}>
                {s.value}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: "var(--muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── CHART AREA ── */}
        <div className="border-2 border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label">Activité — 7 derniers jours</p>
              <p className="font-bold text-2xl" style={{ color: "var(--ink)" }}>Demandes & Offres</p>
            </div>
          </div>
          {/* Simple CSS bar chart */}
          <div className="flex items-end gap-2 h-32">
            {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{ height: `${h}%`, background: i === 5 ? "var(--accent)" : "var(--border)" }}
                  title={`Jour ${i + 1}`}
                />
                <span className="text-[9px] font-mono text-[var(--muted)]">
                  {["L", "M", "M", "J", "V", "S", "D"][i]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-mono text-[var(--muted)] mt-3">
            // Pic samedi — 12 nouvelles demandes publiées
          </p>
        </div>

        {/* ── DEMANDES SECTION ── */}
        <div>
          {/* Section header */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <p className="section-label">Mes projets</p>
              <h2 className="font-bold text-3xl md:text-4xl" style={{ color: "var(--ink)" }}>
                DEMANDES RÉCENTES
              </h2>
            </div>
            <Link href="/dashboard/demandes"
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest border-b-2 pb-0.5 hover:gap-3 transition-all duration-150"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
              VOIR TOUT <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="RECHERCHER UNE DEMANDE..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 text-[11px] uppercase tracking-widest"
                style={{ fontFamily: "'Space Mono', monospace" }}
              />
            </div>

            {/* Budget filter */}
            <select
              value={filterBudget}
              onChange={e => setFilterBudget(e.target.value)}
              className="input text-[11px] uppercase tracking-widest min-w-[140px] cursor-pointer"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {BUDGETS.map(b => (
                <option key={b.key} value={b.key}>{b.label}</option>
              ))}
            </select>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATS.map(c => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border-2 transition-all duration-150"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  borderColor: filterCat === c ? "var(--accent)" : "var(--border)",
                  background: filterCat === c ? "var(--accent)" : "transparent",
                  color: filterCat === c ? "black" : "var(--muted)",
                }}
              >
                {CAT_LABELS[c]}
              </button>
            ))}
          </div>

          {/* Demandes grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-[var(--border)]">
            {[
              { id: "1", titre: "Rendu 3D villa Alger", cat: "RENDU_3D", budget: 8000, offres: 5, statut: "OUVERTE", urgent: true, jours: 3 },
              { id: "2", titre: "Planches soutenance PFE", cat: "PLANCHES", budget: 2500, offres: 2, statut: "OUVERTE", urgent: false, jours: 7 },
              { id: "3", titre: "Mémoire architecture durable", cat: "MEMOIRE", budget: 1500, offres: 8, statut: "EN_COURS", urgent: false, jours: 14 },
              { id: "4", titre: "Portfolio architecte junior", cat: "PORTFOLIO", budget: 3500, offres: 1, statut: "OUVERTE", urgent: true, jours: 2 },
              { id: "5", titre: "Modélisation BIM complexe", cat: "MAQUETTE_BIM", budget: 12000, offres: 3, statut: "OUVERTE", urgent: false, jours: 10 },
              { id: "6", titre: "Impression reliure mémoire", cat: "IMPRESSION", budget: 900, offres: 6, statut: "TERMINEE", urgent: false, jours: 0 },
            ]
              .filter(d => filterCat === "TOUS" || d.cat === filterCat)
              .filter(d => search === "" || d.titre.toLowerCase().includes(search.toLowerCase()))
              .filter(d => {
                if (filterBudget === "TOUS") return true;
                if (filterBudget === "0-2000") return d.budget < 2000;
                if (filterBudget === "2000-5000") return d.budget >= 2000 && d.budget < 5000;
                if (filterBudget === "5000-10000") return d.budget >= 5000 && d.budget < 10000;
                if (filterBudget === "10000+") return d.budget >= 10000;
                return true;
              })
              .map((d) => (
                <Link key={d.id} href={`/demandes/${d.id}`}
                  className="group bg-[var(--card)] p-6 hover:bg-[var(--bg2)] transition-all duration-150 relative overflow-hidden block">

                  {/* Accent bar left */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 group-hover:w-1 transition-all duration-150"
                    style={{ background: d.statut === "OUVERTE" ? "var(--accent)" : d.statut === "EN_COURS" ? "#3b82f6" : "var(--border)" }} />

                  {/* Top */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex gap-2 flex-wrap">
                      {d.urgent && (
                        <span className="badge-danger text-[9px]">⚡ URGENT</span>
                      )}
                      <span className="badge-outline text-[9px]">{CAT_LABELS[d.cat]}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 border"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        borderColor: d.statut === "OUVERTE" ? "var(--accent)" : d.statut === "EN_COURS" ? "#3b82f6" : "var(--border)",
                        color: d.statut === "OUVERTE" ? "var(--accent)" : d.statut === "EN_COURS" ? "#3b82f6" : "var(--muted)",
                      }}>
                      {d.statut}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base leading-tight mb-4 group-hover:text-[var(--accent)] transition-colors duration-150"
                    style={{ color: "var(--ink)" }}>
                    {d.titre.toUpperCase()}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-[10px] font-mono mb-5"
                    style={{ fontFamily: "'Space Mono', monospace", color: "var(--muted)" }}>
                    {d.jours > 0 && (
                      <span style={{ color: d.jours <= 3 ? "var(--accent2)" : "var(--muted)" }}>
                        ⏱ {d.jours}J RESTANTS
                      </span>
                    )}
                    <span>◆ {d.offres} OFFRE{d.offres > 1 ? "S" : ""}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-end justify-between pt-4 border-t border-[var(--border)]">
                    <div>
                      <p className="text-[9px] font-mono text-[var(--muted)] uppercase tracking-widest mb-0.5"
                        style={{ fontFamily: "'Space Mono', monospace" }}>Budget</p>
                      <p className="font-bold text-2xl tracking-tight"
                        style={{ color: "var(--accent)", fontFamily: "'Space Mono', monospace" }}>
                        {d.budget.toLocaleString("fr-DZ")}
                        <span className="text-sm ml-1" style={{ color: "var(--muted)" }}>DA</span>
                      </p>
                    </div>
                    <div className="w-9 h-9 border-2 border-[var(--border)] flex items-center justify-center
                      group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] transition-all duration-150">
                      <ArrowUpRight size={14} className="group-hover:text-black transition-colors duration-150"
                        style={{ color: "var(--muted)" }} />
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          {/* New demand card */}
          <Link href="/dashboard/demandes/nouvelle"
            className="mt-px block bg-[var(--card)] border-2 border-dashed border-[var(--border)]
              hover:border-[var(--accent)] hover:bg-[var(--bg2)] transition-all duration-150 p-10 text-center group">
            <Plus size={24} className="mx-auto mb-3 group-hover:text-[var(--accent)] transition-colors"
              style={{ color: "var(--muted)" }} />
            <p className="text-[11px] font-bold uppercase tracking-widest group-hover:text-[var(--accent)] transition-colors"
              style={{ color: "var(--muted)", fontFamily: "'Space Mono', monospace" }}>
              + NOUVELLE DEMANDE
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
