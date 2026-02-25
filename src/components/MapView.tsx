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

function markerColor(status: Trip["status"]): string {
  switch (status) {
    case "past":
      return "#d4763a";
    case "upcoming":
      return "#2a7d5f";
    case "future":
      return "#b8a88a";
  }
}

function markerSize(trip: Trip): number {
  if (trip.locked) return 6;
  return 8;
}

function MapLegend() {
  const items = [
    { color: "#d4763a", label: "Past" },
    { color: "#2a7d5f", label: "Upcoming" },
    { color: "#b8a88a", label: "Future" },
  ];

  return (
    <div
      className="absolute bottom-4 right-4 flex flex-col gap-1.5 rounded-lg px-3 py-2"
      style={{
        backgroundColor: "rgba(237,231,217,0.9)",
        border: "1px solid rgba(150,130,100,0.3)",
        backdropFilter: "blur(4px)",
      }}
    >
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span
            className="text-[10px] uppercase"
            style={{
              fontFamily: "var(--font-special-elite)",
              letterSpacing: "1.5px",
              color: "rgba(80,60,40,0.6)",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
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
                fill={markerColor(trip.status)}
                stroke="#ede7d9"
                strokeWidth={2}
                opacity={trip.locked ? 0.5 : 1}
                style={{ cursor: trip.locked ? "default" : "pointer" }}
              />
              {trip.locked && (
                <circle
                  r={markerSize(trip)}
                  fill="none"
                  stroke={markerColor(trip.status)}
                  strokeWidth={1}
                  strokeDasharray="2,2"
                  opacity={0.6}
                />
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <MapLegend />

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
                    style={{ backgroundColor: markerColor(trip.status) }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-special-elite)" }}
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
                        fontFamily: "var(--font-special-elite)",
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
