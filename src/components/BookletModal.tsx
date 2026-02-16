"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trip } from "@/lib/types";
import BookletCarousel from "./BookletCarousel";

interface BookletModalProps {
  trip: Trip | null;
  content: string;
  onClose: () => void;
}

export default function BookletModal({
  trip,
  content,
  onClose,
}: BookletModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (trip) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [trip, handleEsc]);

  return (
    <AnimatePresence>
      {trip && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-noir/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-sable bg-creme shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-creme/80 text-noir/60 shadow-sm transition-colors hover:bg-sable hover:text-noir"
                aria-label="Close booklet"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Booklet carousel */}
              <BookletCarousel trip={trip} content={content} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
