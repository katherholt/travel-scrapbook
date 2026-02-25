"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ─── CONFIG ─────────────────────────────────────────────
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ".split("");
const DISPLAY_COLS = 14;
const FLIP_STAGGER_MS = 35;
const CHAR_CYCLE_MS = 45;
const HOLD_MS = 1400;
const CITIES_TO_SHOW = 2;
const DESTINATIONS = ["PORTLAND ME", "MEXICO CITY"];
const ACCENT_COLORS = ["#B2E1D2", "#FF8C00"];
// ─── UTILITIES ──────────────────────────────────────────
function padCenter(text: string, width: number): string {
  const pad = width - text.length;
  if (pad <= 0) return text.slice(0, width);
  const left = Math.floor(pad / 2);
  return " ".repeat(left) + text + " ".repeat(pad - left);
}
function randomChar(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}
// ─── FLAP (single tile) ────────────────────────────────
interface FlapProps {
  char: string;
  isFlipping: boolean;
  accentColor: string;
}
function Flap({ char, isFlipping, accentColor }: FlapProps) {
  const isEmpty = char === " ";
  return (
    <div style={{ width: 38, height: 52, perspective: "200px" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 3,
          background: isEmpty ? "#f0ebe0" : "#1a1a18",
          color: isEmpty ? "transparent" : "#f5f0e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono, 'DM Mono', 'Courier New', monospace)",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.02em",
          position: "relative",
          overflow: "hidden",
          boxShadow: isFlipping
            ? "0 2px 8px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 1px 3px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.03)",
          transition: "box-shadow 0.15s ease",
        }}
      >
        {/* Split line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background: isEmpty ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.4)",
            zIndex: 2,
          }}
        />
        {/* Top-half shading */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: isEmpty ? "transparent" : "rgba(255,255,255,0.04)",
            borderRadius: "3px 3px 0 0",
            zIndex: 1,
          }}
        />
        {/* Accent dot */}
        {!isEmpty && (
          <div
            style={{
              position: "absolute",
              bottom: 3,
              right: 3,
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: accentColor,
              opacity: 0.5,
              zIndex: 3,
            }}
          />
        )}
        <span style={{ position: "relative", zIndex: 3 }}>{char}</span>
      </div>
    </div>
  );
}
// ─── FLAP CELL (handles cycling animation) ──────────────
interface FlapCellProps {
  targetChar: string;
  columnIndex: number;
  accentColor: string;
}
function FlapCell({ targetChar, columnIndex, accentColor }: FlapCellProps) {
  const [currentChar, setCurrentChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTarget = useRef(targetChar);
  useEffect(() => {
    if (targetChar === prevTarget.current && currentChar === targetChar) return;
    prevTarget.current = targetChar;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const delay = columnIndex * FLIP_STAGGER_MS;
    timeoutRef.current = setTimeout(() => {
      if (targetChar === " ") {
        setCurrentChar(" ");
        setIsFlipping(false);
        return;
      }
      setIsFlipping(true);
      let cycles = 0;
      const maxCycles = 3 + Math.floor(Math.random() * 5);
      intervalRef.current = setInterval(() => {
        if (cycles >= maxCycles) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setCurrentChar(targetChar);
          setIsFlipping(false);
          return;
        }
        setCurrentChar(randomChar());
        cycles++;
      }, CHAR_CYCLE_MS);
    }, delay);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [targetChar, columnIndex]);
  return (
    <Flap char={currentChar} isFlipping={isFlipping} accentColor={accentColor} />
  );
}
// ─── FLAP ROW ───────────────────────────────────────────
interface FlapRowProps {
  text: string;
  rowIndex: number;
  accentColor: string;
}
function FlapRow({ text, rowIndex, accentColor }: FlapRowProps) {
  const chars = padCenter(text, DISPLAY_COLS).split("");
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {chars.map((char, i) => (
        <FlapCell
          key={`${rowIndex}-${i}`}
          targetChar={char}
          columnIndex={i}
          accentColor={accentColor}
        />
      ))}
    </div>
  );
}
// ─── MAIN LOADER ────────────────────────────────────────
export default function SplitFlapLoader({
  onComplete,
}: {
  onComplete?: () => void;
}) {
  const [cityIndex, setCityIndex] = useState(0);
  const [citiesShown, setCitiesShown] = useState(0);
  const [phase, setPhase] = useState<"running" | "exiting" | "done">("running");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  // Cycle through cities, then exit
  useEffect(() => {
    if (phase !== "running") return;
    const timer = setTimeout(() => {
      const nextShown = citiesShown + 1;
      if (nextShown >= CITIES_TO_SHOW) {
        // Done — start exit
        setPhase("exiting");
        return;
      }
      setCitiesShown(nextShown);
      setCityIndex((prev) => (prev + 1) % DESTINATIONS.length);
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [cityIndex, citiesShown, phase]);
  // After exit animation completes
  const handleExitComplete = useCallback(() => {
    setPhase("done");
    onCompleteRef.current?.();
  }, []);
  const accentColor = ACCENT_COLORS[cityIndex % ACCENT_COLORS.length] || "#FF8C00";
  const currentCity = DESTINATIONS[cityIndex] || "FIELD NOTES";
  if (phase === "done") return null;
  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {phase === "running" && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 28,
            background: "#f5f0e8",
            fontFamily:
              "var(--font-mono, 'DM Mono', 'Courier New', monospace)",
          }}
        >
          {/* Grain */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              opacity: 0.035,
              pointerEvents: "none",
              zIndex: 1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px",
            }}
          />
          {/* Board */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{
              background: "#ebe5d8",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: 10,
              padding: "24px 28px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.03), 0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Housing label */}
            <div
              style={{
                position: "absolute",
                top: -9,
                left: 28,
                background: "#ebe5d8",
                padding: "0 10px",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.28)",
              }}
            >
              Departures
            </div>
            <div
              style={{
                position: "absolute",
                top: -9,
                right: 28,
                background: "#ebe5d8",
                padding: "0 10px",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.22)",
              }}
            >
              Classic
            </div>
            {/* Row 1: FIELD NOTES */}
            <FlapRow
              text="FIELD  NOTES"
              rowIndex={0}
              accentColor={accentColor}
            />
            {/* Row 2: Empty spacer */}
            <FlapRow text="" rowIndex={1} accentColor={accentColor} />
            {/* Row 3: Cycling destination */}
            <FlapRow
              text={currentCity}
              rowIndex={2}
              accentColor={accentColor}
            />
            {/* Accent bar */}
            <motion.div
              animate={{ backgroundColor: accentColor }}
              transition={{ duration: 0.5 }}
              style={{
                height: 3,
                borderRadius: 2,
                marginTop: 10,
                opacity: 0.65,
              }}
            />
          </motion.div>
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#1a1a18",
              position: "relative",
              zIndex: 2,
            }}
          >
            A collection of past, present & future trips
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
