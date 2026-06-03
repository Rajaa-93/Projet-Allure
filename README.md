# Projet Allure

Application Next.js 16 orientée mobile pour explorer un catalogue mode, gérer un panier et finaliser une commande avec Stripe Checkout Embedded en mode test.

## Installation

```bash
npm install
```

## Variables d'environnement

Créez votre fichier local à partir de l'exemple fourni :

```bash
cp .env.local.example .env.local
```

Renseignez ensuite vos clés Stripe de test dans `.env.local` :

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_a_remplacer
STRIPE_SECRET_KEY=sk_test_a_remplacer
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
```

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : clé publique Stripe utilisée côté client.
- `STRIPE_SECRET_KEY` : clé secrète Stripe utilisée uniquement côté serveur.
- `NEXT_PUBLIC_APP_URL` : URL locale de l'application pour les retours Stripe.

`/.env.local` reste ignoré par Git.

## Lancer le projet

```bash
npm run dev -- --hostname 127.0.0.1
```

Ouvrez ensuite [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Paiement Stripe en mode test

Le bouton `Passer la commande` du panier ouvre une page `/paiement` qui initialise Stripe Checkout Embedded.

Carte de test recommandée :

- numéro : `4242 4242 4242 4242`
- date : une date future, par exemple `12/34`
- CVC : `123`
- code postal : n'importe quelle valeur valide

Cette intégration fonctionne uniquement en mode test et ne débite aucun argent réel.

## Vérifications utiles

```bash
npm run lint
npm run build
```
