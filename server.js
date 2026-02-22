// server.js
// Serveur Node.js custom avec Socket.io
// Lance avec: node server.js (en production) ou via next dev + ce fichier séparément

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000");

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // ── Socket.io setup
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Stocker les utilisateurs connectés par projet
  const projectRooms = new Map();

  io.on("connection", (socket) => {
    console.log(`[Socket] Connexion: ${socket.id}`);

    // ── Rejoindre la room d'un projet
    socket.on("join:projet", ({ projetId, userId, userName }) => {
      socket.join(`projet:${projetId}`);
      socket.data.userId = userId;
      socket.data.userName = userName;
      socket.data.projetId = projetId;

      // Notifier les autres que quelqu'un est en ligne
      socket.to(`projet:${projetId}`).emit("user:online", { userId, userName });
      console.log(`[Socket] ${userName} a rejoint le projet ${projetId}`);
    });

    // ── Nouveau message
    socket.on("message:send", async ({ projetId, contenu, senderId, senderName }) => {
      if (!contenu?.trim()) return;

      try {
        // Sauvegarder en DB
        const { PrismaClient } = require("@prisma/client");
        const prisma = new PrismaClient();

        const message = await prisma.message.create({
          data: {
            projetId,
            senderId,
            contenu: contenu.trim(),
          },
          include: {
            sender: { select: { id: true, name: true, avatar: true } }
          }
        });

        await prisma.$disconnect();

        // Broadcaster à toute la room
        io.to(`projet:${projetId}`).emit("message:new", {
          id: message.id,
          contenu: message.contenu,
          createdAt: message.createdAt,
          sender: message.sender,
        });
      } catch (err) {
        console.error("[Socket] Erreur sauvegarde message:", err);
        socket.emit("message:error", { error: "Impossible d'envoyer le message" });
      }
    });

    // ── Indicateur "en train d'écrire"
    socket.on("typing:start", ({ projetId, userName }) => {
      socket.to(`projet:${projetId}`).emit("typing:start", { userName });
    });

    socket.on("typing:stop", ({ projetId }) => {
      socket.to(`projet:${projetId}`).emit("typing:stop");
    });

    // ── Déconnexion
    socket.on("disconnect", () => {
      if (socket.data.projetId && socket.data.userId) {
        socket.to(`projet:${socket.data.projetId}`).emit("user:offline", {
          userId: socket.data.userId,
        });
      }
      console.log(`[Socket] Déconnexion: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`\n🚀 ArchiDZ → http://${hostname}:${port}`);
      console.log(`📡 Socket.io activé\n`);
    });
});
