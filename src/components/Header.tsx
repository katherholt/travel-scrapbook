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
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gris">
          Travel Scrapbook
        </p>
        <h1 className="font-serif text-3xl font-bold leading-tight text-noir sm:text-4xl">
          Field Notes Trips
        </h1>
      </div>
      <ViewToggle view={view} onToggle={onToggle} />
    </header>
  );
}
