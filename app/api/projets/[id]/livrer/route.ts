// app/api/projets/[id]/livrer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/cloudinary";
import { sendNotification } from "@/lib/notifications";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const userId = (session.user as any).id;

  const projet = await prisma.projet.findUnique({
    where: { id: params.id },
    include: {
      offre: { select: { freelanceId: true } },
      demande: { select: { clientId: true, titre: true } },
    },
  });

  if (!projet) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  if (projet.offre.freelanceId !== userId) {
    return NextResponse.json({ error: "Réservé au freelance du projet" }, { status: 403 });
  }
  if (!["EN_COURS"].includes(projet.statut)) {
    return NextResponse.json({ error: "Livraison non autorisée dans ce statut" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier sélectionné" }, { status: 400 });
    }

    // Uploader tous les fichiers sur Cloudinary
    const urls: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const url = await uploadFile(buffer, file.name, "archidz/livrables");
      urls.push(url);
    }

    // Mettre à jour le projet
    await prisma.projet.update({
      where: { id: params.id },
      data: {
        statut: "LIVRAISON_EN_ATTENTE",
        livrables: { push: urls },
      },
    });

    // Notifier le client
    await sendNotification({
      userId: projet.demande.clientId,
      type: "livraison_recue",
      titre: "📦 Livraison reçue !",
      message: `Le freelance a livré le travail pour "${projet.demande.titre}". Vérifie et valide !`,
      lien: `/dashboard/projets/${params.id}`,
    });

    return NextResponse.json({ urls, message: "Livrable envoyé avec succès" });
  } catch (err) {
    console.error("[LIVRER ERROR]", err);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
