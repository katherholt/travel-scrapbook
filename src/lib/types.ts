export type TripStatus = "past" | "upcoming" | "future";

export interface Trip {
  slug: string;
  title: string;
  region: string;
  country: string;
  status: TripStatus;
  signatureColor: string;
  coverImage: string;
  postcardImage: string;
  tintStrength: number;
  coordinates: { lat: number; lng: number };
  contentPath: string;
  pages: string[];
  locked: boolean;
}

export interface TripPage {
  id: string;
  title: string;
}
