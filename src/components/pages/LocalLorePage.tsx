"use client";

import { useMemo } from "react";
import { Trip } from "@/lib/types";
import ItemSlideshow, {
  parseItemsFromMarkdown,
} from "@/components/ItemSlideshow";

export default function LocalLorePage({
  content,
  trip,
}: {
  content: string;
  trip: Trip;
}) {
  const { heading, items } = useMemo(
    () => parseItemsFromMarkdown(content),
    [content]
  );

  return (
    <ItemSlideshow
      items={items}
      signatureColor={trip.signatureColor}
      heading={heading}
    />
  );
}
