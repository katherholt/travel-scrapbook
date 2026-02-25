"use client";

import { Trip } from "@/lib/types";
import CoverCard from "./CoverCard";

interface CoverGridProps {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
}

export default function CoverGrid({ trips, onTripClick }: CoverGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {trips.map((trip, i) => (
        <CoverCard
          key={trip.slug}
          trip={trip}
          onClick={() => onTripClick(trip)}
          index={i}
        />
      ))}
    </div>
  );
}
