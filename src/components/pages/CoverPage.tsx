"use client";

import Image from "next/image";
import { Trip } from "@/lib/types";

export default function CoverPage({ trip }: { trip: Trip }) {
  return (
    <div className="relative flex min-h-[60vh] items-end overflow-hidden">
      {/* Background image */}
      <Image
        src={trip.coverImage}
        alt={trip.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 672px"
        priority
      />

      {/* Color tint */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: trip.signatureColor,
          opacity: trip.tintStrength * 0.8,
          mixBlendMode: "multiply",
        }}
      />

      {/* Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-8">
        <p
          className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Field Notes
        </p>
        <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
          {trip.title}
        </h1>
        <p className="mt-2 text-sm text-white/70">
          {trip.region}, {trip.country}
        </p>
        <div
          className="mt-4 h-0.5 w-12 rounded-full"
          style={{ backgroundColor: trip.signatureColor }}
        />
      </div>
    </div>
  );
}
