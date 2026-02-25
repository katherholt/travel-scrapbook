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

function markerColor(trip: Trip): string {
  if (trip.locked) return "#BBB8B5";
  return trip.signatureColor;
}

function markerSize(trip: Trip): number {
  if (trip.locked) return 6;
  return 8;
}

export default function MapView({ trips, onTripClick }: MapViewProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sable bg-white/50 shadow-md">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [20, 30] }}
        width={800}
        height={450}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#ebe5d8"
                  stroke="#f5f0e8"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#ddd6c8", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {trips.map((trip) => (
            <Marker
              key={trip.slug}
              coordinates={[trip.coordinates.lng, trip.coordinates.lat]}
              onMouseEnter={() => setHoveredSlug(trip.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onClick={() => {
                if (!trip.locked) onTripClick(trip);
              }}
            >
              <circle
                r={markerSize(trip)}
                fill={markerColor(trip)}
                stroke="#f5f0e8"
                strokeWidth={2}
                opacity={trip.locked ? 0.5 : 1}
                style={{ cursor: trip.locked ? "default" : "pointer" }}
              />
              {trip.locked && (
                <circle
                  r={markerSize(trip)}
                  fill="none"
                  stroke={markerColor(trip)}
                  strokeWidth={1}
                  strokeDasharray="2,2"
                  opacity={0.6}
                />
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredSlug && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg border border-sable bg-creme px-4 py-2 shadow-lg"
          >
            {(() => {
              const trip = trips.find((t) => t.slug === hoveredSlug);
              if (!trip) return null;
              return (
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: trip.signatureColor }}
                  />
                  <span className="font-serif text-sm font-bold">
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
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gris">
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
