"use client";

import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Challenge,
  ChallengeType,
  GameMode,
  challenges,
  modeLabels,
} from "@/data/challenges";

const wheelColors = [
  "#7456e8",
  "#d95887",
  "#d9824b",
  "#4f7fd8",
  "#4b9b7b",
  "#a55fc5",
  "#c95b5b",
  "#4e91a5",
  "#8a61d0",
  "#cf7044",
  "#68a05f",
  "#5f69ca",
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

export default function ActionVeritePage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [mode, setMode] = useState<GameMode>("soft");
  const [allowTruth, setAllowTruth] = useState(true);
  const [allowDare, setAllowDare] = useState(true);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
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
    if (!players.length) return "#24202b";
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
    haptic(20);
  }

  function removePlayer(indexToRemove: number) {
    setPlayers((current) => current.filter((_, index) => index !== indexToRemove));
    haptic(15);
  }

  function chooseMode(nextMode: GameMode) {
    setMode(nextMode);
    if (nextMode !== "hot") setAdultConfirmed(false);
    haptic(20);
  }

  function goToAmbiance() {
    if (players.length < 2) return;
    setSetupStep(2);
    haptic(20);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startGame() {
    if (players.length < 2 || (!allowTruth && !allowDare)) return;
    if (mode === "hot" && !adultConfirmed) return;
    usedChallenges.current.clear();
    setChallenge(null);
    setSelectedPlayer(null);
    setRound(0);
    setPhase("game");
    haptic([25, 30, 25]);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    haptic(25);

    setRotation((currentRotation) => {
      const currentAngle = ((currentRotation % 360) + 360) % 360;
      const targetAngle = (360 - selectedCenter) % 360;
      const correction = (targetAngle - currentAngle + 360) % 360;
      return currentRotation + 1440 + correction;
    });

    window.setTimeout(() => {
      setSelectedPlayer(players[selectedIndex]);
      setChallenge(pickChallenge());
      setRound((current) => current + 1);
      setSpinning(false);
      haptic([55, 45, 90]);
    }, 3000);
  }

  function replaceChallenge() {
    setChallenge(pickChallenge());
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
    (allowTruth || allowDare) &&
    (mode !== "hot" || adultConfirmed);

  return (
    <main className={`app-shell theme-${mode} ${phase === "game" ? "in-game" : ""}`}>
      <header className="app-header">
        <button
          className="brand-button"
          type="button"
          onClick={() => {
            if (phase === "game") resetGame();
            else if (setupStep === 2) setSetupStep(1);
            else window.location.href = "/";
          }}
          aria-label="Retour"
        >
          <span className="brand-symbol">A/V</span>
          <span className="brand-copy"><strong>Action Vérité</strong><small>jeu de soirée</small></span>
        </button>

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
              <div className="screen-intro"><span className="step-label">Étape 1 sur 2</span><h1>Qui joue ce soir ?</h1><p>Ajoute les prénoms. Deux joueurs suffisent pour lancer la partie.</p></div>
              <form className="add-player" onSubmit={addPlayer}>
                <div className="input-shell">
                  <span className="input-plus">+</span>
                  <input value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Ajouter un prénom" maxLength={20} autoComplete="off" enterKeyHint="done" aria-label="Prénom du joueur" />
                  <button type="submit" disabled={!playerName.trim() || players.length >= 12}>Ajouter</button>
                </div>
              </form>
              <div className="player-section-head"><strong>Joueurs</strong><span>{players.length}/12</span></div>
              <div className={`player-list ${players.length === 0 ? "is-empty" : ""}`}>
                {players.length ? players.map((player, index) => (
                  <div className="player-row" key={`${player}-${index}`}>
                    <div className="player-avatar" style={{ "--avatar-color": wheelColors[index % wheelColors.length] } as CSSProperties}>{player.slice(0, 1).toUpperCase()}</div>
                    <span>{player}</span>
                    <button type="button" onClick={() => removePlayer(index)} aria-label={`Retirer ${player}`}>×</button>
                  </div>
                )) : (
                  <div className="empty-players"><div className="empty-icon">A/V</div><strong>La liste est vide</strong><p>Commence par ajouter les personnes autour de toi.</p></div>
                )}
              </div>
              <div className="setup-bottom-space" />
              <div className="bottom-action-bar">
                <button className="main-button" type="button" onClick={goToAmbiance} disabled={players.length < 2}><span>Choisir l’ambiance</span><b>→</b></button>
                {players.length < 2 && <small>Encore {2 - players.length} joueur{2 - players.length > 1 ? "s" : ""} à ajouter</small>}
              </div>
            </div>
          ) : (
            <div className="setup-page setup-mode">
              <div className="screen-intro has-back"><button className="text-back" type="button" onClick={() => setSetupStep(1)}>← Joueurs</button><span className="step-label">Étape 2 sur 2</span><h1>Quelle ambiance ?</h1><p>Tu peux rester léger ou faire monter progressivement la température.</p></div>
              <div className="mode-stack">
                {(Object.keys(modeLabels) as GameMode[]).map((modeKey) => (
                  <button type="button" key={modeKey} className={`mode-option mode-${modeKey} ${mode === modeKey ? "selected" : ""}`} onClick={() => chooseMode(modeKey)}>
                    <span className="mode-number">{modeMeta[modeKey].number}</span>
                    <span className="mode-text"><small>{modeMeta[modeKey].kicker}</small><strong>{modeLabels[modeKey].label}</strong><span>{modeLabels[modeKey].description}</span></span>
                    <span className="radio-mark">{mode === modeKey ? "✓" : ""}</span>
                  </button>
                ))}
              </div>
              <div className="preference-card">
                <div className="preference-title"><div><strong>Dans la partie</strong><span>Choisis ce que vous voulez tirer</span></div></div>
                <div className="choice-grid">
                  <button type="button" className={allowTruth ? "selected" : ""} onClick={() => { if (allowTruth && !allowDare) return; setAllowTruth((value) => !value); haptic(15); }}><span>V</span><strong>Vérités</strong><i>{allowTruth ? "✓" : ""}</i></button>
                  <button type="button" className={allowDare ? "selected" : ""} onClick={() => { if (allowDare && !allowTruth) return; setAllowDare((value) => !value); haptic(15); }}><span>A</span><strong>Actions</strong><i>{allowDare ? "✓" : ""}</i></button>
                </div>
              </div>
              {mode === "hot" && (
                <label className="adult-confirm"><input type="checkbox" checked={adultConfirmed} onChange={(event) => setAdultConfirmed(event.target.checked)} /><span className="custom-check">{adultConfirmed ? "✓" : ""}</span><span><strong>Mode Hot réservé aux majeurs</strong><small>Je confirme que tous les participants ont 18 ans ou plus.</small></span></label>
              )}
              <p className="safety-copy">Un défi ne vous convient pas ? Passez-le, sans justification.</p>
              <div className="setup-bottom-space" />
              <div className="bottom-action-bar">
                <button className="main-button" type="button" onClick={startGame} disabled={!canStart}><span>Lancer la partie</span><b>→</b></button>
                {!canStart && mode === "hot" && !adultConfirmed && <small>Confirme l’âge des participants pour continuer</small>}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="game-screen">
          <div className="game-copy"><span className={`mode-badge mode-${mode}`}>{modeLabels[mode].label}</span><h1>{spinning ? "Ça tourne…" : "À qui le tour ?"}</h1><p>{spinning ? "Le hasard est en train de choisir." : "Appuie sur la roue ou sur le bouton pour lancer."}</p></div>
          <div className={`wheel-zone ${spinning ? "spinning" : ""}`}>
            <div className="wheel-pointer"><span /></div>
            <button type="button" className="wheel" style={{ background: wheelBackground, transform: `rotate(${rotation}deg)` }} onClick={spinWheel} disabled={spinning} aria-label="Faire tourner la roulette">
              {players.map((player, index) => {
                const slice = 360 / players.length;
                const angle = index * slice + slice / 2;
                const compact = players.length > 8;
                return <span className={`wheel-name ${compact ? "compact" : ""}`} key={`${player}-${index}`} style={{ transform: `rotate(${angle}deg) translateY(calc(var(--wheel-size) * -0.35)) rotate(${-angle}deg)` }}>{player.length > (compact ? 6 : 9) ? `${player.slice(0, compact ? 5 : 8)}…` : player}</span>;
              })}
              <span className="wheel-hub"><b>GO</b><small>{spinning ? "..." : "toucher"}</small></span>
            </button>
          </div>
          <div className="game-actions"><button className="spin-cta" type="button" onClick={spinWheel} disabled={spinning}>{spinning ? <><span className="loader" /> Tirage en cours</> : <>Tourner la roulette <span>→</span></>}</button><p>{round ? `Tour ${round} · ` : ""}{players.length} joueurs · {allowTruth && allowDare ? "Actions + Vérités" : allowTruth ? "Vérités" : "Actions"}</p></div>
        </section>
      )}

      {phase === "game" && challenge && selectedPlayer && (
        <div className="challenge-layer" role="dialog" aria-modal="true" aria-labelledby="challenge-title">
          <div className="challenge-backdrop" />
          <div className="challenge-sheet">
            <div className="sheet-handle" />
            <div className="challenge-topline"><span className={`challenge-type ${challenge.type}`}>{challenge.type === "truth" ? "VÉRITÉ" : "ACTION"}</span><span className="challenge-mode">{modeLabels[mode].label} · Tour {round}</span></div>
            <div className="chosen-player"><span>{selectedPlayer.slice(0, 1).toUpperCase()}</span><div><small>C’est au tour de</small><strong>{selectedPlayer}</strong></div></div>
            <h2 id="challenge-title">{challenge.text}</h2>
            <div className="sheet-actions"><button className="pass-button" type="button" onClick={replaceChallenge}>Autre carte</button><button className="next-button" type="button" onClick={nextTurn}>Tour suivant <span>→</span></button></div>
            <p className="sheet-safety">Pas envie ? Changez de carte. Aucun défi n’est obligatoire.</p>
          </div>
        </div>
      )}
    </main>
  );
}
