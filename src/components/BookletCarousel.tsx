"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { Trip } from "@/lib/types";
import CoverPage from "./pages/CoverPage";
import AboutPage from "./pages/AboutPage";
import LocalMapPage from "./pages/LocalMapPage";
import ItineraryPage from "./pages/ItineraryPage";
import LocalLorePage from "./pages/LocalLorePage";
import CrosswordPage from "./pages/CrosswordPage";
import DishesPage from "./pages/DishesPage";
import TeaserPage from "./pages/TeaserPage";
import PhrasesPage from "./pages/PhrasesPage";

interface BookletCarouselProps {
  trip: Trip;
  content: string;
}

function splitMarkdownSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = content.split(/<!-- PAGE: (\w[\w-]*) -->/);

  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i];
    const body = parts[i + 1]?.trim() || "";
    sections[key] = body;
  }

  return sections;
}

export default function BookletCarousel({
  trip,
  content,
}: BookletCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const sections = splitMarkdownSections(content);

  const pages = trip.pages;
  const totalPages = pages.length;

  const goTo = useCallback(
    (page: number, dir: number) => {
      if (page >= 0 && page < totalPages) {
        setDirection(dir);
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const goNext = useCallback(
    () => goTo(currentPage + 1, 1),
    [currentPage, goTo]
  );
  const goPrev = useCallback(
    () => goTo(currentPage - 1, -1),
    [currentPage, goTo]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Swipe gesture
  const bind = useGesture(
    {
      onDrag: ({ direction: [dx], distance: [dist], cancel }) => {
        if (dist > 50) {
          if (dx < 0) goNext();
          else if (dx > 0) goPrev();
          cancel();
        }
      },
    },
    { drag: { axis: "x", filterTaps: true } }
  );

  const renderPage = (pageId: string) => {
    const md = sections[pageId] || "";
    switch (pageId) {
      case "cover":
        return <CoverPage trip={trip} />;
      case "about":
        return <AboutPage content={md} trip={trip} />;
      case "local-map":
        return <LocalMapPage content={md} trip={trip} />;
      case "itinerary":
        return <ItineraryPage content={md} trip={trip} />;
      case "local-lore":
        return <LocalLorePage content={md} trip={trip} />;
      case "crossword":
        return <CrosswordPage content={md} trip={trip} />;
      case "dishes":
        return <DishesPage content={md} trip={trip} />;
      case "teaser":
        return <TeaserPage content={md} trip={trip} />;
      case "phrases":
        return <PhrasesPage content={md} trip={trip} />;
      default:
        return <div className="p-8">Page not found</div>;
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col" {...bind()}>
      {/* Page content area */}
      <div className="relative min-h-[60vh] max-h-[70vh] overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-full overflow-y-auto"
          >
            {renderPage(pages[currentPage])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation bar */}
      <div className="flex items-center justify-between border-t border-sable px-4 py-3">
        {/* Left arrow */}
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className="flex h-8 w-8 items-center justify-center rounded-full text-noir/40 transition-colors hover:bg-sable hover:text-noir disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > currentPage ? 1 : -1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentPage
                  ? "w-4"
                  : "w-1.5 hover:bg-gris"
              }`}
              style={{
                backgroundColor:
                  i === currentPage ? trip.signatureColor : "#BBB8B5",
              }}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={goNext}
          disabled={currentPage === totalPages - 1}
          className="flex h-8 w-8 items-center justify-center rounded-full text-noir/40 transition-colors hover:bg-sable hover:text-noir disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
