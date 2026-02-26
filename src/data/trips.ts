import { Trip } from "@/lib/types";

export const trips: Trip[] = [
  {
    slug: "portland-maine",
    title: "Portland, Maine",
    region: "New England",
    country: "USA",
    status: "past",
    signatureColor: "#FF8C00", // Orange
    coverImage:
      "https://images.unsplash.com/photo-1582488719899-a2a54cb479fe?w=800&h=1000&fit=crop",
    postcardImage: "/postcards/portland.png",
    tintStrength: 0.45,
    coordinates: { lat: 43.6591, lng: -70.2568 },
    contentPath: "/content/trips/portland-maine.md",
    pages: [
      "cover",
      "about",
      "dishes",
      "local-lore",
      "phrases",
    ],
    locked: false,
  },
  {
    slug: "mexico-city",
    title: "Mexico City",
    region: "Central Mexico",
    country: "Mexico",
    status: "upcoming",
    signatureColor: "#007B82", // Turquoise
    coverImage:
      "https://images.unsplash.com/photo-1518659526054-190340b32735?w=800&h=1000&fit=crop",
    postcardImage: "/postcards/cmdx.png",
    tintStrength: 0.4,
    coordinates: { lat: 19.4326, lng: -99.1332 },
    contentPath: "/content/trips/mexico-city.md",
    pages: [
      "cover",
      "about",
      "dishes",
      "local-lore",
      "phrases",
    ],
    locked: false,
  },
  {
    slug: "hong-kong",
    title: "Hong Kong",
    region: "East Asia",
    country: "China",
    status: "future",
    signatureColor: "#FFC20E", // Mangue
    coverImage:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&h=1000&fit=crop",
    postcardImage: "/postcards/hk.png",
    tintStrength: 0.45,
    coordinates: { lat: 22.3193, lng: 114.1694 },
    contentPath: "/content/trips/hong-kong.md",
    pages: [],
    locked: true,
  },
  {
    slug: "japan-ski",
    title: "Japan (Ski)",
    region: "Hokkaido",
    country: "Japan",
    status: "future",
    signatureColor: "#78C5F8", // Ciel
    coverImage:
      "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&h=1000&fit=crop",
    postcardImage: "/postcards/japan.png",
    tintStrength: 0.4,
    coordinates: { lat: 43.0642, lng: 141.3469 },
    contentPath: "/content/trips/japan-ski.md",
    pages: [],
    locked: true,
  },
  {
    slug: "tuscany",
    title: "Tuscany",
    region: "Central Italy",
    country: "Italy",
    status: "future",
    signatureColor: "#CD9A62", // Gingembre
    coverImage:
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=1000&fit=crop",
    postcardImage: "/postcards/italy.png",
    tintStrength: 0.4,
    coordinates: { lat: 43.7711, lng: 11.2486 },
    contentPath: "/content/trips/tuscany.md",
    pages: [],
    locked: true,
  },
  {
    slug: "new-zealand",
    title: "New Zealand",
    region: "South Island",
    country: "New Zealand",
    status: "future",
    signatureColor: "#003C38", // Forêt
    coverImage:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&h=1000&fit=crop",
    postcardImage: "/postcards/nz.png",
    tintStrength: 0.5,
    coordinates: { lat: -44.0, lng: 170.5 },
    contentPath: "/content/trips/new-zealand.md",
    pages: [],
    locked: true,
  },
];

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}
