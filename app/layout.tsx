import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Action Vérité — Jeu de soirée",
  description: "Une roulette Action ou Vérité simple, fun et personnalisable pour jouer entre amis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
