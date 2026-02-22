// app/api/projets/[id]/valider/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const userId = (session.user as any).id;

  const projet = await prisma.projet.findUnique({
    where: { id: params.id },
    include: {
      demande: { select: { clientId: true, titre: true } },
      offre: { select: { freelanceId: true, prix: true } },
      paiement: true,
    },
  });

  if (!projet) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  if (projet.demande.clientId !== userId) {
    return NextResponse.json({ error: "Réservé au client" }, { status: 403 });
  }
  if (projet.statut !== "LIVRAISON_EN_ATTENTE") {
    return NextResponse.json({ error: "Le projet n'est pas en attente de validation" }, { status: 400 });
  }

  // Transaction : valider le projet + libérer le paiement
  await prisma.$transaction(async (tx) => {
    // Marquer le projet comme validé
    await tx.projet.update({
      where: { id: params.id },
      data: { statut: "VALIDE" },
    });

    // Libérer le paiement
    if (projet.paiement) {
      await tx.paiement.update({
        where: { projetId: params.id },
        data: { statut: "LIBERE", libereAt: new Date() },
      });
    }

    // Mettre à jour les stats du freelance
    await tx.freelanceProfile.updateMany({
      where: { userId: projet.offre.freelanceId },
      data: { totalProjets: { increment: 1 } },
    });
  });

  // Notifier le freelance
  await sendNotification({
    userId: projet.offre.freelanceId,
    type: "paiement_libere",
    titre: "💰 Paiement libéré !",
    message: `Le client a validé ton livrable. ${projet.paiement?.montantFreelance.toLocaleString("fr-DZ") ?? ""} DA ont été libérés.`,
    lien: `/dashboard/projets/${params.id}`,
  });

  return NextResponse.json({ message: "Projet validé et paiement libéré" });
}
