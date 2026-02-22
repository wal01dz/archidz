// app/layout.tsx
import type { Metadata } from "next";
import { Syne, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "ArchiDZ — Marketplace des Créatifs Algériens",
  description:
    "Rendus 3D, planches, mémoires, portfolio — Poste ta demande, reçois des offres compétitives. Paiement sécurisé via Baridi Mob.",
  keywords: ["architecture algérie", "freelance architecture", "rendu 3D algérie", "ArchiDZ"],
  openGraph: {
    title: "ArchiDZ",
    description: "La marketplace des créatifs algériens",
    locale: "fr_DZ",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${syne.variable} ${instrumentSans.variable} font-instrument`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
