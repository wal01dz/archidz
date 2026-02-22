// app/api/projets/[id]/avis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const avisSchema = z.object({
  note: z.number().min(1).max(5),
  commentaire: z.string().min(1),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const userId = (session.user as any).id;

  const projet = await prisma.projet.findUnique({
    where: { id: params.id },
    include: {
      demande: { select: { clientId: true } },
      offre: { select: { freelanceId: true } },
      avis: true,
    },
  });

  if (!projet) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  if (projet.demande.clientId !== userId) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  if (projet.statut !== "VALIDE") return NextResponse.json({ error: "Projet pas encore validé" }, { status: 400 });
  if (projet.avis) return NextResponse.json({ error: "Tu as déjà laissé un avis" }, { status: 400 });

  const body = await req.json();
  const { note, commentaire } = avisSchema.parse(body);

  // Créer l'avis
  const avis = await prisma.avis.create({
    data: {
      projetId: params.id,
      auteurId: userId,
      cibleId: projet.offre.freelanceId,
      note,
      commentaire,
    },
  });

  // Recalculer la note globale du freelance
  const avgResult = await prisma.avis.aggregate({
    where: { cibleId: projet.offre.freelanceId },
    _avg: { note: true },
    _count: { note: true },
  });

  await prisma.freelanceProfile.updateMany({
    where: { userId: projet.offre.freelanceId },
    data: {
      noteGlobale: Math.round((avgResult._avg.note || 0) * 10) / 10,
      totalAvis: avgResult._count.note,
    },
  });

  return NextResponse.json(avis, { status: 201 });
}
