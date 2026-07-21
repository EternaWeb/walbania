import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const aboutRoute = readFileSync(resolve(import.meta.dir, "../src/routes/about.tsx"), "utf8");

describe("about page", () => {
  test("defines the static about route and essential metadata", () => {
    expect(aboutRoute).toContain('createFileRoute("/about")');
    expect(aboutRoute).toContain("About Wonder Albania | Travel, Made Personal");
    expect(aboutRoute).toContain('"@type": "AboutPage"');
    expect(aboutRoute).toContain('rel: "canonical"');
  });

  test("includes the identity themes and requested sections", () => {
    for (const content of [
      "Personal by design",
      "Local knowledge, modern service",
      "Flexible, not rigid",
      "Quality you can feel",
      "Details that matter",
      "Respect for place",
      "Journeys that feel personal",
      "Our trusted network",
      "Let’s shape your Albania",
    ]) {
      expect(aboutRoute).toContain(content);
    }
  });
});
