# ArchiDZ 🏗️
## Marketplace des Créatifs & Étudiants Algériens

---

## Stack Technique

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Backend | API Routes Next.js (Node.js) |
| Base de données | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (email/password) |
| Fichiers | Cloudinary |
| Paiement | Chargily Pay (Edahabia & CIB) |
| Hébergement | Railway.app (recommandé) |

---

## Installation locale

### 1. Prérequis
- Node.js 18+
- PostgreSQL installé localement (ou compte [Neon.tech](https://neon.tech) gratuit)

### 2. Cloner et installer
```bash
# Clone le projet
git clone <ton-repo>
cd archidz

# Installe les dépendances
npm install
```

### 3. Variables d'environnement
```bash
# Copie le fichier exemple
cp .env.example .env.local

# Édite .env.local avec tes vraies valeurs :
# - DATABASE_URL (PostgreSQL)
# - NEXTAUTH_SECRET (génère avec: openssl rand -base64 32)
# - CLOUDINARY_* (compte gratuit sur cloudinary.com)
# - CHARGILY_* (compte sur chargily.com)
```

### 4. Base de données
```bash
# Applique le schéma Prisma
npm run db:push

# (Optionnel) Lance Prisma Studio pour voir les données
npm run db:studio
```

### 5. Lancer en développement
```bash
npm run dev
# → http://localhost:3000
```

---

## Structure du projet

```
archidz/
├── app/
│   ├── (pages publiques)
│   │   ├── page.tsx              # Landing page
│   │   ├── demandes/page.tsx     # Liste des demandes
│   │   ├── demandes/[id]/page.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/                # Espace connecté
│   │   ├── layout.tsx            # Sidebar + auth guard
│   │   ├── page.tsx              # Dashboard accueil
│   │   ├── demandes/             # Gestion demandes client
│   │   ├── projets/              # Projets en cours
│   │   └── profil/               # Mon profil
│   └── api/                      # Backend API
│       ├── auth/                 # NextAuth + Register
│       ├── demandes/             # CRUD demandes
│       ├── offres/               # CRUD offres
│       ├── projets/              # Gestion projets
│       ├── notifications/        # Notifications
│       ├── upload/               # Upload Cloudinary
│       └── webhooks/chargily/    # Paiements webhook
├── components/
│   ├── Navbar.tsx
│   └── ...
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Client Prisma
│   ├── chargily.ts               # Paiement algérien
│   ├── cloudinary.ts             # Upload fichiers
│   └── notifications.ts          # Système notifs
└── prisma/
    └── schema.prisma             # Schéma DB complet
```

---

## Modèles de données

```
User ──────────┬── FreelanceProfile
               ├── Demande (CLIENT)
               ├── Offre (FREELANCE)
               ├── Message
               ├── Avis
               ├── Paiement
               └── Notification

Demande ───────┬── Offre[]
               └── Projet ──────┬── Paiement
                                ├── Message[]
                                └── Avis
```

---

## Flux de paiement (Chargily Pay)

```
1. Client accepte une offre
   → POST /api/offres/[id]/accepter

2. Création du projet + paiement en attente
   → Redirection vers checkout Chargily

3. Client paie via Edahabia ou CIB
   → Chargily notifie via webhook

4. POST /api/webhooks/chargily
   → Paiement marqué comme "PAYE"
   → Argent bloqué (escrow)

5. Freelance livre le travail
   → Projet marqué "LIVRAISON_EN_ATTENTE"

6. Client valide le livrable
   → Paiement libéré au freelance
   → Commission 12% retenue par ArchiDZ
```

---

## Déploiement sur Railway

1. Crée un compte sur [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Ajoute un service PostgreSQL (bouton +)
4. Configure les variables d'environnement dans Railway
5. `npm run build` se lance automatiquement

**Variables Railway à configurer :**
- `DATABASE_URL` → Railway te donne l'URL PostgreSQL automatiquement
- `NEXTAUTH_SECRET` → `openssl rand -base64 32`
- `NEXTAUTH_URL` → ton-domaine.railway.app
- Toutes les clés Cloudinary et Chargily

---

## Clés API à obtenir

### Cloudinary (stockage fichiers)
1. → [cloudinary.com](https://cloudinary.com) → Compte gratuit (25GB)
2. Dashboard → API Keys

### Chargily Pay (paiement DZ)
1. → [chargily.com](https://chargily.com) → Créer un compte marchand
2. Dashboard → API → Générer les clés
3. Utilise le mode TEST d'abord

---

## Commission & Modèle économique

- **Commission** : 12% sur chaque transaction
- **Exemple** : Client paie 10 000 DA → Freelance reçoit 8 800 DA → ArchiDZ garde 1 200 DA
- Calculé automatiquement dans `lib/chargily.ts → calculerMontants()`

---

## Pages à développer (prochaines étapes)

- [ ] `app/demandes/[id]/page.tsx` — Détail demande + liste offres
- [ ] `app/dashboard/projets/[id]/page.tsx` — Espace projet avec chat
- [ ] `app/dashboard/profil/page.tsx` — Édition profil
- [ ] `app/freelances/page.tsx` — Annuaire freelances
- [ ] `app/freelances/[id]/page.tsx` — Profil public freelance
- [ ] `app/api/upload/route.ts` — Upload Cloudinary
- [ ] `app/api/notifications/route.ts` — CRUD notifications
- [ ] Système de messagerie temps réel (Socket.io)
- [ ] Page de validation livrable + libération paiement
- [ ] Système d'avis et notes
- [ ] Emails transactionnels (Nodemailer)

---

## Aide

Pour toute question, crée une issue sur le repo GitHub.
