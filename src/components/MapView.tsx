"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Trip } from "@/lib/types";
import { parseHighlights } from "@/lib/parseHighlights";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface MapViewProps {
  trips: Trip[];
  tripContents: Record<string, string>;
}

function getMarkerColor(trip: Trip): string {
  if (trip.status === "visited") return trip.signatureColor;
  return "#f0ebe0";
}

function markerSize(trip: Trip): number {
  if (trip.locked) return 6;
  return 8;
}

// ── Postcard overlay shown when a map marker is clicked ──
function PostcardOverlay({
  trip,
  content,
  onClose,
}: {
  trip: Trip;
  content: string;
  onClose: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const highlights = content ? parseHighlights(content) : null;
  const isVisited = trip.status === "visited";

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-end justify-center pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Postcard */}
      <motion.div
        className="relative z-10"
        style={{
          width: "min(420px, 80%)",
          aspectRatio: "3 / 2",
          perspective: 1200,
        }}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            cursor: isVisited && highlights ? "pointer" : "default",
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          onClick={(e) => {
            e.stopPropagation();
            if (isVisited && highlights) setFlipped((f) => !f);
          }}
        >
          {/* ── FRONT FACE ── */}
          <div
            className="absolute inset-0 overflow-hidden rounded-sm shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <Image
              src={trip.postcardImage}
              alt={trip.title}
              fill
              sizes="420px"
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
              className="absolute inset-0 overflow-hidden rounded-sm shadow-2xl"
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
                  style={{
                    borderRight: "1.5px solid rgba(80,60,40,0.18)",
                  }}
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
    </motion.div>
  );
}

// ── Main map component ──────────────────────────────────
export default function MapView({ trips, tripContents }: MapViewProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-md"
      style={{
        backgroundColor: "#ede7d9",
        border: "1px solid rgba(150,130,100,0.3)",
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [20, 30] }}
        width={800}
        height={450}
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(180,165,135,0.4)"
                  stroke="rgba(150,130,100,0.3)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: "rgba(180,165,135,0.55)",
                      outline: "none",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {trips.map((trip) => {
            const isFuture = trip.status !== "visited";
            const color = getMarkerColor(trip);
            const size = markerSize(trip);

            return (
              <Marker
                key={trip.slug}
                coordinates={[trip.coordinates.lng, trip.coordinates.lat]}
                onMouseEnter={() => setHoveredSlug(trip.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onClick={() => {
                  if (!trip.locked) {
                    setSelectedTrip(trip);
                    setHoveredSlug(null);
                  }
                }}
              >
                {isFuture && (
                  <circle
                    r={size + 4}
                    fill={color}
                    opacity={0.25}
                    filter="url(#glow)"
                  />
                )}
                <circle
                  r={size}
                  fill={color}
                  stroke={isFuture ? "rgba(255,255,255,0.5)" : "#ede7d9"}
                  strokeWidth={2}
                  opacity={trip.locked ? 0.7 : 1}
                  style={{ cursor: trip.locked ? "default" : "pointer" }}
                  filter={isFuture ? "url(#glow)" : undefined}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip (hidden when postcard is open) */}
      <AnimatePresence>
        {hoveredSlug && !selectedTrip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 shadow-lg"
            style={{
              backgroundColor: "#ede7d9",
              border: "1px solid rgba(150,130,100,0.3)",
            }}
          >
            {(() => {
              const trip = trips.find((t) => t.slug === hoveredSlug);
              if (!trip) return null;
              return (
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getMarkerColor(trip) }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {trip.title}
                  </span>
                  {trip.locked && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gris"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                  {!trip.locked && (
                    <span
                      className="text-[10px] uppercase"
                      style={{
                        fontFamily: "var(--font-sans)",
                        letterSpacing: "1px",
                        color: "rgba(80,60,40,0.5)",
                      }}
                    >
                      Click to open
                    </span>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Postcard overlay */}
      <AnimatePresence>
        {selectedTrip && (
          <PostcardOverlay
            key={selectedTrip.slug}
            trip={selectedTrip}
            content={tripContents[selectedTrip.slug] || ""}
            onClose={() => setSelectedTrip(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
