// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--bg)]">
      <div className="text-center">
        <p className="font-syne font-extrabold text-[8rem] leading-none text-gold opacity-20 select-none">404</p>
        <h1 className="font-syne font-extrabold text-3xl text-[var(--ink)] -mt-8 mb-3">Page introuvable</h1>
        <p className="text-[var(--muted)] mb-8 max-w-xs mx-auto">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Retour à l'accueil</Link>
          <Link href="/demandes" className="btn-secondary">Voir les demandes</Link>
        </div>
      </div>
    </div>
  );
}
