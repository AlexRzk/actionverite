import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./mobile-polish.css";

export const metadata: Metadata = {
  title: "Action Vérité — Jeu de soirée",
  description: "Une roulette Action ou Vérité rapide, fun et personnalisable pour jouer entre amis.",
  applicationName: "Action Vérité",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Action Vérité",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d0b10",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
