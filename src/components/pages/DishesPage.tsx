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
    <ItemSlideshow
      items={items}
      signatureColor={trip.signatureColor}
      heading={heading}
      headerExtra={
        <span className="text-xs text-gris">
          {tried.size}/{items.length} tried
        </span>
      }
      renderFooter={(index) => (
        <button
          onClick={() => toggleDish(index)}
          className="mt-4 flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-sm transition-all"
          style={{
            borderColor: tried.has(index) ? trip.signatureColor : "#ebe5d8",
            backgroundColor: tried.has(index)
              ? trip.signatureColor + "20"
              : "transparent",
          }}
        >
          {tried.has(index) ? (
            <>
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
