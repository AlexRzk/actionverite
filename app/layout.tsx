import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./mobile-polish.css";
import "./centered-mobile.css";
import "./hub.css";
import "./never.css";
import "./action-choice.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Soirée — Jeux entre amis",
  description: "Des jeux de soirée simples et rapides à lancer entre amis.",
  applicationName: "Soirée",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Soirée",
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
      <body className={manrope.className}>
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
