import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import "./intro.css";
import "./warm-theme.css";
import "./mundo-em-movimento.css";
import "./editorial-motion.css";
import "./waitlist.css";

// Fontes auto-hospedadas pelo build (next/font): nenhuma chamada a fontes
// acontece no browser. Fraunces = títulos narrativos; DM Sans = interface/corpo.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChatGuard — Menos ruído. Mais contexto.",
  description:
    "ChatGuard — menos ruído, mais contexto. Uma visão de acompanhamento digital transparente, responsável e próxima.",
};

export const viewport: Viewport = {
  themeColor: "#faf6ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
