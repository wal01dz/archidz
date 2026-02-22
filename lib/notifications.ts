// lib/notifications.ts
import { prisma } from "./prisma";

interface NotifPayload {
  userId: string;
  type: string;
  titre: string;
  message: string;
  lien?: string;
}

export async function sendNotification(payload: NotifPayload) {
  return prisma.notification.create({ data: payload });
}

// ── API Route pour récupérer les notifications
// app/api/notifications/route.ts (à créer séparément)
