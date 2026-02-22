// app/api/projets/[id]/litige/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const userId = (session.user as any).id;
  const { raison } = await req.json();

  const projet = await prisma.projet.findUnique({
    where: { id: params.id },
    include: {
      demande: { select: { clientId: true, titre: true } },
      offre: { select: { freelanceId: true } },
    },
  });

  if (!projet) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  const isParticipant = userId === projet.demande.clientId || userId === projet.offre.freelanceId;
  if (!isParticipant) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  // Passer en litige
  await prisma.projet.update({
    where: { id: params.id },
    data: { statut: "LITIGE" },
  });

  const otherUserId = userId === projet.demande.clientId
    ? projet.offre.freelanceId
    : projet.demande.clientId;

  // Notifier l'autre partie
  await sendNotification({
    userId: otherUserId,
    type: "litige_ouvert",
    titre: "⚠️ Litige signalé",
    message: `Un litige a été ouvert pour le projet "${projet.demande.titre}". Raison : ${raison}`,
    lien: `/dashboard/projets/${params.id}`,
  });

  return NextResponse.json({ message: "Litige signalé. L'équipe ArchiDZ va intervenir." });
}
