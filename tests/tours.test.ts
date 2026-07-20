import { describe, expect, test } from "bun:test";
import {
  publicTourLookupSchema,
  tourEditorSchema,
  validateForPublish,
} from "../src/lib/tours/schemas";
import { createEmptyTour } from "../src/lib/tours/types";

const CATEGORY_ID = "10000000-0000-4000-8000-000000000001";
const TYPE_ID = "10000000-0000-4000-8000-000000000002";
const DIFFICULTY_ID = "10000000-0000-4000-8000-000000000003";

function publishableTour() {
  const tour = createEmptyTour();
  tour.basePriceEur = 99;
  tour.categoryIds = [CATEGORY_ID];
  tour.tourTypeId = TYPE_ID;
  tour.difficultyId = DIFFICULTY_ID;
  for (const locale of ["en", "fr"] as const) {
    tour.translations[locale] = {
      ...tour.translations[locale],
      slug: locale === "en" ? "berat-day-tour" : "excursion-berat",
      title: locale === "en" ? "Berat day tour" : "Excursion à Berat",
      seoTitle: locale === "en" ? "Berat day tour from Tirana" : "Excursion à Berat depuis Tirana",
      seoDescription: "A bilingual search description for the tour.",
      heroIntro: "A complete day with a local host.",
      overviewTitle: "Discover Berat",
      overviewBody: "A detailed overview of the experience.",
      bestSeasonTitle: "Best season",
      bestSeasonBody: "Spring through autumn.",
      heroAlt: "Berat old town and castle",
    };
  }
  tour.media = [
    {
      role: "hero",
      storagePath: "tours/example/hero.webp",
      publicUrl: "https://example.com/hero.webp",
      altEn: "Berat old town",
      altFr: "Vieille ville de Berat",
      sortOrder: 0,
    },
    {
      role: "gallery",
      storagePath: "tours/example/gallery.webp",
      publicUrl: "https://example.com/gallery.webp",
      altEn: "Berat castle",
      altFr: "Château de Berat",
      sortOrder: 1,
    },
  ];
  tour.highlights = [
    {
      iconKey: "sparkles",
      labelEn: "Local insight",
      labelFr: "Regard local",
      textEn: "Explore with a local.",
      textFr: "Explorez avec un habitant.",
      sortOrder: 0,
    },
  ];
  tour.listItems = [
    {
      kind: "included",
      textEn: "Local guide",
      textFr: "Guide local",
      sortOrder: 0,
    },
  ];
  tour.weatherStats = [
    {
      iconKey: "sun",
      value: "24°C",
      labelEn: "Typical summer high",
      labelFr: "Maximum estival habituel",
      sortOrder: 0,
    },
  ];
  tour.itinerary = [
    {
      time: "08:00",
      durationMinutes: 30,
      typeEn: "Pickup",
      typeFr: "Prise en charge",
      placeEn: "Tirana",
      placeFr: "Tirana",
      descriptionEn: "Meet your host.",
      descriptionFr: "Rencontrez votre hôte.",
      locationQuery: "Skanderbeg Square, Tirana, Albania",
      locationLabel: "Skanderbeg Square, Tirana",
      longitude: 19.8187,
      latitude: 41.3275,
      osmReference: "node/123",
      sortOrder: 0,
    },
  ];
  return tour;
}

describe("tour publishing rules", () => {
  test("a complete bilingual tour is publishable", () => {
    const parsed = tourEditorSchema.parse(publishableTour());
    expect(validateForPublish(parsed)).toEqual([]);
  });

  test("drafts can save incomplete content but cannot publish it", () => {
    const draft = tourEditorSchema.parse(createEmptyTour());
    const problems = validateForPublish(draft);
    expect(problems).toContain("English slug is required.");
    expect(problems).toContain("French slug is required.");
    expect(problems).toContain("A hero image is required.");
    expect(problems).toContain("At least one itinerary stop is required.");
  });

  test("public lookup only accepts SEO-safe slugs and supported locales", () => {
    expect(publicTourLookupSchema.safeParse({ slug: "berat-day-tour", locale: "en" }).success).toBe(
      true,
    );
    expect(publicTourLookupSchema.safeParse({ slug: "Berat Day Tour", locale: "en" }).success).toBe(
      false,
    );
    expect(publicTourLookupSchema.safeParse({ slug: "berat-day-tour", locale: "de" }).success).toBe(
      false,
    );
  });
});
