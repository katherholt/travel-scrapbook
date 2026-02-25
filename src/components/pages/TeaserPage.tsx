"use client";

import Markdown from "markdown-to-jsx";
import { Trip } from "@/lib/types";

export default function TeaserPage({
  content,
  trip,
}: {
  content: string;
  trip: Trip;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center sm:p-8">
      <div
        className="mb-6 h-1 w-8 rounded-full"
        style={{ backgroundColor: trip.signatureColor }}
      />
      <div className="booklet-content max-w-sm">
        <Markdown>{content}</Markdown>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full animate-pulse"
          style={{ backgroundColor: trip.signatureColor }}
        />
        <span className="font-mono text-xs text-gris uppercase tracking-wider">
          More adventures ahead
        </span>
      </div>
    </div>
  );
}
