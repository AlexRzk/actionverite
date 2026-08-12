"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type GameMenuGame = "home" | "action" | "never";

const games = [
  {
    key: "action" as const,
    href: "/action-verite",
    title: "Action Vérité",
    description: "La roulette désigne le prochain joueur.",
  },
  {
    key: "never" as const,
    href: "/je-nai-jamais",
    title: "Je n’ai jamais",
    description: "Une phrase suffit pour lancer les aveux.",
  },
];

const labels: Record<GameMenuGame, string> = {
  home: "Choisir un jeu",
  action: "Action Vérité",
  never: "Je n’ai jamais",
};

function GameMark({ game }: { game: GameMenuGame }) {
  return (
    <span className={`game-mark game-mark-${game}`} aria-hidden="true">
      {game === "action" && (
        <>
          <span className="game-mark-dial" />
          <b>A/V</b>
        </>
      )}
      {game === "never" && (
        <>
          <span className="game-mark-paper game-mark-paper-back" />
          <span className="game-mark-paper game-mark-paper-front">J/N</span>
        </>
      )}
      {game === "home" && <span className="game-mark-home-shape">S</span>}
    </span>
  );
}

export function GameMenu({ current }: { current: GameMenuGame }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className={`game-menu ${open ? "is-open" : ""}`} ref={menuRef}>
      <button
        className="game-menu-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <GameMark game={current} />
        <span className="game-menu-trigger-copy">
          <small>JEU DU SOIR</small>
          <strong>{labels[current]}</strong>
        </span>
        <svg className="game-menu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="game-menu-popover" role="menu" aria-label="Choisir un jeu">
          <div className="game-menu-heading">Changer de jeu</div>
          {games.map((game) => (
            <Link
              key={game.key}
              href={game.href}
              className={`game-menu-option ${current === game.key ? "selected" : ""}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <GameMark game={game.key} />
              <span>
                <strong>{game.title}</strong>
                <small>{game.description}</small>
              </span>
              <svg className="game-menu-option-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
