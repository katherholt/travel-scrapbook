"use client";

import { motion } from "framer-motion";
import { Trip } from "@/lib/types";
import LockOverlay from "./ui/LockOverlay";

interface CoverCardProps {
  trip: Trip;
  onClick: () => void;
  index: number;
}

function getFilterStyle(status: Trip["status"]): React.CSSProperties {
  switch (status) {
    case "past":
      return { filter: "none", opacity: 1 };
    case "upcoming":
      return { filter: "saturate(0.3) sepia(0.4)", opacity: 0.8 };
    case "future":
      return { filter: "saturate(0) sepia(0.5) brightness(0.9)", opacity: 0.5 };
  }
}

function getHoverProps(status: Trip["status"]) {
  switch (status) {
    case "past":
      return {
        y: -4,
        rotate: -0.5,
        boxShadow: "4px 6px 20px rgba(80,60,40,0.25)",
      };
    case "upcoming":
      return {
        y: -2,
        boxShadow: "3px 4px 16px rgba(80,60,40,0.2)",
      };
    case "future":
      return {};
  }
}

export default function CoverCard({ trip, onClick, index }: CoverCardProps) {
  const canOpen = !trip.locked;
  const filterStyle = getFilterStyle(trip.status);
  const showLabel = trip.status === "upcoming" || trip.status === "future";
  const labelText = trip.status === "upcoming" ? "COMING SOON" : "TBD";

  return (
    <motion.button
      className="group relative aspect-[3/2] w-full overflow-hidden rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-noir/30"
      onClick={() => canOpen && onClick()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={getHoverProps(trip.status)}
      aria-label={
        canOpen
          ? `Open ${trip.title} booklet`
          : `${trip.title} — coming soon`
      }
      style={{
        cursor: canOpen ? "pointer" : "default",
        boxShadow: "2px 3px 12px rgba(80,60,40,0.15)",
        border: "1px solid rgba(180,160,130,0.3)",
        borderRadius: "12px",
      }}
    >
      {/* Postcard image */}
      <img
        src={trip.postcardImage}
        alt={trip.title}
        className="h-full w-full object-cover"
        style={{
          borderRadius: "12px",
          ...filterStyle,
        }}
      />

      {/* Light grain overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "12px",
          opacity: 0.05,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Status label for upcoming/future */}
      {showLabel && (
        <div className="absolute left-3 top-3 z-20">
          <span
            className="inline-block rounded-md px-2 py-0.5 text-[10px] uppercase"
            style={{
              fontFamily: "var(--font-special-elite)",
              letterSpacing: "2px",
              backgroundColor: "rgba(0,0,0,0.2)",
              color: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(2px)",
            }}
          >
            {labelText}
          </span>
        </div>
      )}

      {/* Lock overlay for locked trips */}
      {trip.locked && <LockOverlay title={trip.title} />}
    </motion.button>
  );
}
