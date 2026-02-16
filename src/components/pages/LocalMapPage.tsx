"use client";

import Markdown from "markdown-to-jsx";
import { Trip } from "@/lib/types";

export default function LocalMapPage({
  content,
  trip,
}: {
  content: string;
  trip: Trip;
}) {
  return (
    <div className="p-6 sm:p-8">
      <div
        className="mb-4 h-1 w-8 rounded-full"
        style={{ backgroundColor: trip.signatureColor }}
      />
      {/* Simple illustrated map placeholder */}
      <div
        className="mb-6 flex h-40 items-center justify-center rounded-xl border-2 border-dashed"
        style={{ borderColor: trip.signatureColor + "40" }}
      >
        <div className="text-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke={trip.signatureColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-xs text-gris">Local map illustration</p>
        </div>
      </div>
      <div className="booklet-content">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
