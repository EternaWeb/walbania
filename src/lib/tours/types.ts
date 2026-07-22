export type TourLocale = "en" | "fr";
export type TourStatus = "draft" | "published" | "archived";
export type TourDurationUnit = "hours" | "days";
export type TourListKind = "included" | "excluded" | "bring";
export type TourMediaRole = "hero" | "gallery";
export type TravelType = "solo" | "couple" | "family" | "friends" | "group" | "business" | "other";

export type TourTranslation = {
  locale: TourLocale;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroBadge: string;
  locationLabel: string;
  heroIntro: string;
  overviewTitle: string;
  overviewSummary: string;
  overviewBody: string;
  bestSeasonTitle: string;
  bestSeasonBody: string;
  routeTitle: string;
  routeDescription: string;
  cancellationSummary: string;
  heroAlt: string;
};

export type TourHighlight = {
  id?: string;
  iconKey: string;
  labelEn: string;
  labelFr: string;
  textEn: string;
  textFr: string;
  sortOrder: number;
};

export type TourMedia = {
  id?: string;
  assetId?: string;
  role: TourMediaRole;
  storagePath: string;
  publicUrl: string;
  altEn: string;
  altFr: string;
  sortOrder: number;
};

export type TourMediaAsset = {
  assetId?: string;
  storagePath: string;
  publicUrl: string;
  altEn: string;
  altFr: string;
};

export type TourListItem = {
  id?: string;
  kind: TourListKind;
  textEn: string;
  textFr: string;
  sortOrder: number;
};

export type TourWeatherStat = {
  id?: string;
  iconKey: string;
  value: string;
  labelEn: string;
  labelFr: string;
  sortOrder: number;
};

export type TourFaq = {
  id?: string;
  questionEn: string;
  questionFr: string;
  answerEn: string;
  answerFr: string;
  sortOrder: number;
};

export type TourItineraryStopInput = {
  id?: string;
  time: string;
  durationMinutes: number;
  typeEn: string;
  typeFr: string;
  placeEn: string;
  placeFr: string;
  descriptionEn: string;
  descriptionFr: string;
  locationQuery: string;
  locationLabel: string;
  longitude: number | null;
  latitude: number | null;
  osmReference: string;
  sortOrder: number;
};

export type TourDateOverride = {
  date: string;
  isAvailable: boolean;
  priceEur: number | null;
};

export type TourEditorPayload = {
  id?: string;
  status: TourStatus;
  featured: boolean;
  basePriceEur: number;
  discountPercent: number | null;
  defaultAvailable: boolean;
  durationValue: number;
  durationUnit: TourDurationUnit;
  maxGroupSize: number;
  languageCodes: string[];
  startPlace: string;
  endPlace: string;
  accessibilityEn: string;
  accessibilityFr: string;
  regionEn: string;
  regionFr: string;
  routeDistanceKm: number | null;
  tourTypeId: string | null;
  difficultyId: string | null;
  categoryIds: string[];
  translations: Record<TourLocale, TourTranslation>;
  highlights: TourHighlight[];
  media: TourMedia[];
  listItems: TourListItem[];
  weatherStats: TourWeatherStat[];
  faqs: TourFaq[];
  itinerary: TourItineraryStopInput[];
  dateOverrides: TourDateOverride[];
  reviewIds: string[];
};

export type TaxonomyKind = "categories" | "tour_types" | "difficulties";

export type TaxonomyItem = {
  id: string;
  key: string;
  nameEn: string;
  nameFr: string;
  active: boolean;
};

export type ReviewRecord = {
  id: string;
  name: string;
  reviewDate: string;
  nationCode: string;
  rating: number;
  travelType: TravelType;
  originalLanguage: string;
  bodyOriginal: string;
  bodyEn: string;
  bodyFr: string;
  createdAt?: string;
};

export type LocalizedHighlight = {
  iconKey: string;
  label: string;
  text: string;
};

export type LocalizedListItem = {
  kind: TourListKind;
  text: string;
};

export type LocalizedWeatherStat = {
  iconKey: string;
  value: string;
  label: string;
};

export type LocalizedFaq = {
  question: string;
  answer: string;
};

export type LocalizedItineraryStop = {
  id: string;
  sequence: number;
  time: string;
  place: string;
  duration: string;
  text: string;
  tag: string;
  location?: {
    id: string;
    label: string;
    coordinates: readonly [number, number];
    osmReference?: string;
  };
};

export type LocalizedReview = {
  id: string;
  name: string;
  reviewDate: string;
  nationCode: string;
  rating: number;
  travelType: TravelType;
  body: string;
};

export type RelatedTour = {
  id: string;
  title: string;
  href: string;
  image: string;
  meta: string;
  priceEur: number;
  badge: string;
};

export type TourListingCategory = {
  id: string;
  key: string;
  name: string;
  count: number;
};

export type TourListingTaxonomy = {
  id: string;
  key: string;
  name: string;
};

export type TourListingCard = {
  id: string;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
  duration: string;
  typeId: string | null;
  typeName: string;
  difficultyId: string | null;
  priceEur: number;
  maxGroupSize: number;
  categoryIds: string[];
  defaultAvailable: boolean;
  dateOverrides: Array<{ date: string; isAvailable: boolean }>;
  featured: boolean;
};

export type TourListingData = {
  categories: TourListingCategory[];
  tourTypes: TourListingTaxonomy[];
  difficulties: TourListingTaxonomy[];
  tours: TourListingCard[];
};

export type TourViewModel = {
  id: string;
  locale: TourLocale;
  status: TourStatus;
  featured: boolean;
  title: string;
  slug: string;
  siteUrl: string;
  href: string;
  alternateHref: string;
  alternateLocale: TourLocale;
  seoTitle: string;
  seoDescription: string;
  heroBadge: string;
  heroImage: string;
  heroAlt: string;
  locationLabel: string;
  heroIntro: string;
  overviewTitle: string;
  overviewSummary: string;
  overviewBody: string;
  bestSeasonTitle: string;
  bestSeasonBody: string;
  routeTitle: string;
  routeDescription: string;
  cancellationSummary: string;
  basePriceEur: number;
  discountPercent: number | null;
  defaultAvailable: boolean;
  durationValue: number;
  durationUnit: TourDurationUnit;
  maxGroupSize: number;
  languageCodes: string[];
  startPlace: string;
  endPlace: string;
  accessibility: string;
  region: string;
  routeDistanceKm: number | null;
  typeName: string;
  difficultyName: string;
  categoryNames: string[];
  categoryIds: string[];
  gallery: Array<{ src: string; alt: string }>;
  highlights: LocalizedHighlight[];
  listItems: LocalizedListItem[];
  weatherStats: LocalizedWeatherStat[];
  faqs: LocalizedFaq[];
  itinerary: LocalizedItineraryStop[];
  dateOverrides: TourDateOverride[];
  reviews: LocalizedReview[];
  ratingAverage: number | null;
  ratingCount: number;
  relatedTours: RelatedTour[];
  publishedAt: string | null;
  updatedAt: string;
};

export type TourListRow = {
  id: string;
  status: TourStatus;
  featured: boolean;
  titleEn: string;
  titleFr: string;
  slugEn: string;
  slugFr: string;
  basePriceEur: number;
  updatedAt: string;
  publishedAt: string | null;
};

export type PublishResult = {
  id: string;
  status: TourStatus;
  englishUrl: string;
  frenchUrl: string;
};

export type GeocodeCandidate = {
  displayName: string;
  longitude: number;
  latitude: number;
  osmReference: string;
  type: string;
};

export const emptyTranslation = (locale: TourLocale): TourTranslation => ({
  locale,
  slug: "",
  title: "",
  seoTitle: "",
  seoDescription: "",
  heroBadge: "",
  locationLabel: "",
  heroIntro: "",
  overviewTitle: "",
  overviewSummary: "",
  overviewBody: "",
  bestSeasonTitle: "",
  bestSeasonBody: "",
  routeTitle: "",
  routeDescription: "",
  cancellationSummary: "",
  heroAlt: "",
});

export const createEmptyTour = (): TourEditorPayload => ({
  status: "draft",
  featured: false,
  basePriceEur: 0,
  discountPercent: null,
  defaultAvailable: true,
  durationValue: 8,
  durationUnit: "hours",
  maxGroupSize: 8,
  languageCodes: ["EN", "FR", "SQ"],
  startPlace: "",
  endPlace: "",
  accessibilityEn: "Ask our team",
  accessibilityFr: "Contactez notre équipe",
  regionEn: "",
  regionFr: "",
  routeDistanceKm: null,
  tourTypeId: null,
  difficultyId: null,
  categoryIds: [],
  translations: {
    en: emptyTranslation("en"),
    fr: emptyTranslation("fr"),
  },
  highlights: [],
  media: [],
  listItems: [],
  weatherStats: [],
  faqs: [],
  itinerary: [],
  dateOverrides: [],
  reviewIds: [],
});
