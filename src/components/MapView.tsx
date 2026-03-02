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
import { Trip } from "@/lib/types";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapViewProps {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
}

function getMarkerColor(trip: Trip): string {
  if (trip.status === "visited") return trip.signatureColor;
  return "#f0ebe0";
}

function markerSize(trip: Trip): number {
  if (trip.locked) return 6;
  return 8;
}

export default function MapView({ trips, onTripClick }: MapViewProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

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
                    hover: { fill: "rgba(180,165,135,0.55)", outline: "none" },
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
                  if (!trip.locked) onTripClick(trip);
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

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredSlug && (
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
    </div>
  );
}
