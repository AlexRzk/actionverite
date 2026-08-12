"use client";

import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { GameMenu } from "@/app/components/game-menu";
import {
  Challenge,
  ChallengeType,
  GameMode,
  challenges,
  modeLabels,
} from "@/data/challenges";

type DrawMode = "random" | "player-choice";

const wheelColors = [
  "#e4bd68",
  "#d5765d",
  "#7da7a0",
  "#8b7bc5",
  "#e4bd68",
  "#d5765d",
  "#7da7a0",
  "#8b7bc5",
];

const modePools: Record<GameMode, GameMode[]> = {
  soft: ["soft"],
  spicy: ["soft", "spicy"],
  hot: ["soft", "spicy", "hot"],
};

const modeMeta: Record<GameMode, { number: string; kicker: string }> = {
  soft: { number: "01", kicker: "Pour commencer tranquille" },
  spicy: { number: "02", kicker: "Quand la soirée se chauffe" },
  hot: { number: "03", kicker: "Pour adultes consentants" },
};

function haptic(pattern: number | number[] = 35) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function ModeIcon({ mode, className = "w-5 h-5" }: { mode: GameMode; className?: string }) {
  if (mode === "soft") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M7.757 16.243l-2.121 2.121m12.728 0l-2.121-2.121M7.757 7.757L5.636 5.636" />
      </svg>
    );
  }
  if (mode === "spicy") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 2 .5 3.5 1.5 5h17c1-1.5 1.5-3 1.5-5 0-5.5-4.5-10-10-10z" />
      <path d="M12 6c-3.31 0-6 2.69-6 6M12 9c-1.66 0-3 1.34-3 3" />
    </svg>
  );
}

export default function ActionVeritePage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [mode, setMode] = useState<GameMode>("soft");
  const [drawMode, setDrawMode] = useState<DrawMode>("random");
  const [allowTruth, setAllowTruth] = useState(true);
  const [allowDare, setAllowDare] = useState(true);
  const [phase, setPhase] = useState<"setup" | "game">("setup");
  const [setupStep, setSetupStep] = useState<1 | 2>(1);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [round, setRound] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const usedChallenges = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("action-verite-settings");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          players?: string[];
          mode?: GameMode;
          drawMode?: DrawMode;
          allowTruth?: boolean;
          allowDare?: boolean;
        };

        if (Array.isArray(parsed.players)) {
          setPlayers(
            parsed.players
              .filter((name) => typeof name === "string")
              .map((name) => name.trim().slice(0, 20))
              .filter(Boolean)
              .slice(0, 12),
          );
        }
        if (parsed.mode && parsed.mode in modeLabels) setMode(parsed.mode);
        if (parsed.drawMode === "random" || parsed.drawMode === "player-choice") {
          setDrawMode(parsed.drawMode);
        }
        if (typeof parsed.allowTruth === "boolean") setAllowTruth(parsed.allowTruth);
        if (typeof parsed.allowDare === "boolean") setAllowDare(parsed.allowDare);
      }
    } catch {
      // Local preferences must never block the game.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      "action-verite-settings",
      JSON.stringify({ players, mode, drawMode, allowTruth, allowDare }),
    );
  }, [players, mode, drawMode, allowTruth, allowDare, hydrated]);

  useEffect(() => {
    usedChallenges.current.clear();
    setChallenge(null);
    setSelectedPlayer(null);
  }, [mode, drawMode, allowTruth, allowDare]);

  const challengePool = useMemo(() => {
    const allowedTypes = new Set<ChallengeType>();

    if (drawMode === "player-choice") {
      allowedTypes.add("truth");
      allowedTypes.add("dare");
    } else {
      if (allowTruth) allowedTypes.add("truth");
      if (allowDare) allowedTypes.add("dare");
    }

    return modePools[mode]
      .flatMap((poolMode) => challenges[poolMode])
      .filter((item) => allowedTypes.has(item.type));
  }, [allowDare, allowTruth, drawMode, mode]);

  const wheelBackground = useMemo(() => {
    if (!players.length) return "#24202b";
    const slice = 360 / players.length;
    const stops = players.flatMap((_, index) => {
      const start = index * slice;
      const end = (index + 1) * slice;
      const color = wheelColors[index % wheelColors.length];
      return [`${color} ${start}deg`, `${color} ${end - 1.2}deg`, `#30282d ${end - 1.2}deg`, `#30282d ${end}deg`];
    });
    return `conic-gradient(${stops.join(", ")})`;
  }, [players]);

  function addPlayer(event: FormEvent) {
    event.preventDefault();
    const cleanName = playerName.trim().replace(/\s+/g, " ").slice(0, 20);
    if (!cleanName || players.length >= 12) return;
    if (players.some((player) => player.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) {
      setPlayerName("");
      return;
    }
    setPlayers((current) => [...current, cleanName]);
    setPlayerName("");
    haptic(20);
  }

  function removePlayer(indexToRemove: number) {
    setPlayers((current) => current.filter((_, index) => index !== indexToRemove));
    haptic(15);
  }

  function chooseMode(nextMode: GameMode) {
    setMode(nextMode);
    haptic(20);
  }

  function chooseDrawMode(nextMode: DrawMode) {
    setDrawMode(nextMode);
    if (nextMode === "player-choice") {
      setAllowTruth(true);
      setAllowDare(true);
    }
    haptic(20);
  }

  function goToAmbiance() {
    if (players.length < 2) return;
    setSetupStep(2);
    haptic(20);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startGame() {
    if (players.length < 2) return;
    if (drawMode === "random" && !allowTruth && !allowDare) return;

    usedChallenges.current.clear();
    setChallenge(null);
    setSelectedPlayer(null);
    setRound(0);
    setPhase("game");
    haptic([25, 30, 25]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pickChallenge(type?: ChallengeType) {
    const typedPool = type
      ? challengePool.filter((item) => item.type === type)
      : challengePool;

    if (!typedPool.length) return null;

    let available = typedPool.filter((item) => !usedChallenges.current.has(item.id));

    if (!available.length) {
      typedPool.forEach((item) => usedChallenges.current.delete(item.id));
      available = typedPool;
    }

    const picked = available[Math.floor(Math.random() * available.length)];
    usedChallenges.current.add(picked.id);
    return picked;
  }

  function spinWheel() {
    if (spinning || players.length < 2) return;

    const selectedIndex = Math.floor(Math.random() * players.length);
    const slice = 360 / players.length;
    const selectedCenter = selectedIndex * slice + slice / 2;

    setChallenge(null);
    setSelectedPlayer(null);
    setSpinning(true);
    haptic(25);

    setRotation((currentRotation) => {
      const currentAngle = ((currentRotation % 360) + 360) % 360;
      const targetAngle = (360 - selectedCenter) % 360;
      const correction = (targetAngle - currentAngle + 360) % 360;
      return currentRotation + 1440 + correction;
    });

    window.setTimeout(() => {
      const player = players[selectedIndex];
      setSelectedPlayer(player);
      setRound((current) => current + 1);
      setSpinning(false);

      if (drawMode === "random") {
        setChallenge(pickChallenge());
      }

      haptic([55, 45, 90]);
    }, 3000);
  }

  function chooseChallengeType(type: ChallengeType) {
    setChallenge(pickChallenge(type));
    haptic([30, 25, 45]);
  }

  function replaceChallenge() {
    if (!challenge) return;
    setChallenge(pickChallenge(drawMode === "player-choice" ? challenge.type : undefined));
    haptic(20);
  }

  function nextTurn() {
    setChallenge(null);
    setSelectedPlayer(null);
    haptic(18);
    window.setTimeout(spinWheel, 180);
  }

  function resetGame() {
    setPhase("setup");
    setSetupStep(1);
    setChallenge(null);
    setSelectedPlayer(null);
    setSpinning(false);
    haptic(20);
  }

  const canStart =
    players.length >= 2 &&
    (drawMode === "player-choice" || allowTruth || allowDare);

  return (
    <main className={`app-shell theme-${mode} ${phase === "game" ? "in-game" : ""}`}>
      <header className="app-header">
        <button
          className="app-back-btn"
          type="button"
          onClick={() => {
            if (phase === "game") resetGame();
            else if (setupStep === 2) setSetupStep(1);
            else window.location.href = "/";
          }}
          aria-label="Retour"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <GameMenu current="action" />

        {phase === "setup" ? (
          <div className="step-indicator" aria-label={`Étape ${setupStep} sur 2`}>
            <span className={setupStep >= 1 ? "active" : ""} />
            <span className={setupStep >= 2 ? "active" : ""} />
          </div>
        ) : (
          <button className="header-action" type="button" onClick={resetGame} disabled={spinning}>Réglages</button>
        )}
      </header>

      {phase === "setup" ? (
        <section className="setup-screen">
          {setupStep === 1 ? (
            <div className="setup-page setup-players">
              <div className="screen-intro">
                <span className="step-label">Étape 1 sur 2</span>
                <h1>Qui joue ce soir ?</h1>
                <p>Ajoutez les prénoms des participants. Deux joueurs minimum pour commencer.</p>
              </div>

              <form className="add-player" onSubmit={addPlayer}>
                <div className="input-shell">
                  <span className="input-plus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                  <input
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    placeholder="Prénom du joueur"
                    maxLength={20}
                    autoComplete="off"
                    enterKeyHint="done"
                    aria-label="Prénom du joueur"
                  />
                  <button type="submit" disabled={!playerName.trim() || players.length >= 12}>Ajouter</button>
                </div>
              </form>

              <div className="player-section-head"><strong>Joueurs</strong><span>{players.length}/12</span></div>

              <div className={`player-list ${players.length === 0 ? "is-empty" : ""}`}>
                {players.length ? players.map((player, index) => (
                  <div className="player-row" key={`${player}-${index}`}>
                    <div className="player-avatar" style={{ "--avatar-color": wheelColors[index % wheelColors.length] } as CSSProperties}>
                      {player.slice(0, 1).toUpperCase()}
                    </div>
                    <span>{player}</span>
                    <button type="button" onClick={() => removePlayer(index)} aria-label={`Retirer ${player}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )) : (
                  <div className="empty-players">
                    <div className="empty-icon">A/V</div>
                    <strong>La liste est vide</strong>
                    <p>Commencez par ajouter les personnes autour de vous.</p>
                  </div>
                )}
              </div>

              <div className="setup-bottom-space" />
              <div className="bottom-action-bar">
                <button className="main-button" type="button" onClick={goToAmbiance} disabled={players.length < 2}>
                  <span>Choisir l’ambiance</span>
                  <b>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </b>
                </button>
                {players.length < 2 && <small>Encore {2 - players.length} joueur{2 - players.length > 1 ? "s" : ""} à ajouter</small>}
              </div>
            </div>
          ) : (
            <div className="setup-page setup-mode">
              <div className="screen-intro has-back">
                <button className="text-back" type="button" onClick={() => setSetupStep(1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline w-3 h-3 mr-1 align-middle">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Joueurs
                </button>
                <span className="step-label">Étape 2 sur 2</span>
                <h1>Quelle ambiance ?</h1>
                <p>Adaptez le ton de la partie selon les joueurs présents.</p>
              </div>

              <div className="mode-stack">
                {(Object.keys(modeLabels) as GameMode[]).map((modeKey) => (
                  <button
                    type="button"
                    key={modeKey}
                    className={`mode-option mode-${modeKey} ${mode === modeKey ? "selected" : ""}`}
                    onClick={() => chooseMode(modeKey)}
                  >
                    <span className="mode-text">
                      <div className="mode-title-row">
                        <ModeIcon mode={modeKey} className="mode-icon-svg" />
                        <strong>{modeLabels[modeKey].label}</strong>
                      </div>
                      <span>{modeLabels[modeKey].description}</span>
                    </span>
                    {mode === modeKey && (
                      <span className="radio-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="draw-mode-card">
                <strong>Comment choisir la carte ?</strong>
                <div className="draw-mode-grid">
                  <button
                    type="button"
                    className={drawMode === "random" ? "selected" : ""}
                    onClick={() => chooseDrawMode("random")}
                  >
                    <strong>Au hasard</strong>
                    <small>L’Action ou la Vérité est tirée automatiquement.</small>
                  </button>
                  <button
                    type="button"
                    className={drawMode === "player-choice" ? "selected" : ""}
                    onClick={() => chooseDrawMode("player-choice")}
                  >
                    <strong>Le joueur choisit</strong>
                    <small>Le joueur sélectionne sa catégorie après le tirage.</small>
                  </button>
                </div>
              </div>

              {drawMode === "random" && (
                <div className="preference-card">
                  <div className="preference-title"><div><strong>Catégories incluses</strong></div></div>
                  <div className="choice-grid">
                    <button
                      type="button"
                      className={allowTruth ? "selected" : ""}
                      onClick={() => {
                        if (allowTruth && !allowDare) return;
                        setAllowTruth((value) => !value);
                        haptic(15);
                      }}
                    >
                      <span>V</span>
                      <strong>Vérités</strong>
                      {allowTruth && (
                        <i>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </i>
                      )}
                    </button>
                    <button
                      type="button"
                      className={allowDare ? "selected" : ""}
                      onClick={() => {
                        if (allowDare && !allowTruth) return;
                        setAllowDare((value) => !value);
                        haptic(15);
                      }}
                    >
                      <span>A</span>
                      <strong>Actions</strong>
                      {allowDare && (
                        <i>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </i>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="setup-bottom-space" />
              <div className="bottom-action-bar">
                <button className="main-button" type="button" onClick={startGame} disabled={!canStart}>
                  <span>Lancer la partie</span>
                  <b>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </b>
                </button>
                {!canStart && <small>Sélectionnez au moins deux joueurs pour continuer</small>}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="game-screen">
          <div className="game-copy">
            <span className={`mode-badge mode-${mode}`}>{modeLabels[mode].label}</span>
            <h1>{spinning ? "Ça tourne…" : "À qui le tour ?"}</h1>
            <p>{spinning ? "Le hasard choisit le joueur..." : "Faites tourner la roulette pour désigner un joueur."}</p>
          </div>

          <div className={`wheel-zone ${spinning ? "spinning" : ""}`}>
            <div className="wheel-pointer"><span /></div>
            <button
              type="button"
              className="wheel"
              style={{ background: wheelBackground, transform: `rotate(${rotation}deg)` }}
              onClick={spinWheel}
              disabled={spinning}
              aria-label="Faire tourner la roulette"
            >
              {players.map((player, index) => {
                const slice = 360 / players.length;
                const angle = index * slice + slice / 2;
                const compact = players.length > 8;
                return (
                  <span
                    className={`wheel-name ${compact ? "compact" : ""}`}
                    key={`${player}-${index}`}
                    style={{ transform: `rotate(${angle}deg) translateY(calc(var(--wheel-size) * -0.35)) rotate(${-angle}deg)` }}
                  >
                    {player.length > (compact ? 6 : 9) ? `${player.slice(0, compact ? 5 : 8)}…` : player}
                  </span>
                );
              })}
              <span className="wheel-hub"><b>GO</b><small>{spinning ? "..." : "toucher"}</small></span>
            </button>
          </div>

          <div className="game-actions">
            <button className="spin-cta" type="button" onClick={spinWheel} disabled={spinning || Boolean(selectedPlayer)}>
              {spinning ? (
                <>
                  <span className="loader" /> Tirage en cours
                </>
              ) : (
                <>
                  <span>Tourner la roulette</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-1">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
            <p className="game-stats-row">
              {round ? `Tour ${round} · ` : ""}{players.length} joueurs · {drawMode === "player-choice" ? "Choix libre" : allowTruth && allowDare ? "Actions + Vérités" : allowTruth ? "Vérités" : "Actions"}
            </p>
          </div>
        </section>
      )}

      {phase === "game" && drawMode === "player-choice" && selectedPlayer && !challenge && !spinning && (
        <div className="challenge-layer" role="dialog" aria-modal="true" aria-labelledby="type-choice-title">
          <div className="challenge-backdrop" />
          <div className="challenge-sheet type-choice-sheet">
            <div className="sheet-handle" />
            <div className="chosen-player">
              <span>{selectedPlayer.slice(0, 1).toUpperCase()}</span>
              <div><small>C’est au tour de</small><strong>{selectedPlayer}</strong></div>
            </div>

            <h2 className="type-choice-title" id="type-choice-title">Tu choisis quoi ?</h2>
            <p className="type-choice-subtitle">La carte sera tirée uniquement dans la catégorie choisie.</p>

            <div className="type-choice-grid">
              <button className="type-choice-button truth" type="button" onClick={() => chooseChallengeType("truth")}>
                <span>V</span><strong>Vérité</strong><small>Une question à laquelle répondre</small>
              </button>
              <button className="type-choice-button dare" type="button" onClick={() => chooseChallengeType("dare")}>
                <span>A</span><strong>Action</strong><small>Un défi à réaliser</small>
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "game" && challenge && selectedPlayer && (
        <div className="challenge-layer" role="dialog" aria-modal="true" aria-labelledby="challenge-title">
          <div className="challenge-backdrop" />
          <div className="challenge-sheet">
            <div className="sheet-handle" />
            <div className="challenge-topline">
              <span className={`challenge-type ${challenge.type}`}>{challenge.type === "truth" ? "VÉRITÉ" : "ACTION"}</span>
              <span className="challenge-mode">{modeLabels[mode].label} · Tour {round}</span>
            </div>
            <div className="chosen-player">
              <span>{selectedPlayer.slice(0, 1).toUpperCase()}</span>
              <div><small>C’est au tour de</small><strong>{selectedPlayer}</strong></div>
            </div>
            <h2 id="challenge-title">{challenge.text}</h2>
            <div className="sheet-actions">
              <button className="pass-button" type="button" onClick={replaceChallenge}>Autre carte</button>
              <button className="next-button" type="button" onClick={nextTurn}>
                <span>Tour suivant</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
            <p className="sheet-safety">Pas envie ? Changez de carte. Aucun défi n’est obligatoire.</p>
          </div>
        </div>
      )}
    </main>
  );
}
