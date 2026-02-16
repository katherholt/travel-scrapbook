"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trip } from "@/lib/types";
import LockOverlay from "./ui/LockOverlay";

interface CoverCardProps {
  trip: Trip;
  onClick: () => void;
  index: number;
}

function statusLabel(status: Trip["status"]): string {
  switch (status) {
    case "past":
      return "Field Notes";
    case "upcoming":
      return "Coming Soon";
    case "future":
      return "TBD";
  }
}

export default function CoverCard({ trip, onClick, index }: CoverCardProps) {
  const canOpen = !trip.locked;

  return (
    <motion.button
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl text-left shadow-md transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-noir/30"
      onClick={() => canOpen && onClick()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      aria-label={
        canOpen
          ? `Open ${trip.title} booklet`
          : `${trip.title} — coming soon`
      }
      style={{ cursor: canOpen ? "pointer" : "default" }}
    >
      {/* Background image */}
      <Image
        src={trip.coverImage}
        alt={trip.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={index < 3}
      />

      {/* Color tint overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: trip.signatureColor,
          opacity: trip.tintStrength,
          mixBlendMode: "multiply",
        }}
      />

      {/* Subtle gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Meta label top-left */}
      <div className="absolute left-4 top-4 z-20">
        <span
          className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: "rgba(246, 242, 234, 0.85)",
            color: trip.signatureColor,
          }}
        >
          {statusLabel(trip.status)}
        </span>
      </div>

      {/* Title bottom-left */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <h2 className="font-serif text-xl font-bold leading-tight text-white drop-shadow-md sm:text-2xl">
          {trip.title}
        </h2>
        <p className="mt-1 text-xs text-white/80 drop-shadow-sm">
          {trip.region}, {trip.country}
        </p>
      </div>

      {/* Lock overlay for future trips */}
      {trip.locked && <LockOverlay title={trip.title} />}
    </motion.button>
  );
}
