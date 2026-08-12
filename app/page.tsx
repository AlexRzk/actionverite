import Link from "next/link";

export default function HomePage() {
  return (
    <main className="party-home">
      <header className="party-home-header">
        <div className="party-logo">
          <div className="logo-symbol">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <strong>Soirée</strong>
        </div>
      </header>

      <section className="party-home-main">
        <div className="party-hero">
          <span className="party-hero-eyebrow">JEUX DE COMPAGNIE</span>
          <h1>On joue à quoi ?</h1>
          <p>
            Des révélations, des rires et des défis. Posez le téléphone au milieu et laissez le hasard décider.
          </p>
        </div>

        <div className="party-games">
          <Link href="/action-verite" className="party-game-card action-card group">
            <div className="party-card-top">
              <span className="party-game-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <span className="party-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </div>
            <div className="party-card-content">
              <h2>Action Vérité</h2>
              <p>Ajoutez les joueurs, lancez la roulette et laissez le hasard pimenter la soirée.</p>
              <div className="party-card-tags">
                <span>2+ joueurs</span>
                <span>roulette</span>
              </div>
            </div>
          </Link>

          <Link href="/je-nai-jamais" className="party-game-card never-card-home group">
            <div className="party-card-top">
              <span className="party-game-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </span>
              <span className="party-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </div>
            <div className="party-card-content">
              <h2>Je n’ai jamais</h2>
              <p>Une phrase, des révélations inattendues et des discussions animées.</p>
              <div className="party-card-tags">
                <span>groupe</span>
                <span>rapide</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="party-footer">
          <p className="party-footer-note">Choisissez l’ambiance Soft, Spicy ou Hot selon le groupe.</p>
        </div>
      </section>
    </main>
  );
}
