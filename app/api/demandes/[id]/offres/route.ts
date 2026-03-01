// app/api/demandes/[id]/offres/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendNotification } from "@/lib/notifications";

const offreSchema = z.object({
  prix: z.number().min(500, "Prix minimum 500 DA"),
  delai: z.number().min(1, "Délai minimum 1 jour").max(60),
  message: z.string().min(30, "Message trop court (min 30 caractères)"),
});

// ── GET — Offres d'une demande
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const offres = await prisma.offre.findMany({
    where: { demandeId: params.id },
    include: {
      freelance: {
        select: {
          name: true,
          avatar: true,
          freelanceProfile: {
            select: { noteGlobale: true, totalProjets: true, specialites: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(offres);
}

// ── POST — Soumettre une offre (freelance uniquement)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  if ((session.user as any).role !== "FREELANCE") {
    return NextResponse.json({ error: "Réservé aux freelances" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = offreSchema.parse(body);

    // Vérifier que la demande existe et est ouverte
    const demande = await prisma.demande.findUnique({ where: { id: params.id } });
    if (!demande) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    if (demande.statut !== "OUVERTE") {
      return NextResponse.json({ error: "Cette demande n'est plus ouverte" }, { status: 400 });
    }

    // Vérifier qu'il n'a pas déjà soumis une offre
    const existante = await prisma.offre.findFirst({
      where: { demandeId: params.id, freelanceId: (session.user as any).id },
    });
    if (existante) {
      return NextResponse.json({ error: "Tu as déjà soumis une offre" }, { status: 400 });
    }

    const offre = await prisma.offre.create({
      data: {
        ...data,
        demandeId: params.id,
        freelanceId: (session.user as any).id,
      },
    });

    // Notifier le client
    await sendNotification({
      userId: demande.clientId,
      type: "nouvelle_offre",
      titre: "Nouvelle offre reçue !",
      message: `Un freelance a soumis une offre de ${data.prix.toLocaleString("fr-DZ")} DA pour "${demande.titre}"`,
      lien: `/dashboard/demandes/${params.id}`,
    });

    return NextResponse.json(offre, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error("[OFFRE CREATE ERROR]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
