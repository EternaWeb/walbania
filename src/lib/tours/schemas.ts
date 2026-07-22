import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(3)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.");

const translationSchema = z.object({
  locale: z.enum(["en", "fr"]),
  slug: z.string().trim().max(100),
  title: z.string().trim().max(180),
  seoTitle: z.string().trim().max(180),
  seoDescription: z.string().trim().max(320),
  heroBadge: z.string().trim().max(80),
  locationLabel: z.string().trim().max(160),
  heroIntro: z.string().trim().max(600),
  overviewTitle: z.string().trim().max(180),
  overviewSummary: z.string().trim().max(500),
  overviewBody: z.string().trim().max(5000),
  bestSeasonTitle: z.string().trim().max(180),
  bestSeasonBody: z.string().trim().max(1500),
  routeTitle: z.string().trim().max(180),
  routeDescription: z.string().trim().max(1000),
  cancellationSummary: z.string().trim().max(500),
  heroAlt: z.string().trim().max(240),
});

const ordered = {
  id: z.string().uuid().optional(),
  sortOrder: z.number().int().min(0),
};

export const tourEditorSchema = z.object({
  id: z.string().uuid().optional(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
  basePriceEur: z.number().finite().min(0).max(100000),
  discountPercent: z.number().int().min(1).max(99).nullable(),
  defaultAvailable: z.boolean(),
  durationValue: z.number().finite().min(0.5).max(1000),
  durationUnit: z.enum(["hours", "days"]),
  maxGroupSize: z.number().int().min(1).max(10000),
  languageCodes: z.array(z.string().trim().min(2).max(12)).max(20),
  startPlace: z.string().trim().max(180),
  endPlace: z.string().trim().max(180),
  accessibilityEn: z.string().trim().max(500),
  accessibilityFr: z.string().trim().max(500),
  regionEn: z.string().trim().max(180),
  regionFr: z.string().trim().max(180),
  routeDistanceKm: z.number().finite().min(0).max(100000).nullable(),
  tourTypeId: z.string().uuid().nullable(),
  difficultyId: z.string().uuid().nullable(),
  categoryIds: z.array(z.string().uuid()),
  translations: z.object({
    en: translationSchema,
    fr: translationSchema,
  }),
  highlights: z.array(
    z.object({
      ...ordered,
      iconKey: z.string().trim().min(1).max(50),
      labelEn: z.string().trim().max(120),
      labelFr: z.string().trim().max(120),
      textEn: z.string().trim().max(600),
      textFr: z.string().trim().max(600),
    }),
  ),
  media: z.array(
    z.object({
      ...ordered,
      assetId: z.string().uuid().optional(),
      role: z.enum(["hero", "gallery"]),
      storagePath: z.string().trim().min(1).max(500),
      publicUrl: z.string().url().max(1500),
      altEn: z.string().trim().max(240),
      altFr: z.string().trim().max(240),
    }),
  ),
  listItems: z.array(
    z.object({
      ...ordered,
      kind: z.enum(["included", "excluded", "bring"]),
      textEn: z.string().trim().max(500),
      textFr: z.string().trim().max(500),
    }),
  ),
  weatherStats: z.array(
    z.object({
      ...ordered,
      iconKey: z.string().trim().min(1).max(50),
      value: z.string().trim().max(80),
      labelEn: z.string().trim().max(180),
      labelFr: z.string().trim().max(180),
    }),
  ),
  faqs: z.array(
    z.object({
      ...ordered,
      questionEn: z.string().trim().max(500),
      questionFr: z.string().trim().max(500),
      answerEn: z.string().trim().max(2500),
      answerFr: z.string().trim().max(2500),
    }),
  ),
  itinerary: z.array(
    z.object({
      ...ordered,
      time: z.string().regex(/^\d{2}:\d{2}$/),
      durationMinutes: z.number().int().min(1).max(10080),
      typeEn: z.string().trim().max(120),
      typeFr: z.string().trim().max(120),
      placeEn: z.string().trim().max(180),
      placeFr: z.string().trim().max(180),
      descriptionEn: z.string().trim().max(2500),
      descriptionFr: z.string().trim().max(2500),
      locationQuery: z.string().trim().max(500),
      locationLabel: z.string().trim().max(500),
      longitude: z.number().min(-180).max(180).nullable(),
      latitude: z.number().min(-90).max(90).nullable(),
      osmReference: z.string().trim().max(120),
    }),
  ),
  dateOverrides: z.array(
    z.object({
      date: z.string().date(),
      isAvailable: z.boolean(),
      priceEur: z.number().finite().min(0).max(100000).nullable(),
    }),
  ),
  reviewIds: z.array(z.string().uuid()),
});

export const publicTourLookupSchema = z.object({
  slug,
  locale: z.enum(["en", "fr"]),
});

export const taxonomyInputSchema = z.object({
  kind: z.enum(["categories", "tour_types", "difficulties"]),
  id: z.string().uuid().optional(),
  key: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  nameEn: z.string().trim().min(1).max(120),
  nameFr: z.string().trim().min(1).max(120),
  active: z.boolean().default(true),
});

export const reviewInputSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(160),
  reviewDate: z.string().date(),
  nationCode: z
    .string()
    .trim()
    .length(2)
    .transform((value) => value.toUpperCase()),
  rating: z.number().int().min(1).max(5),
  travelType: z.enum(["solo", "couple", "family", "friends", "group", "business", "other"]),
  originalLanguage: z.string().trim().min(2).max(16),
  bodyOriginal: z.string().trim().min(1).max(5000),
  bodyEn: z.string().trim().max(5000),
  bodyFr: z.string().trim().max(5000),
});

export function validateForPublish(input: z.infer<typeof tourEditorSchema>) {
  const problems: string[] = [];
  for (const locale of ["en", "fr"] as const) {
    const translation = input.translations[locale];
    const language = locale === "en" ? "English" : "French";
    const required: Array<[string, string]> = [
      ["slug", translation.slug],
      ["title", translation.title],
      ["SEO title", translation.seoTitle],
      ["SEO description", translation.seoDescription],
      ["hero introduction", translation.heroIntro],
      ["overview title", translation.overviewTitle],
      ["overview text", translation.overviewBody],
      ["best-season title", translation.bestSeasonTitle],
      ["best-season text", translation.bestSeasonBody],
      ["hero alt text", translation.heroAlt],
    ];
    for (const [label, value] of required) {
      if (!value.trim()) problems.push(`${language} ${label} is required.`);
    }
    const slugResult = slug.safeParse(translation.slug);
    if (!slugResult.success) problems.push(`${language} slug is invalid.`);
  }
  if (input.basePriceEur <= 0) problems.push("A base price is required.");
  if (!input.tourTypeId) problems.push("A tour type is required.");
  if (!input.difficultyId) problems.push("A difficulty is required.");
  if (input.categoryIds.length === 0) problems.push("At least one category is required.");
  if (!input.media.some((item) => item.role === "hero")) problems.push("A hero image is required.");
  if (!input.media.some((item) => item.role === "gallery")) {
    problems.push("At least one gallery image is required.");
  }
  if (input.media.some((item) => !item.altEn.trim() || !item.altFr.trim())) {
    problems.push("Every image needs English and French alt text.");
  }
  if (input.highlights.length === 0) problems.push("At least one highlight is required.");
  if (!input.listItems.some((item) => item.kind === "included")) {
    problems.push("At least one included item is required.");
  }
  if (input.weatherStats.length === 0) problems.push("At least one weather statistic is required.");
  if (input.itinerary.length === 0) problems.push("At least one itinerary stop is required.");
  if (input.itinerary.some((item) => item.longitude === null || item.latitude === null)) {
    problems.push("Every itinerary stop must have a confirmed map location.");
  }
  return problems;
}
