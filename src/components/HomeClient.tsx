"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Trip } from "@/lib/types";
import Header from "./Header";
import CoverGrid from "./CoverGrid";
import MapView from "./MapView";
import BookletModal from "./BookletModal";
import SplitFlapLoader from "./SplitFlapLoader";

interface HomeClientProps {
  trips: Trip[];
  tripContents: Record<string, string>;
}

export default function HomeClient({ trips, tripContents }: HomeClientProps) {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleMapTripClick = (trip: Trip) => {
    if (!trip.locked) setSelectedTrip(trip);
  };

  return (
    <>
      {loading && <SplitFlapLoader onComplete={() => setLoading(false)} />}
      <main
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
        style={{ visibility: loading ? "hidden" : "visible" }}
      >
        <LayoutGroup>
          <Header view={view} onToggle={setView} />

          <AnimatePresence mode="wait">
            {view === "grid" ? (
              <CoverGrid
                key="grid"
                trips={trips}
                tripContents={tripContents}
              />
            ) : (
              <div key="map" className="hidden lg:block">
                <MapView trips={trips} onTripClick={handleMapTripClick} />
              </div>
            )}
          </AnimatePresence>
        </LayoutGroup>

        <BookletModal
          trip={selectedTrip}
          content={selectedTrip ? tripContents[selectedTrip.slug] || "" : ""}
          onClose={() => setSelectedTrip(null)}
        />
      </main>
    </>
  );
}
