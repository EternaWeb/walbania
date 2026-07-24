import type { TourListingCard } from "../tours/types";

export type CollectionLocale = "en" | "fr";

export type CollectionSummary = {
  id: string;
  key: string;
  name: string;
  href: string;
  image: string;
  imageAlt: string;
  description: string;
  sortOrder: number;
};

export type CollectionDetail = CollectionSummary & {
  tours: TourListingCard[];
};

export type CollectionAdminItem = {
  id: string;
  key: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  heroAssetId: string | null;
  heroAltEn: string;
  heroAltFr: string;
  enabled: boolean;
  active: boolean;
  sortOrder: number;
  image: string;
};

export type CollectionMediaAsset = {
  id: string;
  publicUrl: string;
  creditName: string;
};

export type CollectionAdminData = {
  collections: CollectionAdminItem[];
  mediaAssets: CollectionMediaAsset[];
};
