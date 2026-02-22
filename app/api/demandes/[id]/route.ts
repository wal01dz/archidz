// app/api/demandes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const demande = await prisma.demande.findUnique({
    where: { id: params.id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          avatar: true,
          wilaya: true,
          createdAt: true,
          _count: { select: { demandesAsClient: true } },
        },
      },
      offres: {
        include: {
          freelance: {
            select: {
              id: true,
              name: true,
              avatar: true,
              wilaya: true,
              freelanceProfile: {
                select: {
                  titre: true,
                  noteGlobale: true,
                  totalProjets: true,
                  totalAvis: true,
                  specialites: true,
                  logiciels: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { offres: true } },
    },
  });

  if (!demande) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }

  // Vérifier si le freelance connecté a déjà soumis une offre
  let dejaOffert = false;
  if (session && (session.user as any).role === "FREELANCE") {
    const existante = await prisma.offre.findFirst({
      where: { demandeId: params.id, freelanceId: (session.user as any).id },
    });
    dejaOffert = !!existante;
  }

  return NextResponse.json({ demande, dejaOffert });
}
