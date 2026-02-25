"use client";

import { motion } from "framer-motion";

interface ViewToggleProps {
  view: "grid" | "map";
  onToggle: (view: "grid" | "map") => void;
}

export default function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <div
      className="hidden lg:flex items-center gap-0 rounded-md p-0.5"
      style={{
        backgroundColor: "rgba(60,45,25,0.08)",
        border: "1px solid rgba(180,160,130,0.3)",
      }}
    >
      <button
        className="relative rounded-[4px] px-4 py-1.5 text-xs uppercase transition-colors"
        style={{
          fontFamily: "var(--font-special-elite)",
          letterSpacing: "0.15em",
        }}
        onClick={() => onToggle("grid")}
      >
        {view === "grid" && (
          <motion.div
            layoutId="toggleBg"
            className="absolute inset-0 rounded-[4px]"
            style={{ backgroundColor: "rgba(60,45,25,0.85)" }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}
        <span
          className="relative z-10"
          style={{
            color:
              view === "grid" ? "#f5f0e8" : "rgba(80,60,40,0.5)",
          }}
        >
          Grid
        </span>
      </button>
      <button
        className="relative rounded-[4px] px-4 py-1.5 text-xs uppercase transition-colors"
        style={{
          fontFamily: "var(--font-special-elite)",
          letterSpacing: "0.15em",
        }}
        onClick={() => onToggle("map")}
      >
        {view === "map" && (
          <motion.div
            layoutId="toggleBg"
            className="absolute inset-0 rounded-[4px]"
            style={{ backgroundColor: "rgba(60,45,25,0.85)" }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          />
        )}
        <span
          className="relative z-10"
          style={{
            color:
              view === "map" ? "#f5f0e8" : "rgba(80,60,40,0.5)",
          }}
        >
          Map
        </span>
      </button>
    </div>
  );
}
