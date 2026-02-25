"use client";

import ViewToggle from "./ViewToggle";

interface HeaderProps {
  view: "grid" | "map";
  onToggle: (view: "grid" | "map") => void;
}

export default function Header({ view, onToggle }: HeaderProps) {
  return (
    <header className="mb-8 flex items-end justify-between sm:mb-12">
      <div>
        <p
          className="mb-1 text-[10px] font-semibold uppercase"
          style={{
            fontFamily: "var(--font-special-elite)",
            letterSpacing: "0.25em",
            color: "rgba(80,60,40,0.45)",
          }}
        >
          Travel Scrapbook
        </p>
        <h1
          className="text-3xl font-bold leading-tight text-noir sm:text-4xl"
          style={{ fontFamily: "var(--font-special-elite)" }}
        >
          Field Notes
        </h1>
      </div>
      <ViewToggle view={view} onToggle={onToggle} />
    </header>
  );
}
