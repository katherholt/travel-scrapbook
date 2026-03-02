"use client";

import { Trip } from "@/lib/types";
import CoverCard from "./CoverCard";

interface CoverGridProps {
  trips: Trip[];
  tripContents: Record<string, string>;
}

export default function CoverGrid({ trips, tripContents }: CoverGridProps) {
  const visited = trips.filter((t) => t.status === "visited");
  const wishlist = trips.filter((t) => t.status !== "visited");

  return (
    <div>
      {/* Visited */}
      {visited.length > 0 && (
        <section className="mb-12">
          <h2
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs"
            style={{
              fontFamily: "var(--font-sans)",
              color: "rgba(80,60,40,0.4)",
            }}
          >
            Visited
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visited.map((trip, i) => (
              <CoverCard
                key={trip.slug}
                trip={trip}
                index={i}
                content={tripContents[trip.slug]}
              />
            ))}
          </div>
        </section>
      )}

      {/* Wishlist */}
      {wishlist.length > 0 && (
        <section>
          <h2
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs"
            style={{
              fontFamily: "var(--font-sans)",
              color: "rgba(80,60,40,0.4)",
            }}
          >
            Wishlist
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((trip, i) => (
              <CoverCard
                key={trip.slug}
                trip={trip}
                index={visited.length + i}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
