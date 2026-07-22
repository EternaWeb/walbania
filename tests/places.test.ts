import { describe, expect, test } from "bun:test";
import {
  placeEditorSchema,
  publicPlaceLookupSchema,
  validatePlaceForPublish,
} from "../src/lib/places/schemas";
import { PLACE_HERO_COLORS, stablePlaceHeroColor } from "../src/lib/places/presentation";
import { createEmptyPlace } from "../src/lib/places/types";

const ASSET_IDS = [
  "10000000-0000-4000-8000-000000000001",
  "10000000-0000-4000-8000-000000000002",
  "10000000-0000-4000-8000-000000000003",
  "10000000-0000-4000-8000-000000000004",
  "10000000-0000-4000-8000-000000000005",
  "10000000-0000-4000-8000-000000000006",
];

function publishablePlace(kind: "destination" | "attraction" = "destination") {
  const place = createEmptyPlace(kind);
  place.parentDestinationId = kind === "attraction" ? "20000000-0000-4000-8000-000000000001" : null;
  place.longitude = 19.9522;
  place.latitude = 40.7058;
  for (const locale of ["en", "fr"] as const) {
    place.translations[locale] = {
      ...place.translations[locale],
      slug:
        kind === "destination" ? "berat" : locale === "en" ? "berat-castle" : "chateau-de-berat",
      title:
        kind === "destination" ? "Berat" : locale === "en" ? "Berat Castle" : "Citadelle de Berat",
      seoTitle: "A complete SEO title",
      seoDescription: "A complete bilingual search description.",
      heroIntro: "A concise introduction to this place.",
      heroAlt: "A descriptive image alternative.",
    };
  }
  place.sections = place.sections.map((section, index) => ({
    ...section,
    titleEn: `English section ${index + 1}`,
    titleFr: `Section française ${index + 1}`,
    bodyEn: "English story copy.",
    bodyFr: "Récit en français.",
    imageAltEn: `Berat story image ${index + 1}`,
    imageAltFr: `Image du récit de Berat ${index + 1}`,
    mediaAssetId: ASSET_IDS[index + 2],
  }));
  place.media = [
    {
      assetId: ASSET_IDS[0],
      role: "hero",
      altEn: "Berat hero",
      altFr: "Berat principal",
      sortOrder: 0,
    },
    {
      assetId: ASSET_IDS[1],
      role: "card",
      altEn: "Berat card",
      altFr: "Carte de Berat",
      sortOrder: 0,
    },
    {
      assetId: ASSET_IDS[5],
      role: "thumbnail",
      altEn: "Berat SEO thumbnail",
      altFr: "Vignette SEO de Berat",
      sortOrder: 0,
    },
  ];
  return place;
}

describe("place publishing rules", () => {
  test("complete bilingual destinations and attractions are publishable", () => {
    for (const kind of ["destination", "attraction"] as const) {
      const parsed = placeEditorSchema.parse(publishablePlace(kind));
      expect(validatePlaceForPublish(parsed)).toEqual([]);
    }
  });

  test("publishing enforces exactly three bilingual story sections and media", () => {
    const draft = placeEditorSchema.parse(createEmptyPlace("destination"));
    const problems = validatePlaceForPublish(draft);
    expect(problems).toContain("A confirmed map location is required.");
    expect(problems).toContain("A hero image is required.");
    expect(problems).toContain("A card image is required.");
    expect(problems).toContain("An SEO thumbnail image is required.");
    expect(problems).toContain("English section 1 title is required.");
  });

  test("hero colors are deterministic and limited to the approved palette", () => {
    const first = stablePlaceHeroColor("berat-place-id");
    expect(stablePlaceHeroColor("berat-place-id")).toBe(first);
    expect(PLACE_HERO_COLORS).toContain(first);

    for (const seed of ["berat", "berat-castle", "gjirokaster", "ksamil"]) {
      expect(PLACE_HERO_COLORS).toContain(stablePlaceHeroColor(seed));
    }
  });

  test("public routes only accept supported kinds, locales and safe slugs", () => {
    expect(
      publicPlaceLookupSchema.safeParse({ kind: "destination", locale: "en", slug: "berat" })
        .success,
    ).toBe(true);
    expect(
      publicPlaceLookupSchema.safeParse({
        kind: "attraction",
        locale: "fr",
        slug: "chateau-de-berat",
        parentSlug: "berat",
      }).success,
    ).toBe(true);
    expect(
      publicPlaceLookupSchema.safeParse({ kind: "landmark", locale: "en", slug: "Berat Castle" })
        .success,
    ).toBe(false);
  });

  test("place detail routes render independently from their collection pages", async () => {
    const routeTree = await Bun.file(new URL("../src/routeTree.gen.ts", import.meta.url)).text();

    for (const routeId of [
      "/destinations_/$slug",
      "/attractions_/$destinationSlug/$slug",
      "/fr_/destinations_/$slug",
      "/fr_/attractions_/$destinationSlug/$slug",
    ]) {
      const routeStart = routeTree.indexOf(`id: '${routeId}'`);
      expect(routeStart).toBeGreaterThan(-1);
      expect(routeTree.slice(routeStart, routeStart + 220)).toContain(
        "getParentRoute: () => rootRouteImport",
      );
    }
  });
});
