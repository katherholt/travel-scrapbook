"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface SlideshowItem {
  title: string;
  image: string;
  description: string;
}

export function parseItemsFromMarkdown(markdown: string): {
  heading: string;
  items: SlideshowItem[];
} {
  const headingMatch = markdown.match(/^##\s+(.+)/m);
  const heading = headingMatch ? headingMatch[1].trim() : "";

  const cleaned = markdown
    .replace(/^##[^\n]*\n/, "")
    .replace(/\n---\s*$/, "")
    .trim();

  const items: SlideshowItem[] = [];
  const titleRegex = /###\s+\d+\.\s+(.+)/g;
  const parts = cleaned.split(/###\s+\d+\.\s+[^\n]*/);
  const titles: string[] = [];

  let match;
  while ((match = titleRegex.exec(cleaned)) !== null) {
    titles.push(match[1].trim());
  }

  for (let i = 0; i < titles.length; i++) {
    const section = parts[i + 1]?.trim() || "";
    const imageMatch = section.match(/!\[.*?\]\((.*?)\)/);
    const image = imageMatch ? imageMatch[1] : "";
    const description = section.replace(/!\[.*?\]\(.*?\)\n?/, "").trim();

    items.push({ title: titles[i], image, description });
  }

  return { heading, items };
}

interface ItemSlideshowProps {
  items: SlideshowItem[];
  signatureColor: string;
  heading: string;
  headerExtra?: React.ReactNode;
  renderFooter?: (index: number) => React.ReactNode;
}

export default function ItemSlideshow({
  items,
  signatureColor,
  heading,
  headerExtra,
  renderFooter,
}: ItemSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, items.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const item = items[currentIndex];
  if (!item) return null;

  const imageVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div>
      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-sable">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {item.image && (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
              />
            )}
            {/* Subtle color tint */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: signatureColor,
                opacity: 0.1,
                mixBlendMode: "multiply",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Left arrow */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-all hover:bg-white"
            aria-label="Previous item"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {currentIndex < items.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-all hover:bg-white"
            aria-label="Next item"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Item counter badge */}
        <div className="absolute bottom-3 left-3 z-10 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
          {currentIndex + 1} / {items.length}
        </div>
      </div>

      {/* Content below image */}
      <div className="p-6 sm:p-8">
        {/* Heading row with dots */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-1 w-8 rounded-full"
              style={{ backgroundColor: signatureColor }}
            />
            <h2 className="font-sans text-xl font-bold">{heading}</h2>
            {headerExtra}
          </div>
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-4" : "w-1.5"
                }`}
                style={{
                  backgroundColor:
                    i === currentIndex ? signatureColor : "#BBB8B5",
                }}
                aria-label={`Go to item ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Item title and description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="mb-2 font-sans text-lg font-bold">{item.title}</h3>
            <p className="text-sm leading-relaxed text-noir/60">
              {item.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Optional footer (e.g., tried button for dishes) */}
        {renderFooter && renderFooter(currentIndex)}
      </div>
    </div>
  );
}
