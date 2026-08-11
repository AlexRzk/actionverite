"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Challenge,
  ChallengeType,
  GameMode,
  challenges,
  modeLabels,
} from "@/data/challenges";

const wheelColors = [
  "#7c3aed",
  "#db2777",
  "#f97316",
  "#2563eb",
  "#059669",
  "#c026d3",
  "#dc2626",
  "#0891b2",
  "#9333ea",
  "#ea580c",
  "#16a34a",
  "#4f46e5",
];

const modePools: Record<GameMode, GameMode[]> = {
  soft: ["soft"],
  spicy: ["soft", "spicy"],
  hot: ["soft", "spicy", "hot"],
};

export default function Home() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [mode, setMode] = useState<GameMode>("soft");
  const [allowTruth, setAllowTruth] = useState(true);
  const [allowDare, setAllowDare] = useState(true);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [phase, setPhase] = useState<"setup" | "game">("setup");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const usedChallenges = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("action-verite-settings");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          players?: string[];
          mode?: GameMode;
          allowTruth?: boolean;
          allowDare?: boolean;
        };
        if (Array.isArray(parsed.players)) {
          setPlayers(parsed.players.filter((name) => typeof name === "string").slice(0, 12));
        }
        if (parsed.mode && parsed.mode in modeLabels) setMode(parsed.mode);
        if (typeof parsed.allowTruth === "boolean") setAllowTruth(parsed.allowTruth);
        if (typeof parsed.allowDare === "boolean") setAllowDare(parsed.allowDare);
      }
    } catch {
      // A corrupted local preference should never block the game.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      "action-verite-settings",
      JSON.stringify({ players, mode, allowTruth, allowDare }),
    );
  }, [players, mode, allowTruth, allowDare, hydrated]);

  useEffect(() => {
    usedChallenges.current.clear();
    setChallenge(null);
    setSelectedPlayer(null);
  }, [mode, allowTruth, allowDare]);

  const challengePool = useMemo(() => {
    const allowedTypes = new Set<ChallengeType>();
    if (allowTruth) allowedTypes.add("truth");
    if (allowDare) allowedTypes.add("dare");

    return modePools[mode]
      .flatMap((poolMode) => challenges[poolMode])
      .filter((item) => allowedTypes.has(item.type));
  }, [allowDare, allowTruth, mode]);

  const wheelBackground = useMemo(() => {
    if (!players.length) return "#21152e";
    const slice = 360 / players.length;
    const stops = players.flatMap((_, index) => {
      const start = index * slice;
      const end = (index + 1) * slice;
      const color = wheelColors[index % wheelColors.length];
      return [`${color} ${start}deg`, `${color} ${end}deg`];
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
  }

  function removePlayer(indexToRemove: number) {
    setPlayers((current) => current.filter((_, index) => index !== indexToRemove));
  }

  function startGame() {
    if (players.length < 2 || (!allowTruth && !allowDare)) return;
    if (mode === "hot" && !adultConfirmed) return;
    usedChallenges.current.clear();
    setChallenge(null);
    setSelectedPlayer(null);
    setPhase("game");
  }

  function pickChallenge() {
    if (!challengePool.length) return null;
    let available = challengePool.filter((item) => !usedChallenges.current.has(item.id));
    if (!available.length) {
      usedChallenges.current.clear();
      available = challengePool;
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
    setRotation((currentRotation) => {
      const currentAngle = ((currentRotation % 360) + 360) % 360;
      const targetAngle = (360 - selectedCenter) % 360;
      const correction = (targetAngle - currentAngle + 360) % 360;
      return currentRotation + 1440 + correction;
    });

    window.setTimeout(() => {
      setSelectedPlayer(players[selectedIndex]);
      setChallenge(pickChallenge());
      setSpinning(false);
      if ("vibrate" in navigator) navigator.vibrate(60);
    }, 3200);
  }

  function replaceChallenge() {
    setChallenge(pickChallenge());
  }

  function resetGame() {
    setPhase("setup");
    setChallenge(null);
    setSelectedPlayer(null);
    setSpinning(false);
  }

  const canStart =
    players.length >= 2 &&
    (allowTruth || allowDare) &&
    (mode !== "hot" || adultConfirmed);

  return (
    <main className="shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">AV</div>
          <div>
            <strong>Action Vérité</strong>
            <span>le jeu de soirée</span>
          </div>
        </div>
        <div className="pill">{modeLabels[mode].emoji} {modeLabels[mode].label}</div>
      </header>

      {phase === "setup" ? (
        <section className="setup-grid">
          <div className="hero-card panel">
            <p className="eyebrow">PRÊTS À VOUS AFFICHER ?</p>
            <h1>Une roulette. Des vérités. Des défis.</h1>
            <p className="hero-copy">
              Ajoute les joueurs, choisis l’ambiance et laisse le hasard décider qui passe à la casserole.
            </p>

            <form className="player-form" onSubmit={addPlayer}>
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Prénom d’un joueur"
                maxLength={20}
                aria-label="Prénom du joueur"
              />
              <button type="submit" disabled={!playerName.trim() || players.length >= 12}>
                Ajouter
              </button>
            </form>

            <div className="players-wrap">
              {players.length ? (
                players.map((player, index) => (
                  <button
                    type="button"
                    className="player-chip"
                    key={`${player}-${index}`}
                    onClick={() => removePlayer(index)}
                    title="Retirer ce joueur"
                  >
                    <span>{player.slice(0, 1).toUpperCase()}</span>
                    {player}
                    <b>×</b>
                  </button>
                ))
              ) : (
                <p className="empty-state">Ajoute au moins 2 joueurs pour commencer.</p>
              )}
            </div>
            <div className="microcopy">{players.length}/12 joueurs</div>
          </div>

          <div className="settings panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">AMBIANCE</p>
                <h2>Choisis ton niveau</h2>
              </div>
            </div>

            <div className="mode-list">
              {(Object.keys(modeLabels) as GameMode[]).map((modeKey) => (
                <button
                  type="button"
                  key={modeKey}
                  className={`mode-card ${mode === modeKey ? "selected" : ""}`}
                  onClick={() => {
                    setMode(modeKey);
                    if (modeKey !== "hot") setAdultConfirmed(false);
                  }}
                >
                  <span className="mode-emoji">{modeLabels[modeKey].emoji}</span>
                  <span>
                    <strong>{modeLabels[modeKey].label}</strong>
                    <small>{modeLabels[modeKey].description}</small>
                  </span>
                  <i>{mode === modeKey ? "✓" : ""}</i>
                </button>
              ))}
            </div>

            <div className="type-row">
              <button
                type="button"
                className={`type-toggle ${allowTruth ? "active" : ""}`}
                onClick={() => setAllowTruth((value) => !value)}
              >
                <span>💬</span> Vérités
              </button>
              <button
                type="button"
                className={`type-toggle ${allowDare ? "active" : ""}`}
                onClick={() => setAllowDare((value) => !value)}
              >
                <span>⚡</span> Actions
              </button>
            </div>

            {mode === "hot" && (
              <label className="adult-check">
                <input
                  type="checkbox"
                  checked={adultConfirmed}
                  onChange={(event) => setAdultConfirmed(event.target.checked)}
                />
                <span>Je confirme que tous les joueurs participant au mode Hot sont majeurs.</span>
              </label>
            )}

            <button className="primary-cta" type="button" onClick={startGame} disabled={!canStart}>
              Lancer la partie <span>→</span>
            </button>
            <p className="consent-note">Tout défi peut être passé, sans justification. Le consentement reste la règle.</p>
          </div>
        </section>
      ) : (
        <section className="game-layout">
          <div className="game-panel panel">
            <div className="game-head">
              <div>
                <p className="eyebrow">TOUR EN COURS</p>
                <h2>{spinning ? "La roulette tourne…" : selectedPlayer ? `À toi, ${selectedPlayer}` : "Qui sera choisi ?"}</h2>
              </div>
              <button className="ghost-button" type="button" onClick={resetGame} disabled={spinning}>
                Réglages
              </button>
            </div>

            <div className="wheel-stage">
              <div className="pointer">▼</div>
              <button
                type="button"
                className={`wheel ${spinning ? "is-spinning" : ""}`}
                style={{ background: wheelBackground, transform: `rotate(${rotation}deg)` }}
                onClick={spinWheel}
                disabled={spinning}
                aria-label="Faire tourner la roulette"
              >
                {players.map((player, index) => {
                  const slice = 360 / players.length;
                  const angle = index * slice + slice / 2;
                  return (
                    <span
                      className="wheel-name"
                      key={`${player}-${index}`}
                      style={{ transform: `rotate(${angle}deg) translateY(-112px) rotate(${-angle}deg)` }}
                    >
                      {player.length > 9 ? `${player.slice(0, 8)}…` : player}
                    </span>
                  );
                })}
                <span className="wheel-center">GO</span>
              </button>
            </div>

            {!selectedPlayer && !spinning && (
              <button className="spin-button" type="button" onClick={spinWheel}>
                Tourner la roulette
              </button>
            )}

            {spinning && <div className="status-line"><span /> Le hasard fait son choix…</div>}
          </div>

          <aside className={`challenge-card panel ${challenge ? "revealed" : "waiting"}`}>
            {challenge && selectedPlayer ? (
              <>
                <div className={`challenge-kind ${challenge.type}`}>
                  {challenge.type === "truth" ? "💬 VÉRITÉ" : "⚡ ACTION"}
                </div>
                <p className="challenge-player">Pour {selectedPlayer}</p>
                <h3>{challenge.text}</h3>
                <div className="challenge-actions">
                  <button type="button" className="secondary-button" onClick={replaceChallenge}>
                    Passer
                  </button>
                  <button type="button" className="primary-cta compact" onClick={spinWheel}>
                    Tour suivant →
                  </button>
                </div>
                <p className="consent-note">Pas envie ? Passe. Aucun gage ne vaut un malaise.</p>
              </>
            ) : (
              <div className="waiting-content">
                <span>🎯</span>
                <h3>Le défi apparaîtra ici</h3>
                <p>Fais tourner la roulette pour tirer un joueur et une carte au hasard.</p>
              </div>
            )}
          </aside>
        </section>
      )}

      <footer>
        <span>Action Vérité</span>
        <span>•</span>
        <span>100 % local, aucune donnée envoyée</span>
      </footer>
    </main>
  );
}
