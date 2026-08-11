import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./mobile-polish.css";
import "./centered-mobile.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

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
    <html lang="fr" className={manrope.variable}>
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
