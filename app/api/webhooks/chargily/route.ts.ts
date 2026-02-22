// app/api/webhooks/chargily/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/chargily";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("signature") || "";

  if (!verifyWebhookSignature(payload, signature)) {
    console.error("[WEBHOOK] Signature invalide");
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  const event = JSON.parse(payload);

  if (event.type === "checkout.paid") {
    const { id: chargilyId, metadata } = event.data;
    const projetId = metadata?.projetId;

    if (!projetId) return NextResponse.json({ ok: true });

    // Trouver le paiement par projetId
    const existing = await prisma.paiement.findUnique({ where: { projetId } });
    if (!existing) return NextResponse.json({ ok: true });

    const paiement = await prisma.paiement.update({
      where: { id: existing.id },
      data: { statut: "PAYE", payeAt: new Date(), chargilyId },
      include: {
        projet: {
          include: {
            offre: { include: { freelance: true } },
            demande: { include: { client: true } },
          },
        },
      },
    });

    await sendNotification({
      userId: paiement.projet.offre.freelanceId,
      type: "paiement_securise",
      titre: "💰 Paiement sécurisé reçu",
      message: `Le client a payé ${paiement.montant.toLocaleString("fr-DZ")} DA. L'argent sera libéré après validation.`,
      lien: `/dashboard/projets/${projetId}`,
    });

    await sendNotification({
      userId: paiement.projet.demande.clientId,
      type: "paiement_confirme",
      titre: "✅ Paiement confirmé",
      message: "Ton paiement a été sécurisé. Le freelance peut maintenant commencer.",
      lien: `/dashboard/projets/${projetId}`,
    });
  }

  return NextResponse.json({ ok: true });
}
