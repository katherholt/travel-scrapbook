"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trip } from "@/lib/types";
import { parseHighlights } from "@/lib/parseHighlights";

interface CoverCardProps {
  trip: Trip;
  index: number;
  content?: string;
}

// Deterministic slight rotations for organic scattered feel
const ROTATIONS = [-2.5, 1.8, -1.2, 2.3, -1.8, 1.1];

// ── Grain overlay (reusable data-uri) ───────────────────
const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// ── Component ───────────────────────────────────────────
export default function CoverCard({ trip, index, content }: CoverCardProps) {
  const [flipped, setFlipped] = useState(false);
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const isVisited = trip.status === "visited";
  const highlights = content ? parseHighlights(content) : null;
  const canFlip = isVisited && !!highlights;

  return (
    <motion.div
      className="relative w-full"
      style={{ perspective: 1200, aspectRatio: "3 / 2" }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          cursor: canFlip ? "pointer" : "default",
        }}
        animate={{
          rotateY: flipped ? 180 : 0,
          rotate: flipped ? 0 : rotation,
        }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        whileHover={canFlip ? { y: -6, scale: 1.02 } : {}}
        onClick={() => canFlip && setFlipped((f) => !f)}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <Image
            src={trip.postcardImage}
            alt={trip.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            style={{
              filter: isVisited
                ? "none"
                : "saturate(0) contrast(0.9) brightness(0.95)",
              opacity: isVisited ? 1 : 0.7,
            }}
          />
        </div>

        {/* ── BACK FACE ── */}
        {highlights && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "#f5f0e4",
              fontFamily: "var(--font-special-elite)",
            }}
          >
            <div className="flex h-full">
              {/* ── Left: message ── */}
              <div
                className="flex flex-1 flex-col overflow-y-auto p-4 pr-3 sm:p-5 sm:pr-4"
                style={{ borderRight: "1.5px solid rgba(80,60,40,0.18)" }}
              >
                <p
                  className="mb-2 text-[11px] italic sm:text-xs"
                  style={{ color: "rgba(80,60,40,0.45)" }}
                >
                  Dear traveler,
                </p>

                <p
                  className="mb-3 text-[9px] leading-relaxed sm:text-[11px]"
                  style={{ color: "rgba(40,30,20,0.72)" }}
                >
                  {highlights.aboutText}
                </p>

                {highlights.dishes.length > 0 && (
                  <div className="mb-2">
                    <p
                      className="mb-0.5 text-[7px] uppercase tracking-[0.15em] sm:text-[8px]"
                      style={{ color: "rgba(80,60,40,0.35)" }}
                    >
                      Must eat
                    </p>
                    {highlights.dishes.map((d) => (
                      <p
                        key={d}
                        className="text-[9px] sm:text-[10px]"
                        style={{ color: "rgba(40,30,20,0.62)" }}
                      >
                        &middot; {d}
                      </p>
                    ))}
                  </div>
                )}

                {highlights.phrases.length > 0 && (
                  <div className="mt-auto">
                    <p
                      className="mb-0.5 text-[7px] uppercase tracking-[0.15em] sm:text-[8px]"
                      style={{ color: "rgba(80,60,40,0.35)" }}
                    >
                      Say this
                    </p>
                    {highlights.phrases.slice(0, 2).map((p) => (
                      <p
                        key={p.phrase}
                        className="text-[8px] sm:text-[10px]"
                        style={{ color: "rgba(40,30,20,0.62)" }}
                      >
                        &ldquo;{p.phrase}&rdquo;
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Right: address side ── */}
              <div className="flex w-[38%] flex-col p-3 sm:p-4">
                {/* Stamp */}
                <div
                  className="mb-4 ml-auto flex h-12 w-10 items-center justify-center rounded-sm border-2 border-dashed sm:h-14 sm:w-12"
                  style={{ borderColor: trip.signatureColor + "50" }}
                >
                  <span
                    className="text-center text-[6px] font-bold uppercase leading-tight tracking-wider sm:text-[8px]"
                    style={{ color: trip.signatureColor }}
                  >
                    {trip.country}
                  </span>
                </div>

                {/* TO: label */}
                <p
                  className="mb-3 text-[10px] font-bold sm:text-xs"
                  style={{ color: "rgba(80,60,40,0.4)" }}
                >
                  TO:
                </p>

                {/* Address lines */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="mb-4 border-b"
                    style={{ borderColor: "rgba(80,60,40,0.12)" }}
                  />
                ))}

                {/* Postmark */}
                <div
                  className="ml-auto mt-auto flex h-10 w-10 items-center justify-center rounded-full border sm:h-12 sm:w-12"
                  style={{
                    borderColor: "rgba(80,60,40,0.15)",
                    transform: "rotate(-12deg)",
                  }}
                >
                  <span
                    className="text-center text-[5px] uppercase leading-tight tracking-wider sm:text-[7px]"
                    style={{ color: "rgba(80,60,40,0.22)" }}
                  >
                    {trip.region}
                  </span>
                </div>
              </div>
            </div>

            {/* Grain on back */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ opacity: 0.03, backgroundImage: GRAIN_BG }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

