import type { TourListingCard } from "../tours/types";

export type PlaceKind = "destination" | "attraction";
export type PlaceStatus = "draft" | "published" | "archived";
export type PlaceLocale = "en" | "fr";
export type PlaceMediaRole = "hero" | "card" | "gallery" | "thumbnail";

export type GlobalMediaAsset = {
  id: string;
  sourceKind: "upload" | "url";
  bucketId: string | null;
  storagePath: string | null;
  publicUrl: string;
  mimeType: string;
  creditName: string;
  creditUrl: string;
};

export type PlaceTranslationInput = {
  locale: PlaceLocale;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroIntro: string;
  heroAlt: string;
  storyTitle: string;
  storyIntro: string;
};

export type PlaceSectionInput = {
  id?: string;
  titleEn: string;
  titleFr: string;
  bodyEn: string;
  bodyFr: string;
  secondaryBodyEn: string;
  secondaryBodyFr: string;
  imageAltEn: string;
  imageAltFr: string;
  mediaAssetId: string | null;
  sortOrder: number;
};

export type PlaceFactInput = {
  id?: string;
  groupKey: "quick" | "weather";
  iconKey: string;
  value: string;
  labelEn: string;
  labelFr: string;
  sortOrder: number;
};

export type PlaceHighlightInput = {
  id?: string;
  iconKey: string;
  labelEn: string;
  labelFr: string;
  textEn: string;
  textFr: string;
  sortOrder: number;
};

export type PlaceMediaInput = {
  id?: string;
  assetId: string;
  role: PlaceMediaRole;
  altEn: string;
  altFr: string;
  sortOrder: number;
};

export type PlaceTourLinkInput = {
  tourId: string;
  relationship: "start" | "visit" | "end" | "area";
  source: "manual" | "itinerary" | "inherited";
  visible: boolean;
  sortOrder: number;
};

export type PlaceEditorPayload = {
  id?: string;
  kind: PlaceKind;
  parentDestinationId: string | null;
  status: PlaceStatus;
  featured: boolean;
  longitude: number | null;
  latitude: number | null;
  mapZoom: number;
  translations: Record<PlaceLocale, PlaceTranslationInput>;
  sections: PlaceSectionInput[];
  facts: PlaceFactInput[];
  highlights: PlaceHighlightInput[];
  media: PlaceMediaInput[];
  tourLinks: PlaceTourLinkInput[];
};

export type PlaceCard = {
  id: string;
  slug: string;
  kind: PlaceKind;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
  parentTitle: string;
  coordinates: readonly [number, number] | null;
};

export type PlaceMapPoint = PlaceCard & {
  summary: string;
};

export type PlaceViewModel = {
  id: string;
  siteUrl: string;
  kind: PlaceKind;
  locale: PlaceLocale;
  status: PlaceStatus;
  title: string;
  slug: string;
  href: string;
  alternateHref: string;
  parent: PlaceCard | null;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  seoImageAlt: string;
  heroIntro: string;
  heroImage: string;
  heroAlt: string;
  storyTitle: string;
  storyIntro: string;
  coordinates: readonly [number, number];
  mapZoom: number;
  sections: Array<{
    title: string;
    body: string;
    secondaryBody: string;
    image: string;
    imageAlt: string;
  }>;
  quickFacts: Array<{ iconKey: string; value: string; label: string }>;
  weatherFacts: Array<{ iconKey: string; value: string; label: string }>;
  highlights: Array<{ iconKey: string; label: string; text: string }>;
  tours: TourListingCard[];
  relatedPlaces: PlaceCard[];
  mapPoints: PlaceMapPoint[];
  updatedAt: string;
};

export type PlaceAdminListRow = {
  id: string;
  kind: PlaceKind;
  status: PlaceStatus;
  titleEn: string;
  titleFr: string;
  slugEn: string;
  parentTitle: string;
  parentSlug: string;
  linkedTourCount: number;
  updatedAt: string;
};

export type PlaceTourReference = TourListingCard & {
  status: string;
  itineraryMatches: Array<{
    stopId: string;
    label: string;
    distanceKm: number;
  }>;
};

export function createEmptyPlace(kind: PlaceKind): PlaceEditorPayload {
  const translation = (locale: PlaceLocale): PlaceTranslationInput => ({
    locale,
    slug: "",
    title: "",
    seoTitle: "",
    seoDescription: "",
    heroIntro: "",
    heroAlt: "",
    storyTitle:
      locale === "fr"
        ? "Trois façons de comprendre ce lieu"
        : "Three ways to understand this place",
    storyIntro:
      locale === "fr"
        ? "Parcourez son histoire, les expériences qui le définissent et les détails utiles pour préparer votre visite."
        : "Scroll through its story, the experiences that define it and the practical details for planning your visit.",
  });
  return {
    kind,
    parentDestinationId: null,
    status: "draft",
    featured: false,
    longitude: null,
    latitude: null,
    mapZoom: kind === "destination" ? 9 : 13,
    translations: { en: translation("en"), fr: translation("fr") },
    sections: Array.from({ length: 3 }, (_, sortOrder) => ({
      titleEn: "",
      titleFr: "",
      bodyEn: "",
      bodyFr: "",
      secondaryBodyEn: "",
      secondaryBodyFr: "",
      imageAltEn: "",
      imageAltFr: "",
      mediaAssetId: null,
      sortOrder,
    })),
    facts: [],
    highlights: [],
    media: [],
    tourLinks: [],
  };
}
