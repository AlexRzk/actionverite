# Action Vérité

Jeu de soirée **Action ou Vérité** construit avec Next.js et pensé pour être déployé directement sur Vercel.

## Fonctionnalités

- Ajout et suppression de 2 à 12 joueurs
- Roulette animée avec sélection aléatoire d'un joueur
- Modes **Soft**, **Spicy** et **Hot**
- Activation/désactivation indépendante des Actions et des Vérités
- Catalogue de défis entièrement statique dans `data/challenges.ts`
- Anti-répétition des cartes pendant une partie
- Bouton **Passer** sans pénalité
- Confirmation 18+ pour le mode Hot
- Sauvegarde locale des joueurs et réglages via `localStorage`
- Responsive mobile / desktop
- Aucun compte, aucune API et aucune base de données

## Développement local

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Déploiement Vercel

1. Importer ce dépôt dans Vercel.
2. Laisser Vercel détecter automatiquement Next.js.
3. Déployer : aucune variable d'environnement n'est requise.

## Ajouter des cartes

Toutes les cartes sont dans `data/challenges.ts`. Chaque entrée possède :

```ts
{
  id: "identifiant-unique",
  type: "truth" | "dare",
  text: "Texte affiché dans le jeu"
}
```

Le mode Spicy inclut les cartes Soft + Spicy. Le mode Hot inclut Soft + Spicy + Hot.

## Principe de sécurité du jeu

Les défis impliquant une autre personne sont formulés avec consentement explicite. N'importe quel joueur peut passer un défi sans avoir à se justifier.
