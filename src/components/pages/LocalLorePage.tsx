"use client";

import Markdown from "markdown-to-jsx";
import { Trip } from "@/lib/types";

export default function LocalLorePage({
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
      <div className="booklet-content">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
