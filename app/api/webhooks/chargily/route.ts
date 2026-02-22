// app/api/webhooks/chargily/route.ts
// Ce endpoint reçoit les notifications de paiement de Chargily Pay
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/chargily";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("signature") || "";

  // Vérifier l'authenticité du webhook
  if (!verifyWebhookSignature(payload, signature)) {
    console.error("[WEBHOOK] Signature invalide");
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  const event = JSON.parse(payload);
  console.log("[WEBHOOK CHARGILY]", event.type, event.data?.id);

  if (event.type === "checkout.paid") {
    const { id: chargilyId, metadata } = event.data;
    const projetId = metadata?.projetId;

    if (!projetId) return NextResponse.json({ ok: true });

    // Mettre à jour le paiement
    const paiement = await prisma.paiement.update({
      where: { chargilyId },
      data: { statut: "PAYE", payeAt: new Date() },
      include: {
        projet: {
          include: {
            offre: { include: { freelance: true } },
            demande: { include: { client: true } },
          },
        },
      },
    });

    // Notifier le freelance que le paiement est sécurisé
    await sendNotification({
      userId: paiement.projet.offre.freelanceId,
      type: "paiement_securise",
      titre: "💰 Paiement sécurisé reçu",
      message: `Le client a payé ${paiement.montant.toLocaleString("fr-DZ")} DA. L'argent sera libéré après validation du livrable.`,
      lien: `/dashboard/projets/${projetId}`,
    });

    // Notifier le client
    await sendNotification({
      userId: paiement.projet.demande.clientId,
      type: "paiement_confirme",
      titre: "✅ Paiement confirmé",
      message: "Ton paiement a été sécurisé. Le freelance peut maintenant commencer le travail.",
      lien: `/dashboard/projets/${projetId}`,
    });
  }

  return NextResponse.json({ ok: true });
}
