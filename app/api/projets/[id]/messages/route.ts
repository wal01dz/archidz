// app/api/projets/[id]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — Historique des messages
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const userId = (session.user as any).id;

  // Vérifier accès au projet
  const projet = await prisma.projet.findUnique({
    where: { id: params.id },
    include: {
      demande: { select: { clientId: true } },
      offre: { select: { freelanceId: true } },
    },
  });

  if (!projet) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  const hasAccess = userId === projet.demande.clientId || userId === projet.offre.freelanceId;
  if (!hasAccess) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const messages = await prisma.message.findMany({
    where: { projetId: params.id },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Marquer les messages comme lus
  await prisma.message.updateMany({
    where: { projetId: params.id, senderId: { not: userId }, lu: false },
    data: { lu: true },
  });

  return NextResponse.json(messages);
}
