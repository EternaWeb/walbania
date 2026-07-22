import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.");

const translation = z.object({
  locale: z.enum(["en", "fr"]),
  slug: z.string().trim().max(100),
  title: z.string().trim().max(180),
  seoTitle: z.string().trim().max(180),
  seoDescription: z.string().trim().max(320),
  heroIntro: z.string().trim().max(600),
  heroAlt: z.string().trim().max(240),
  storyTitle: z.string().trim().max(180),
  storyIntro: z.string().trim().max(600),
});

export const placeEditorSchema = z.object({
  id: z.string().uuid().optional(),
  kind: z.enum(["destination", "attraction"]),
  parentDestinationId: z.string().uuid().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean(),
  longitude: z.number().min(-180).max(180).nullable(),
  latitude: z.number().min(-90).max(90).nullable(),
  mapZoom: z.number().min(5).max(18),
  translations: z.object({ en: translation, fr: translation }),
  sections: z.array(
    z.object({
      id: z.string().uuid().optional(),
      titleEn: z.string().trim().max(180),
      titleFr: z.string().trim().max(180),
      bodyEn: z.string().trim().max(5000),
      bodyFr: z.string().trim().max(5000),
      secondaryBodyEn: z.string().trim().max(2500),
      secondaryBodyFr: z.string().trim().max(2500),
      imageAltEn: z.string().trim().max(240),
      imageAltFr: z.string().trim().max(240),
      mediaAssetId: z.string().uuid().nullable(),
      sortOrder: z.number().int().min(0).max(2),
    }),
  ),
  facts: z.array(
    z.object({
      id: z.string().uuid().optional(),
      groupKey: z.enum(["quick", "weather"]),
      iconKey: z.string().trim().min(1).max(50),
      value: z.string().trim().max(80),
      labelEn: z.string().trim().max(180),
      labelFr: z.string().trim().max(180),
      sortOrder: z.number().int().min(0),
    }),
  ),
  highlights: z.array(
    z.object({
      id: z.string().uuid().optional(),
      iconKey: z.string().trim().min(1).max(50),
      labelEn: z.string().trim().max(120),
      labelFr: z.string().trim().max(120),
      textEn: z.string().trim().max(600),
      textFr: z.string().trim().max(600),
      sortOrder: z.number().int().min(0),
    }),
  ),
  media: z.array(
    z.object({
      id: z.string().uuid().optional(),
      assetId: z.string().uuid(),
      role: z.enum(["hero", "card", "gallery", "thumbnail"]),
      altEn: z.string().trim().max(240),
      altFr: z.string().trim().max(240),
      sortOrder: z.number().int().min(0),
    }),
  ),
  tourLinks: z.array(
    z.object({
      tourId: z.string().uuid(),
      relationship: z.enum(["start", "visit", "end", "area"]),
      source: z.enum(["manual", "itinerary", "inherited"]),
      visible: z.boolean(),
      sortOrder: z.number().int().min(0),
    }),
  ),
});

export const publicPlaceLookupSchema = z.object({
  kind: z.enum(["destination", "attraction"]),
  locale: z.enum(["en", "fr"]),
  slug,
  parentSlug: slug.optional(),
});

export function validatePlaceForPublish(input: z.infer<typeof placeEditorSchema>) {
  const problems: string[] = [];
  if (input.kind === "attraction" && !input.parentDestinationId) {
    problems.push("An attraction needs a parent destination.");
  }
  if (input.longitude === null || input.latitude === null) {
    problems.push("A confirmed map location is required.");
  }
  if (
    input.sections.length !== 3 ||
    input.sections.some((item, index) => item.sortOrder !== index)
  ) {
    problems.push("Exactly three ordered story sections are required.");
  }
  for (const locale of ["en", "fr"] as const) {
    const language = locale === "en" ? "English" : "French";
    const value = input.translations[locale];
    if (!slug.safeParse(value.slug).success) problems.push(`${language} slug is invalid.`);
    for (const [label, text] of [
      ["title", value.title],
      ["SEO title", value.seoTitle],
      ["SEO description", value.seoDescription],
      ["hero introduction", value.heroIntro],
      ["hero alt text", value.heroAlt],
      ["story title", value.storyTitle],
      ["story introduction", value.storyIntro],
    ]) {
      if (!text.trim()) problems.push(`${language} ${label} is required.`);
    }
    for (const [index, section] of input.sections.entries()) {
      if (!(locale === "en" ? section.titleEn : section.titleFr).trim()) {
        problems.push(`${language} section ${index + 1} title is required.`);
      }
      if (!(locale === "en" ? section.bodyEn : section.bodyFr).trim()) {
        problems.push(`${language} section ${index + 1} text is required.`);
      }
      if (!section.mediaAssetId) problems.push(`Section ${index + 1} image is required.`);
      if (!(locale === "en" ? section.imageAltEn : section.imageAltFr).trim()) {
        problems.push(`${language} section ${index + 1} image alt text is required.`);
      }
    }
  }
  if (!input.media.some((item) => item.role === "hero")) problems.push("A hero image is required.");
  if (!input.media.some((item) => item.role === "card")) problems.push("A card image is required.");
  if (!input.media.some((item) => item.role === "thumbnail")) {
    problems.push("An SEO thumbnail image is required.");
  }
  if (input.media.some((item) => !item.altEn.trim() || !item.altFr.trim())) {
    problems.push("Every assigned image needs English and French alt text.");
  }
  return [...new Set(problems)];
}
