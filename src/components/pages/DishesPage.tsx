"use client";

import { useState, useMemo } from "react";
import { Trip } from "@/lib/types";
import ItemSlideshow, {
  parseItemsFromMarkdown,
} from "@/components/ItemSlideshow";

export default function DishesPage({
  content,
  trip,
}: {
  content: string;
  trip: Trip;
}) {
  const [tried, setTried] = useState<Set<number>>(new Set());
  const { heading, items } = useMemo(
    () => parseItemsFromMarkdown(content),
    [content]
  );

  const toggleDish = (index: number) => {
    setTried((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="p-6 sm:p-8">
      <div
        className="mb-4 h-1 w-8 rounded-full"
        style={{ backgroundColor: trip.signatureColor }}
      />

      {/* Interactive checklist header */}
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-serif text-xl font-bold">3 Places to Eat</h2>
        <span className="text-xs text-gris">
          {tried.size}/3 tried
        </span>
      </div>

      {/* Dish checkboxes */}
      <div className="mb-4 flex gap-2">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => toggleDish(i)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all"
            style={{
              borderColor: tried.has(i) ? trip.signatureColor : "#ebe5d8",
              backgroundColor: tried.has(i)
                ? trip.signatureColor + "20"
                : "transparent",
            }}
          >
            {tried.has(i) && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={trip.signatureColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tried!
            </>
          ) : (
            "Mark as tried"
          )}
        </button>
      )}
    />
  );
}
