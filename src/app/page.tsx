import { trips } from "@/data/trips";
import { getTripMarkdown } from "@/lib/markdown";
import HomeClient from "@/components/HomeClient";

// Pre-load markdown content for unlocked trips at build/request time
function loadTripContents(): Record<string, string> {
  const contents: Record<string, string> = {};
  for (const trip of trips) {
    if (!trip.locked) {
      try {
        const { content } = getTripMarkdown(trip.slug);
        contents[trip.slug] = content;
      } catch {
        contents[trip.slug] = "";
      }
    }
  }
  return contents;
}

export default function HomePage() {
  const tripContents = loadTripContents();

  return <HomeClient trips={trips} tripContents={tripContents} />;
}
