export type GameMode = "soft" | "spicy" | "hot";
export type ChallengeType = "truth" | "dare";

export type Challenge = {
  id: string;
  type: ChallengeType;
  text: string;
};

export const modeLabels: Record<GameMode, { label: string; emoji: string; description: string }> = {
  soft: {
    label: "Soft",
    emoji: "✨",
    description: "Drôle, léger et parfait pour lancer la soirée.",
  },
  spicy: {
    label: "Spicy",
    emoji: "🌶️",
    description: "Plus personnel, plus gênant, plus flirt.",
  },
  hot: {
    label: "Hot",
    emoji: "🔥",
    description: "Flirt assumé et défis plus osés. Réservé aux adultes.",
  },
};

export const challenges: Record<GameMode, Challenge[]> = {
  soft: [
    { id: "s-t-01", type: "truth", text: "Quel est ton plus gros talent inutile ?" },
    { id: "s-t-02", type: "truth", text: "Quelle est la chose la plus gênante que tu aies faite pour impressionner quelqu’un ?" },
    { id: "s-t-03", type: "truth", text: "Quel est ton dernier mensonge vraiment inutile ?" },
    { id: "s-t-04", type: "truth", text: "Avec qui ici survivrais-tu le mieux à une apocalypse ?" },
    { id: "s-t-05", type: "truth", text: "Quelle habitude bizarre fais-tu uniquement quand tu es seul·e ?" },
    { id: "s-t-06", type: "truth", text: "Quel est ton pire achat impulsif ?" },
    { id: "s-t-07", type: "truth", text: "Quelle chanson connais-tu beaucoup trop bien par cœur ?" },
    { id: "s-t-08", type: "truth", text: "Quelle première impression les gens ont souvent de toi et qui est fausse ?" },
    { id: "s-t-09", type: "truth", text: "Si tu pouvais échanger ta vie avec quelqu’un pendant 24 h, qui choisirais-tu ?" },
    { id: "s-t-10", type: "truth", text: "Quel est le message le plus embarrassant que tu aies envoyé à la mauvaise personne ?" },
    { id: "s-a-01", type: "dare", text: "Imite un autre joueur jusqu’à ce que quelqu’un trouve qui c’est." },
    { id: "s-a-02", type: "dare", text: "Fais une déclaration dramatique à l’objet le plus proche de toi." },
    { id: "s-a-03", type: "dare", text: "Laisse le groupe choisir un mot que tu dois placer naturellement dans les 3 prochaines minutes." },
    { id: "s-a-04", type: "dare", text: "Fais 15 secondes de pub improvisée pour la personne à ta droite." },
    { id: "s-a-05", type: "dare", text: "Parle avec un accent choisi par le groupe jusqu’à ton prochain tour." },
    { id: "s-a-06", type: "dare", text: "Montre ta meilleure pose de photo de profil pendant 10 secondes." },
    { id: "s-a-07", type: "dare", text: "Invente un surnom à chaque joueur en moins de 20 secondes." },
    { id: "s-a-08", type: "dare", text: "Fais deviner un film uniquement avec des bruitages." },
    { id: "s-a-09", type: "dare", text: "Raconte une anecdote banale comme si c’était la bande-annonce d’un film d’action." },
    { id: "s-a-10", type: "dare", text: "Fais un compliment sincère à la personne désignée par le groupe." },
  ],
  spicy: [
    { id: "p-t-01", type: "truth", text: "Qui ici correspond le plus à ton type physiquement ?" },
    { id: "p-t-02", type: "truth", text: "Quel est ton plus gros red flag chez quelqu’un ?" },
    { id: "p-t-03", type: "truth", text: "As-tu déjà stalké quelqu’un beaucoup plus longtemps que tu ne veux l’avouer ?" },
    { id: "p-t-04", type: "truth", text: "Quel compliment te fait craquer presque à tous les coups ?" },
    { id: "p-t-05", type: "truth", text: "Quelle est la chose la plus audacieuse que tu aies faite pour séduire quelqu’un ?" },
    { id: "p-t-06", type: "truth", text: "Avec qui ici partirais-tu volontiers en week-end à deux ?" },
    { id: "p-t-07", type: "truth", text: "Quel détail chez quelqu’un peut immédiatement te rendre attiré·e ?" },
    { id: "p-t-08", type: "truth", text: "As-tu déjà fait semblant de ne pas être intéressé·e alors que tu l’étais vraiment ?" },
    { id: "p-t-09", type: "truth", text: "Quel est le rendez-vous amoureux le plus mémorable que tu aies eu ?" },
    { id: "p-t-10", type: "truth", text: "Qui ici te semble le plus difficile à séduire ?" },
    { id: "p-a-01", type: "dare", text: "Fais ton meilleur regard de séduction à la personne de ton choix pendant 5 secondes." },
    { id: "p-a-02", type: "dare", text: "Donne à quelqu’un ici un compliment que tu n’oserais pas lui envoyer par message." },
    { id: "p-a-03", type: "dare", text: "Laisse le groupe choisir une personne à qui tu dois tenir la main pendant 20 secondes, si elle est d’accord." },
    { id: "p-a-04", type: "dare", text: "Décris ton date idéal en 20 secondes comme si tu essayais de convaincre quelqu’un ici de venir." },
    { id: "p-a-05", type: "dare", text: "Chuchote une phrase de drague improvisée à la personne de ton choix." },
    { id: "p-a-06", type: "dare", text: "Fais un classement totalement subjectif des 3 meilleures énergies du groupe, sans parler du physique." },
    { id: "p-a-07", type: "dare", text: "Choisis quelqu’un et maintiens un eye contact pendant 10 secondes sans rire." },
    { id: "p-a-08", type: "dare", text: "Laisse une personne du groupe choisir une photo de toi à afficher pendant 30 secondes." },
    { id: "p-a-09", type: "dare", text: "Invente un scénario de premier rendez-vous avec la personne tirée au sort." },
    { id: "p-a-10", type: "dare", text: "Fais un mini slow de 15 secondes avec un volontaire du groupe." },
  ],
  hot: [
    { id: "h-t-01", type: "truth", text: "Qui ici t’intrigue le plus sur le plan de l’attirance ?" },
    { id: "h-t-02", type: "truth", text: "Quelle est la situation la plus intense dans laquelle tu as déjà flirté avec quelqu’un ?" },
    { id: "h-t-03", type: "truth", text: "Quel geste ou quelle attitude te fait le plus facilement perdre tes moyens ?" },
    { id: "h-t-04", type: "truth", text: "Si tu devais embrasser une personne ici, qui choisirais-tu ?" },
    { id: "h-t-05", type: "truth", text: "Quel est ton plus gros turn-on non explicite chez quelqu’un ?" },
    { id: "h-t-06", type: "truth", text: "As-tu déjà eu un crush secret sur quelqu’un qui n’en a jamais rien su ?" },
    { id: "h-t-07", type: "truth", text: "Quel est le message de flirt le plus direct que tu aies déjà envoyé ?" },
    { id: "h-t-08", type: "truth", text: "Quelle personne ici pourrait le plus facilement te faire rougir ?" },
    { id: "h-t-09", type: "truth", text: "Quel moment de tension romantique t’a le plus marqué ?" },
    { id: "h-t-10", type: "truth", text: "Qu’est-ce qui te fait sentir immédiatement qu’il y a une vraie alchimie avec quelqu’un ?" },
    { id: "h-a-01", type: "dare", text: "Choisis quelqu’un et dis-lui, sans détour, ce que tu trouves le plus attirant chez lui ou elle." },
    { id: "h-a-02", type: "dare", text: "Fais un eye contact silencieux de 15 secondes avec la personne de ton choix." },
    { id: "h-a-03", type: "dare", text: "Si vous êtes tous les deux d’accord, fais un bisou sur la joue à la personne tirée au sort." },
    { id: "h-a-04", type: "dare", text: "Approche-toi d’un volontaire et murmure-lui le meilleur compliment de flirt que tu puisses inventer." },
    { id: "h-a-05", type: "dare", text: "Laisse le groupe choisir une personne avec qui faire un slow de 20 secondes, uniquement si vous êtes tous les deux partants." },
    { id: "h-a-06", type: "dare", text: "Choisis quelqu’un et décris en une phrase ce qui ferait de vous un duo dangereux en soirée." },
    { id: "h-a-07", type: "dare", text: "Fais une déclaration de crush fictive ultra convaincante à la personne de ton choix." },
    { id: "h-a-08", type: "dare", text: "Laisse quelqu’un te poser une question de flirt supplémentaire ; tu peux passer sans justification." },
    { id: "h-a-09", type: "dare", text: "Choisis quelqu’un et reste à moins d’un bras de distance pendant 20 secondes, seulement si cette personne est d’accord." },
    { id: "h-a-10", type: "dare", text: "Dis à la personne de ton choix quelle serait ton idée d’un rendez-vous vraiment mémorable avec elle." },
  ],
};
