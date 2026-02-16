import type { Metadata } from "next";
import { inter, serifFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Field Notes Trips",
  description: "A travel scrapbook with a print/zine-inspired aesthetic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${serifFont.variable}`}>
      <body className="min-h-screen bg-creme antialiased">
        {children}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
