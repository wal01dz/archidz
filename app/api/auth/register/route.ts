// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Mot de passe trop court (min 8 caractères)"),
  role: z.enum(["CLIENT", "FREELANCE"]),
  wilaya: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        wilaya: data.wilaya,
        phone: data.phone,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (data.role === "FREELANCE") {
      await prisma.freelanceProfile.create({
        data: {
          userId: user.id,
          titre: "",
          specialites: [],
          logiciels: [],
          tarifMin: 0,
          tarifMax: 0,
          portfolio: [],
        },
      });
    }

    return NextResponse.json({ user, message: "Compte créé avec succès" }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    console.error("[REGISTER ERROR]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
