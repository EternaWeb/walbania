import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(import.meta.dir, `..\\${path}`), "utf8");

const migration = read("supabase/migrations/202607240001_holiday_collections.sql");
const indexRoute = read("src/routes/index.tsx");
const directoryRoute = read("src/routes/collection.tsx");
const detailRoute = read("src/routes/collection_.$slug.tsx");
const detailPage = read("src/components/collection/CollectionDetailPage.tsx");
const card = read("src/components/collection/HolidayCollectionCard.tsx");
const admin = read("src/components/admin/CollectionManager.tsx");
const server = read("src/lib/collections/server.ts");

describe("holiday collections", () => {
  test("seeds the four requested category-backed collections", () => {
    for (const value of [
      "Couples Holidays",
      "Family Holidays",
      "Summer Holidays",
      "Hiking Tours",
      "couples-holidays",
      "family-holiday",
      "summer-holidays",
      "hiking-tours",
    ]) {
      expect(migration).toContain(value);
    }
    expect(migration).toContain("hero_asset_id");
    expect(migration).toContain("collection_enabled");
  });

  test("provides directory and detail routes with only enabled collections", () => {
    expect(directoryRoute).toContain('createFileRoute("/collection")');
    expect(detailRoute).toContain('createFileRoute("/collection_/$slug")');
    expect(server).toContain('.eq("collection_enabled", true)');
    expect(indexRoute).toContain("<HolidayCollectionCard");
    expect(indexRoute).not.toContain("<CollectionCard");
    expect(card).not.toContain("ribbon");
    expect(card).not.toContain("overlay");
  });

  test("shows six tour cards, loads more and reuses the ideas section", () => {
    expect(detailPage).toContain("useState(6)");
    expect(detailPage).toContain("slice(0, visibleCount)");
    expect(detailPage).toContain("count + 6");
    expect(detailPage).toContain("<TourCard");
    expect(detailPage).toContain("<TravelIdeasSection");
    expect(detailPage).toContain("in more detail");
    expect(detailPage).toContain("aria-expanded={detailsOpen}");
  });

  test("lets administrators choose the shared hero and card image", () => {
    expect(admin).toContain("Hero and card image");
    expect(admin).toContain("Select from media library");
    expect(admin).toContain("saveCollectionFn");
    expect(admin).toContain("Show collection publicly");
  });
});
