import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Serif heading font — swap to Sentient later by replacing this file
// Using Libre Baskerville as placeholder
import { Libre_Baskerville } from "next/font/google";

export const serifFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});
