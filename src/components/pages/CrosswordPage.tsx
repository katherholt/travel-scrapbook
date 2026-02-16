"use client";

import Markdown from "markdown-to-jsx";
import { Trip } from "@/lib/types";

export default function CrosswordPage({
  content,
  trip,
}: {
  content: string;
  trip: Trip;
}) {
  // Simple placeholder crossword grid
  const gridSize = 6;
  const filledCells = new Set([
    "0-0", "0-1", "0-2", "0-3", "0-4",
    "1-2",
    "2-0", "2-1", "2-2", "2-3", "2-4", "2-5",
    "3-2",
    "4-0", "4-1", "4-2", "4-3", "4-4",
  ]);

  return (
    <div className="p-6 sm:p-8">
      <div
        className="mb-4 h-1 w-8 rounded-full"
        style={{ backgroundColor: trip.signatureColor }}
      />

      {/* Grid */}
      <div className="mb-6 flex justify-center">
        <div
          className="inline-grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 2rem)`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const key = `${row}-${col}`;
            const filled = filledCells.has(key);
            return (
              <div
                key={key}
                className={`flex h-8 w-8 items-center justify-center border text-xs font-mono ${
                  filled
                    ? "border-noir/20 bg-white"
                    : "border-transparent bg-sable/30"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Clues from markdown */}
      <div className="booklet-content text-sm">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
