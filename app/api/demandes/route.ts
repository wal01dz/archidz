// app/api/demandes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const demandeSchema = z.object({
  titre: z.string().min(5, "Titre trop court"),
  description: z.string().min(20, "Description trop courte"),
  categorie: z.enum(["RENDU_3D", "PLANCHES", "MAQUETTE_BIM", "MEMOIRE", "PORTFOLIO", "IMPRESSION", "AUTRE"]),
  budget: z.number().min(500, "Budget minimum 500 DA"),
  deadline: z.string().datetime(),
  wilaya: z.string().optional(),
  urgent: z.boolean().default(false),
  fichiers: z.array(z.string()).default([]),
});

// ── GET — Lister les demandes (avec filtres)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorie = searchParams.get("categorie");
  const wilaya = searchParams.get("wilaya");
  const urgent = searchParams.get("urgent");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: any = { statut: "OUVERTE" };
  if (categorie) where.categorie = categorie;
  if (wilaya) where.wilaya = wilaya;
  if (urgent === "true") where.urgent = true;

  const [demandes, total] = await Promise.all([
    prisma.demande.findMany({
      where,
      include: {
        client: { select: { name: true, avatar: true, wilaya: true } },
        _count: { select: { offres: true } },
      },
      orderBy: [{ urgent: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.demande.count({ where }),
  ]);

  return NextResponse.json({ demandes, total, pages: Math.ceil(total / limit) });
}

// ── POST — Créer une demande
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = demandeSchema.parse(body);

    const demande = await prisma.demande.create({
      data: {
        ...data,
        deadline: new Date(data.deadline),
        clientId: (session.user as any).id,
      },
      include: {
        client: { select: { name: true, avatar: true } },
      },
    });

    return NextResponse.json(demande, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error("[DEMANDE CREATE ERROR]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
