# 🚀 ArchiDZ — Guide de lancement complet

---

## Ce que tu as dans ce projet

```
archidz/
├── app/                        Pages et API (Next.js 14)
│   ├── page.tsx                → Landing page (ta landing HTML adaptée)
│   ├── login/ & register/      → Connexion & inscription
│   ├── demandes/               → Liste + Détail demandes publiques
│   ├── dashboard/              → Espace client et freelance
│   │   ├── demandes/           → Mes demandes (client)
│   │   ├── opportunites/       → Demandes ouvertes (freelance)
│   │   └── projets/            → Projets en cours
│   └── api/                    → Backend complet
│       ├── auth/               → Login + Inscription
│       ├── demandes/           → CRUD demandes + offres
│       ├── offres/             → Accepter une offre
│       ├── projets/            → Livraison + validation + messages
│       ├── notifications/      → Système de notifs
│       └── webhooks/chargily/  → Paiements automatiques
├── components/
│   ├── Navbar.tsx              → Navigation avec auth
│   ├── OffreForm.tsx           → Formulaire d'offre freelance
│   └── OffreCard.tsx           → Carte offre avec bouton accepter
├── lib/
│   ├── auth.ts                 → NextAuth config
│   ├── prisma.ts               → Client base de données
│   ├── chargily.ts             → Paiement Edahabia/CIB
│   └── cloudinary.ts           → Upload fichiers
├── prisma/schema.prisma        → Schéma DB (9 tables)
├── server.js                   → Serveur Node.js avec Socket.io
└── .env.example                → Variables à configurer
```

---

## ÉTAPE 1 — Installer les outils (si pas encore fait)

### Node.js
Télécharge Node.js 18 LTS sur https://nodejs.org
Vérifie l'installation :
```bash
node --version   # doit afficher v18.x.x ou plus
npm --version    # doit afficher 9.x.x ou plus
```

### PostgreSQL
**Option A — Local (recommandé pour développement)**
Télécharge PostgreSQL sur https://www.postgresql.org/download/
Lors de l'installation, retiens bien :
- Mot de passe postgres : ex. `monmotdepasse`
- Port : `5432` (par défaut)

**Option B — Cloud gratuit (plus simple)**
Va sur https://neon.tech → crée un compte gratuit
→ "New Project" → copie l'URL de connexion directement (déjà formatée)

---

## ÉTAPE 2 — Extraire et installer le projet

```bash
# 1. Extraire le ZIP
unzip archidz-final.zip
cd archidz

# 2. Installer toutes les dépendances
npm install
```

---

## ÉTAPE 3 — Configurer les variables d'environnement

```bash
# Copier le fichier exemple
cp .env.example .env.local
```

Ouvre `.env.local` dans ton éditeur (VS Code, Notepad++...) et remplis :

### 3.1 — Base de données
```
# Si PostgreSQL local :
DATABASE_URL="postgresql://postgres:TONMOTDEPASSE@localhost:5432/archidz"

# Si Neon.tech (cloud) :
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/archidz?sslmode=require"
```

### 3.2 — NextAuth (sécurité sessions)
```
NEXTAUTH_SECRET="une-chaine-aleatoire-de-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"
```
Pour générer un secret sécurisé, utilise : https://generate-secret.vercel.app/32

### 3.3 — Cloudinary (stockage des fichiers uploadés)
1. Va sur https://cloudinary.com → "Sign up for free"
2. Dashboard → ton Cloud name, API Key, API Secret
```
CLOUDINARY_CLOUD_NAME="ton-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz"
```

### 3.4 — Chargily Pay (paiement algérien)
1. Va sur https://chargily.com → "Créer un compte marchand"
2. Dashboard → API → Générer les clés de TEST d'abord
```
CHARGILY_API_KEY="test_sk_xxxxxxxxxxxxxxxxxxxxx"
CHARGILY_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxx"
CHARGILY_BASE_URL="https://pay.chargily.net/test/api/v2"
```
⚠️ Garde le mode TEST jusqu'à ce que tu sois prêt pour la production.

### 3.5 — URL de l'app
```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_COMMISSION_RATE="12"
```

---

## ÉTAPE 4 — Créer la base de données

```bash
# Créer toutes les tables automatiquement
npm run db:push

# Tu devrais voir : "Your database is now in sync with your Prisma schema"
```

Pour visualiser la base de données dans une interface graphique :
```bash
npm run db:studio
# → Ouvre http://localhost:5555 dans ton navigateur
```

---

## ÉTAPE 5 — Lancer le projet

### En développement (le plus simple)
```bash
npm run dev
```
→ Ouvre http://localhost:3000 dans ton navigateur 🎉

### En production (avec Socket.io pour le chat)
```bash
npm run build   # Compiler le projet (1 seule fois)
npm start       # Lancer avec Socket.io activé
```

---

## ÉTAPE 6 — Tester que tout marche

### ✅ Checklist de test

**Inscription & Connexion**
- [ ] Va sur http://localhost:3000/register
- [ ] Crée un compte "Client" avec ton email
- [ ] Crée un deuxième compte "Freelance" (email différent, fenêtre privée)

**Poster une demande (compte Client)**
- [ ] Dashboard → "Nouvelle demande"
- [ ] Remplis les 3 étapes du formulaire
- [ ] Vérifie que la demande apparaît sur /demandes

**Soumettre une offre (compte Freelance)**
- [ ] Va sur /demandes → clique sur la demande créée
- [ ] Remplis le formulaire d'offre
- [ ] Vérifie que le calcul "tu recevras X DA" s'affiche

**Accepter une offre (compte Client)**
- [ ] Dashboard → Mes demandes → clique sur ta demande
- [ ] Tu vois l'offre du freelance
- [ ] Clique "Accepter cette offre"
- [ ] Tu es redirigé vers Chargily Pay (page de test)

**Paiement de test Chargily**
- [ ] Sur la page Chargily test, utilise le numéro Edahabia fictif : `5555 5555 5555 5555`
- [ ] Valide le paiement
- [ ] Tu es redirigé vers ton dashboard avec le projet créé

---

## ÉTAPE 7 — Déployer en ligne (Railway.app)

### 7.1 — Prépare ton code sur GitHub
```bash
git init
git add .
git commit -m "Initial ArchiDZ"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/archidz.git
git push -u origin main
```

### 7.2 — Crée le projet sur Railway
1. Va sur https://railway.app → "Start a New Project"
2. "Deploy from GitHub repo" → sélectionne ton repo
3. Clique le bouton "+" → "Database" → "PostgreSQL"
   → Railway crée la DB et ajoute DATABASE_URL automatiquement

### 7.3 — Configure les variables d'environnement sur Railway
Dans ton projet Railway → "Variables" → ajoute :
```
NEXTAUTH_SECRET=          (ton secret)
NEXTAUTH_URL=             https://TON-SOUS-DOMAINE.railway.app
CLOUDINARY_CLOUD_NAME=    (depuis cloudinary.com)
CLOUDINARY_API_KEY=       (depuis cloudinary.com)
CLOUDINARY_API_SECRET=    (depuis cloudinary.com)
CHARGILY_API_KEY=         (depuis chargily.com — prod cette fois)
CHARGILY_WEBHOOK_SECRET=  (depuis chargily.com)
CHARGILY_BASE_URL=        https://pay.chargily.net/api/v2
NEXT_PUBLIC_APP_URL=      https://TON-SOUS-DOMAINE.railway.app
NEXT_PUBLIC_COMMISSION_RATE= 12
```

### 7.4 — Configure le webhook Chargily
Sur le dashboard Chargily → Webhooks → Ajouter :
```
URL: https://TON-SOUS-DOMAINE.railway.app/api/webhooks/chargily
```

### 7.5 — Déploiement automatique
Railway détecte le `npm start` dans package.json et déploie automatiquement.
Chaque `git push` sur main redéploie le site.

---

## ❓ Problèmes fréquents

**"Cannot find module @prisma/client"**
```bash
npm run db:generate
```

**"PrismaClientInitializationError"**
→ Vérifie que PostgreSQL tourne et que DATABASE_URL est correct dans .env.local

**"NEXTAUTH_SECRET is not set"**
→ Vérifie que .env.local existe (pas juste .env.example)

**La page de paiement Chargily ne s'ouvre pas**
→ Vérifie que CHARGILY_API_KEY commence par `test_sk_` en développement

**"Module not found: lucide-react"**
```bash
npm install
```

---

## 📞 Prochaines étapes recommandées

1. **Chat temps réel** — Socket.io est déjà configuré dans server.js, il faut créer le composant frontend
2. **Validation livrable** — La route API `/api/projets/[id]/valider` existe, il faut la page frontend
3. **Profil freelance** — Page d'édition du profil avec upload portfolio
4. **Page d'accueil** — Intégrer ta landing page HTML dans `app/page.tsx`
5. **Emails** — Configurer Nodemailer pour les notifications par email

---

## 💡 Commandes utiles

```bash
npm run dev          # Lancer en développement (localhost:3000)
npm run db:studio    # Interface graphique base de données (localhost:5555)
npm run db:push      # Synchroniser le schéma DB
npm run build        # Compiler pour la production
npm start            # Lancer en production avec Socket.io
```
