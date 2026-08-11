"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { NeverMode, neverCards, neverModeLabels } from "@/data/never-have-i-ever";

const pools: Record<NeverMode, NeverMode[]> = {
  soft: ["soft"],
  spicy: ["soft", "spicy"],
  hot: ["soft", "spicy", "hot"],
};

function haptic(pattern: number | number[] = 24) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

export default function NeverHaveIEverPage() {
  const [mode, setMode] = useState<NeverMode>("soft");
  const [started, setStarted] = useState(false);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [card, setCard] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const used = useRef<Set<string>>(new Set());

  const pool = useMemo(() => pools[mode].flatMap((key) => neverCards[key]), [mode]);

  function chooseMode(nextMode: NeverMode) {
    setMode(nextMode);
    if (nextMode !== "hot") setAdultConfirmed(false);
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
    if (mode === "hot" && !adultConfirmed) return;
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
        <Link href="/" className="never-back" aria-label="Retour aux jeux">←</Link>
        <div className="never-brand"><span>J/N</span><strong>Je n’ai jamais</strong></div>
        {started ? <button type="button" onClick={reset}>Changer</button> : <span className="never-header-spacer" />}
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
              <button key={key} type="button" className={mode === key ? "selected" : ""} onClick={() => chooseMode(key)}>
                <strong>{neverModeLabels[key].label}</strong>
                <span>{neverModeLabels[key].description}</span>
                <i>{mode === key ? "✓" : ""}</i>
              </button>
            ))}
          </div>

          {mode === "hot" && (
            <label className="never-adult">
              <input type="checkbox" checked={adultConfirmed} onChange={(event) => setAdultConfirmed(event.target.checked)} />
              <span>{adultConfirmed ? "✓" : ""}</span>
              <div><strong>18+ uniquement</strong><small>Je confirme que tous les participants sont majeurs.</small></div>
            </label>
          )}

          <button className="never-start" type="button" onClick={start} disabled={mode === "hot" && !adultConfirmed}>Commencer</button>
        </section>
      ) : (
        <section className="never-game">
          <div className="never-progress"><span>{neverModeLabels[mode].label}</span><span>Carte {round}</span></div>
          <button className="never-card" type="button" onClick={drawCard} aria-label="Carte suivante">
            <small>JE N’AI JAMAIS</small>
            <h1>{card ? card.replace(/^Je n[’']ai jamais\s*/i, "") : "…"}</h1>
            <span>Touche la carte pour continuer</span>
          </button>
          <div className="never-rule"><span>☝️</span><p>Si tu l’as déjà fait, signale-toi. Les détails viennent naturellement.</p></div>
          <button className="never-next" type="button" onClick={drawCard}>Carte suivante <span>→</span></button>
        </section>
      )}
    </main>
  );
}
