import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const aboutRoute = readFileSync(resolve(import.meta.dir, "../src/routes/about.tsx"), "utf8");

describe("about page", () => {
  test("defines the static about route and essential metadata", () => {
    expect(aboutRoute).toContain('createFileRoute("/about")');
    expect(aboutRoute).toContain("About Wonder Albania | People Who Know It Personally");
    expect(aboutRoute).toContain('"@type": "AboutPage"');
    expect(aboutRoute).toContain('foundingDate: "2025"');
    expect(aboutRoute).toContain('rel: "canonical"');
  });

  test("includes the agency, founder and vision story", () => {
    for (const content of [
      "Personal by design",
      "By people who know it personally.",
      "2025 as Albatross",
      "Meet Alfred.",
      "/about/alfred-founder.jpg",
      "Alfred Cekja — Founder &amp; Lead Guide",
      "Help shape a better kind of tourism.",
      "Better local visibility",
      "Useful technology",
      "TravelerReviewsSection",
      "TravelIdeasSection",
    ]) {
      expect(aboutRoute).toContain(content);
    }

    expect(aboutRoute).toContain("destination-story-stack");
    expect(aboutRoute).not.toContain("Local knowledge, modern service");
    expect(aboutRoute).not.toContain("about-hero-intro");
    expect(aboutRoute).not.toContain("overview-copy");
    expect(aboutRoute).not.toContain("ReviewRail");
  });
});
