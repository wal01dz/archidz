// lib/chargily.ts
// Intégration Chargily Pay — Paiement algérien (Edahabia & CIB)
// Doc: https://dev.chargily.com/pay-v2/introduction

import axios from "axios";

const chargilyClient = axios.create({
  baseURL: process.env.CHARGILY_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.CHARGILY_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// ── Créer un checkout (lien de paiement)
export async function createCheckout({
  amount,        // en DA
  projetId,
  clientEmail,
  clientName,
  description,
}: {
  amount: number;
  projetId: string;
  clientEmail: string;
  clientName: string;
  description: string;
}) {
  const response = await chargilyClient.post("/checkouts", {
    amount: amount * 100, // Chargily utilise les centimes
    currency: "dzd",
    payment_method: "edahabia", // ou "cib"
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projets/${projetId}?paiement=success`,
    failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projets/${projetId}?paiement=failed`,
    webhook_endpoint: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/chargily`,
    description,
    metadata: {
      projetId,
      clientEmail,
    },
    customer: {
      name: clientName,
      email: clientEmail,
    },
    locale: "fr",
  });

  return response.data;
}

// ── Vérifier le statut d'un paiement
export async function getCheckout(checkoutId: string) {
  const response = await chargilyClient.get(`/checkouts/${checkoutId}`);
  return response.data;
}

// ── Vérifier la signature webhook (sécurité)
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require("crypto");
  const expectedSig = crypto
    .createHmac("sha256", process.env.CHARGILY_WEBHOOK_SECRET!)
    .update(payload)
    .digest("hex");
  return signature === expectedSig;
}

// ── Calculer commission et montant freelance
export function calculerMontants(prixDA: number) {
  const commission = Math.round(prixDA * 0.12); // 12%
  const montantFreelance = prixDA - commission;
  return { montantTotal: prixDA, commission, montantFreelance };
}
