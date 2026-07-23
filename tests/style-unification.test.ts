import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(import.meta.dir, `..\\${path}`), "utf8");

const home = read("src/routes/index.tsx");
const tourDetail = read("src/components/tour/DynamicTourPage.tsx");
const collection = read("src/components/destination/PlaceCollectionPage.tsx");
const globalStyles = read("src/styles.css");
const guide = read("style.md");

describe("unified public-page styling", () => {
  test("reuses one FAQ implementation on home and tour detail pages", () => {
    expect(home).toContain("<FaqSection items={DEFAULT_FAQS} />");
    expect(tourDetail).toContain("<FaqSection");
    expect(tourDetail).not.toContain('<section className="content-section faq-section">');
  });

  test("uses a split FAQ on desktop and removes its image on mobile", () => {
    expect(globalStyles).toContain("grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr)");
    expect(globalStyles).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?\.shared-faq-media \{\s*display: none;/,
    );
  });

  test("uses the tour visual language for both place collection routes", () => {
    expect(collection).toContain('className="index-hero-cta"');
    expect(collection).toContain('className="index-hero-film"');
    expect(collection).toContain('className="place-collection-intro"');
    expect(collection).toContain('className="place-collection-map"');
  });

  test("documents the reusable section principles", () => {
    expect(guide).toContain("# Wonder Albania — Section Design Principles");
    expect(guide).toContain("Always use the shared FAQ component.");
    expect(guide).toContain("Destinations and attractions share one collection-page composition.");
  });
});
