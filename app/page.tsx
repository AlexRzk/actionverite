import Link from "next/link";
import { GameMenu } from "@/app/components/game-menu";

export default function HomePage() {
  return (
    <main className="party-home">
      <header className="party-home-header">
        <GameMenu current="home" />
      </header>

      <section className="party-home-main">
        <div className="party-hero">
          <span className="party-hero-eyebrow">LA TABLE EST À VOUS</span>
          <h1>Choisissez votre jeu.</h1>
          <p>
            Deux jeux, un téléphone au milieu, et une soirée qui commence vraiment.
          </p>
        </div>

        <div className="party-games">
          <Link href="/action-verite" className="party-game-card action-card">
            <div className="party-card-art party-card-art-action" aria-hidden="true">
              <span className="party-art-dial" />
              <span className="party-art-label">A/V</span>
              <span className="party-art-pin" />
            </div>
            <div className="party-card-content">
              <div className="party-card-kicker">LE HASARD DÉCIDE</div>
              <h2>Action Vérité</h2>
              <p>La roulette choisit le joueur. Le groupe choisit la suite.</p>
              <span className="party-card-cta">Lancer la roulette <span aria-hidden="true">↗</span></span>
            </div>
          </Link>

          <Link href="/je-nai-jamais" className="party-game-card never-card-home">
            <div className="party-card-art party-card-art-never" aria-hidden="true">
              <span className="party-art-sheet party-art-sheet-back" />
              <span className="party-art-sheet party-art-sheet-front">J/N</span>
              <span className="party-art-dot party-art-dot-one" />
              <span className="party-art-dot party-art-dot-two" />
            </div>
            <div className="party-card-content">
              <div className="party-card-kicker">UNE PHRASE SUFFIT</div>
              <h2>Je n’ai jamais</h2>
              <p>Une carte tombe. Les regards se croisent. Les histoires sortent.</p>
              <span className="party-card-cta">Tirer une carte <span aria-hidden="true">↗</span></span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
