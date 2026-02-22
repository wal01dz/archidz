// app/api/offres/[id]/accepter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckout, calculerMontants } from "@/lib/chargily";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const userId = (session.user as any).id;

  // Récupérer l'offre avec toutes les infos nécessaires
  const offre = await prisma.offre.findUnique({
    where: { id: params.id },
    include: {
      demande: { include: { client: true } },
      freelance: true,
    },
  });

  if (!offre) return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
  if (offre.demande.clientId !== userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  if (offre.statut !== "EN_ATTENTE") {
    return NextResponse.json({ error: "Cette offre ne peut plus être acceptée" }, { status: 400 });
  }

  // Transaction DB: accepter l'offre + refuser les autres + créer le projet + créer le paiement
  const { montantTotal, commission, montantFreelance } = calculerMontants(offre.prix);

  const result = await prisma.$transaction(async (tx) => {
    // Accepter cette offre
    await tx.offre.update({ where: { id: params.id }, data: { statut: "ACCEPTEE" } });

    // Refuser toutes les autres offres de la même demande
    await tx.offre.updateMany({
      where: { demandeId: offre.demandeId, id: { not: params.id } },
      data: { statut: "REFUSEE" },
    });

    // Marquer la demande en cours
    await tx.demande.update({
      where: { id: offre.demandeId },
      data: { statut: "EN_COURS" },
    });

    // Créer le projet
    const projet = await tx.projet.create({
      data: {
        demandeId: offre.demandeId,
        offreId: offre.id,
      },
    });

    // Créer le paiement (en attente)
    const paiement = await tx.paiement.create({
      data: {
        projetId: projet.id,
        userId,
        montant: montantTotal,
        commission,
        montantFreelance,
        statut: "EN_ATTENTE",
      },
    });

    return { projet, paiement };
  });

  // Créer le checkout Chargily
  const checkout = await createCheckout({
    amount: montantTotal,
    projetId: result.projet.id,
    clientEmail: offre.demande.client.email,
    clientName: offre.demande.client.name,
    description: `ArchiDZ — ${offre.demande.titre}`,
  });

  // Sauvegarder les infos Chargily
  await prisma.paiement.update({
    where: { id: result.paiement.id },
    data: {
      chargilyId: checkout.id,
      checkoutUrl: checkout.checkout_url,
    },
  });

  // Notifier le freelance
  await sendNotification({
    userId: offre.freelanceId,
    type: "offre_acceptee",
    titre: "🎉 Ton offre a été acceptée !",
    message: `Ton offre de ${offre.prix.toLocaleString("fr-DZ")} DA pour "${offre.demande.titre}" a été acceptée.`,
    lien: `/dashboard/projets/${result.projet.id}`,
  });

  return NextResponse.json({
    projet: result.projet,
    checkoutUrl: checkout.checkout_url,
    message: "Offre acceptée ! Redirige vers le paiement.",
  });
}
