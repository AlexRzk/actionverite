"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { GameMenu } from "@/app/components/game-menu";
import { NeverMode, neverCards, neverModeLabels } from "@/data/never-have-i-ever";

const pools: Record<NeverMode, NeverMode[]> = {
  soft: ["soft"],
  spicy: ["soft", "spicy"],
  hot: ["soft", "spicy", "hot"],
};

function haptic(pattern: number | number[] = 24) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export default function NeverHaveIEverPage() {
  const [mode, setMode] = useState<NeverMode>("soft");
  const [started, setStarted] = useState(false);
  const [card, setCard] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const used = useRef<Set<string>>(new Set());

  const pool = useMemo(() => pools[mode].flatMap((key) => neverCards[key]), [mode]);

  function chooseMode(nextMode: NeverMode) {
    setMode(nextMode);
    used.current.clear();
    haptic();
  }

  function drawCard() {
    let available = pool.filter((item) => !used.current.has(item));
    if (!available.length) {
      used.current.clear();
      available = pool;
    }
    const next = available[Math.floor(Math.random() * available.length)];
    used.current.add(next);
    setCard(next);
    setRound((value) => value + 1);
    haptic([20, 24, 38]);
  }

  function start() {
    used.current.clear();
    setRound(0);
    setStarted(true);
    setTimeout(drawCard, 80);
  }

  function reset() {
    setStarted(false);
    setCard(null);
    setRound(0);
    used.current.clear();
    haptic();
  }

  return (
    <main className={`never-app never-${mode}`}>
      <header className="never-header">
        <Link href="/" className="never-back" aria-label="Retour aux jeux">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <GameMenu current="never" />
        {started ? (
          <button type="button" className="never-reset-btn" onClick={reset}>
            Changer
          </button>
        ) : (
          <span className="never-header-spacer" />
        )}
      </header>

      {!started ? (
        <section className="never-setup">
          <div className="never-intro">
            <span className="never-kicker">JEU DE GROUPE</span>
            <h1>Je n’ai jamais…</h1>
            <p>Une phrase apparaît. Ceux qui l’ont déjà fait se dénoncent. C’est tout.</p>
          </div>

          <div className="never-modes">
            {(Object.keys(neverModeLabels) as NeverMode[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`never-mode-btn ${mode === key ? "selected" : ""}`}
                onClick={() => chooseMode(key)}
              >
                <div className="mode-btn-content">
                  <strong>{neverModeLabels[key].label}</strong>
                  <span>{neverModeLabels[key].description}</span>
                </div>
                {mode === key && (
                  <span className="never-mode-checked">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            className="never-start"
            type="button"
            onClick={start}
          >
            Commencer
          </button>
        </section>
      ) : (
        <section className="never-game">
          <div className="never-progress">
            <span>{neverModeLabels[mode].label}</span>
            <span>Carte {round}</span>
          </div>
          
          <button className="never-card" type="button" onClick={drawCard} aria-label="Carte suivante">
            <small>JE N’AI JAMAIS</small>
            <h1>{card ? card.replace(/^Je n[’']ai jamais\s*/i, "") : "…"}</h1>
            <span className="never-card-tip">Touche la carte pour continuer</span>
          </button>

          <div className="never-rule">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p>Si tu l’as déjà fait, signale-toi. Les détails viennent naturellement.</p>
          </div>

          <button className="never-next" type="button" onClick={drawCard}>
            <span>Carte suivante</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </section>
      )}
    </main>
  );
}
