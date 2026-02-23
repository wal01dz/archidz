// app/layout.tsx
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "ArchiDZ — Marketplace des Creatifs Algeriens",
  description: "Rendus 3D, planches, memoires, portfolio. Poste ta demande, recois des offres. Paiement securise via Baridi Mob.",
  keywords: ["architecture algerie", "freelance architecture", "rendu 3D algerie", "ArchiDZ"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={spaceGrotesk.variable} style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#0a0a0a", color: "#f0f0f0" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
