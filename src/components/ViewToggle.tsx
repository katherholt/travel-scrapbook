"use client";

import { motion } from "framer-motion";

interface ViewToggleProps {
  view: "grid" | "map";
  onToggle: (view: "grid" | "map") => void;
}

export default function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <div className="hidden lg:flex items-center gap-1 rounded-full border border-sable bg-white/50 p-1">
      <button
        className="relative rounded-full px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-wider transition-colors"
        onClick={() => onToggle("grid")}
      >
        {view === "grid" && (
          <motion.div
            layoutId="toggleBg"
            className="absolute inset-0 rounded-full bg-noir"
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}
        <span className={`relative z-10 ${view === "grid" ? "text-creme" : "text-noir/60"}`}>
          Grid
        </span>
      </button>
      <button
        className="relative rounded-full px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-wider transition-colors"
        onClick={() => onToggle("map")}
      >
        {view === "map" && (
          <motion.div
            layoutId="toggleBg"
            className="absolute inset-0 rounded-full bg-noir"
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}
        <span className={`relative z-10 ${view === "map" ? "text-creme" : "text-noir/60"}`}>
          Map
        </span>
      </button>
    </div>
  );
}
