# Field Notes Trips

A travel scrapbook web app with a print/zine-inspired aesthetic. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Add a Trip

### 1. Create the markdown content

Create a new file in `content/trips/your-trip-slug.md`:

```markdown
---
title: "Trip Title"
slug: "your-trip-slug"
status: "past"
region: "Region"
country: "Country"
---

<!-- PAGE: about -->
# Trip Title
Your about content here...

<!-- PAGE: local-map -->
## Local Map
Map content...

<!-- PAGE: itinerary -->
## Itinerary
Day-by-day plan...

<!-- PAGE: local-lore -->
## Local Lore
Stories and facts...

<!-- PAGE: crossword -->
## Mini Crossword
Puzzle clues...

<!-- PAGE: dishes -->
## 3 Dishes to Try
Food recommendations...

<!-- PAGE: teaser -->
## Next Getaway
Teaser for the next trip...
```

Each page section is delimited by `<!-- PAGE: page-id -->` comments. The page IDs must match the `pages` array in the trip data.

### 2. Add the trip to the data model

Edit `src/data/trips.ts` and add a new entry to the `trips` array:

```typescript
{
  slug: "your-trip-slug",
  title: "Trip Title",
  region: "Region",
  country: "Country",
  status: "past",           // "past" | "upcoming" | "future"
  signatureColor: "#FF8C00", // Pick from the accent palette
  coverImage: "https://images.unsplash.com/photo-xxx",
  tintStrength: 0.4,         // 0–1, how strong the color overlay is
  coordinates: { lat: 0, lng: 0 },
  contentPath: "/content/trips/your-trip-slug.md",
  pages: ["cover", "about", "local-map", "itinerary", "local-lore", "crossword", "dishes", "teaser"],
  locked: false,             // true = blurred + locked on home grid
}
```

### 3. Choose a signature color

Pick a color from the accent palette that doesn't clash with adjacent trips in the grid:

| Color | Hex |
|-------|-----|
| Menthe | `#B2E1D2` |
| Orange | `#FF8C00` |
| Gingembre | `#CD9A62` |
| Vert | `#0E6922` |
| Melon | `#F3C1AA` |
| Rouge | `#E54127` |
| Lime | `#D8EB27` |
| Turquoise | `#007B82` |
| Bourgogne | `#5E183B` |
| Lilac | `#BDBDF7` |
| Forêt | `#003C38` |
| Rose | `#F892C5` |
| Mangue | `#FFC20E` |
| Chocolat | `#945526` |
| Framboise | `#B7274D` |
| Ciel | `#78C5F8` |

### 4. Swap the heading font to Sentient

Edit `src/app/fonts.ts` and replace the `Libre_Baskerville` import with your Sentient font file using `next/font/local`.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts + grain
│   ├── page.tsx            # Server component: loads markdown
│   ├── fonts.ts            # Font configuration
│   └── globals.css         # Tailwind + custom styles
├── components/
│   ├── HomeClient.tsx      # Main client-side home page
│   ├── Header.tsx          # Title + view toggle
│   ├── CoverCard.tsx       # Individual trip cover card
│   ├── CoverGrid.tsx       # Grid of cover cards
│   ├── ViewToggle.tsx      # Grid/Map toggle (desktop only)
│   ├── MapView.tsx         # World map with trip markers
│   ├── BookletModal.tsx    # Modal overlay for booklet
│   ├── BookletCarousel.tsx # Carousel with swipe + arrows
│   ├── pages/              # Booklet page components
│   │   ├── CoverPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── LocalMapPage.tsx
│   │   ├── ItineraryPage.tsx
│   │   ├── LocalLorePage.tsx
│   │   ├── CrosswordPage.tsx
│   │   ├── DishesPage.tsx
│   │   └── TeaserPage.tsx
│   └── ui/
│       ├── GrainOverlay.tsx
│       └── LockOverlay.tsx
├── data/
│   └── trips.ts            # Trip data model
├── lib/
│   ├── types.ts            # TypeScript types
│   └── markdown.ts         # Markdown loading utilities
content/
└── trips/
    ├── portland-maine.md   # Full Portland content
    └── mexico-city.md     # Mexico City placeholder
```

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — subtle transitions
- **gray-matter + markdown-to-jsx** — markdown parsing
- **React Simple Maps** — world map (desktop only)
- **@use-gesture/react** — swipe support
