import Link from "next/link";

export default function HomePage() {
  return (
    <main className="party-home">
      <header className="party-home-header">
        <div className="party-logo">
          <span>SO</span>
          <strong>Soirée</strong>
        </div>
      </header>

      <section className="party-home-main">
        <div className="party-hero">
          <span>JEUX ENTRE AMIS</span>
          <h1>On joue à quoi ?</h1>
          <p>Choisis un jeu, pose le téléphone au milieu et lance la partie.</p>
        </div>

        <div className="party-games">
          <Link href="/action-verite" className="party-game-card action-card">
            <div className="party-card-top">
              <span className="party-game-icon">A/V</span>
              <span className="party-arrow">→</span>
            </div>
            <div>
              <h2>Action Vérité</h2>
              <p>Ajoute les joueurs, tourne la roulette et laisse le hasard choisir.</p>
              <div className="party-card-tags"><span>2+ joueurs</span><span>roulette</span></div>
            </div>
          </Link>

          <Link href="/je-nai-jamais" className="party-game-card never-card-home">
            <div className="party-card-top">
              <span className="party-game-icon">J/N</span>
              <span className="party-arrow">→</span>
            </div>
            <div>
              <h2>Je n’ai jamais</h2>
              <p>Une phrase, des révélations et beaucoup de discussions qui partent toutes seules.</p>
              <div className="party-card-tags"><span>groupe</span><span>rapide</span></div>
            </div>
          </Link>
        </div>

        <p className="party-footer-note">Soft, Spicy ou Hot selon l’ambiance.</p>
      </section>
    </main>
  );
}
