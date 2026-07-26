# Boutique — Vêtements, Bijoux, Chaussures

Site e-commerce Next.js avec espace admin et paiement à la livraison.

## Fonctionnalités

**Admin** (connexion requise) :
- Modifier l'apparence du site (nom, logo, couleur)
- Ajouter / modifier / supprimer des produits (nom, prix, tailles, quantité, images, catégorie)
- Recevoir une notification par email + dans le dashboard à chaque nouvelle commande

**Client** (sans compte) :
- Voir les produits publiés
- Ajouter au panier
- Passer commande avec nom, téléphone, localisation
- Paiement à la livraison

## Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer une base de données Supabase (gratuit)

1. Va sur [supabase.com](https://supabase.com) → crée un nouveau projet
2. Dans **Project Settings → Database**, copie :
   - la "Connection string" (mode **Transaction**, port 6543) → `DATABASE_URL`
   - la "Connection string" (mode **Session**, port 5432) → `DIRECT_URL`

### 3. Configurer les variables d'environnement

Copie `.env.example` en `.env` et remplis les valeurs :

```bash
cp .env.example .env
```

- `DATABASE_URL` / `DIRECT_URL` : depuis Supabase (étape 2)
- `NEXTAUTH_SECRET` : génère une valeur avec `openssl rand -base64 32`
- `RESEND_API_KEY` : crée un compte gratuit sur [resend.com](https://resend.com) pour l'envoi d'emails
- `ADMIN_NOTIFICATION_EMAIL` : ton email pour recevoir les notifications de commande
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` etc. : crée un compte gratuit sur [cloudinary.com](https://cloudinary.com) pour héberger les images produits (tu peux aussi simplement coller des URLs d'images hébergées ailleurs, le champ image accepte n'importe quelle URL)

### 4. Initialiser la base de données

```bash
npx prisma migrate dev --name init
```

### 5. Créer le compte admin

```bash
npx tsx prisma/seed-admin.ts
```

Suis les instructions pour définir ton email et mot de passe admin.

### 6. Lancer le site en local

```bash
npm run dev
```

- Site public : http://localhost:3000
- Espace admin : http://localhost:3000/admin/login

## Déploiement (Vercel — gratuit)

1. Pousse ce projet sur un dépôt GitHub
2. Va sur [vercel.com](https://vercel.com) → "New Project" → connecte ton dépôt
3. Ajoute toutes les variables du fichier `.env` dans les "Environment Variables" de Vercel
4. Déploie. Vercel te donne une URL du type `tonsite.vercel.app`

Pense à mettre à jour `NEXTAUTH_URL` avec l'URL finale de production une fois déployé.

## Structure du projet

- `app/(public)` — pages visibles par les clients (accueil, produit, panier, commande)
- `app/admin` — espace admin protégé par authentification
- `app/api` — routes API (produits, commandes, paramètres, auth)
- `prisma/schema.prisma` — modèle de données
- `lib/` — utilitaires (connexion base de données, authentification, envoi d'emails)
