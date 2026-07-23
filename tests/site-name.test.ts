import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { brandedTitle, SITE_NAME } from "../src/lib/site";

const rootRoute = readFileSync(resolve(import.meta.dir, "../src/routes/__root.tsx"), "utf8");
const homeRoute = readFileSync(resolve(import.meta.dir, "../src/routes/index.tsx"), "utf8");

describe("canonical site name", () => {
  test("uses the exact preferred name", () => {
    expect(SITE_NAME).toBe("Wonder Albania");
  });

  test("publishes the Google site-name signals on the homepage", () => {
    expect(rootRoute).toContain('{ property: "og:site_name", content: SITE_NAME }');
    expect(homeRoute).toContain('"@type": "WebSite"');
    expect(homeRoute).toContain("name: SITE_NAME");
    expect(homeRoute).toContain("{ title: `${SITE_NAME} — Discover Albania in Wonder` }");
  });

  test("normalizes legacy and unbranded page titles", () => {
    expect(brandedTitle("Berat Tour")).toBe("Berat Tour | Wonder Albania");
    expect(brandedTitle("Berat Tour | WonderAlbania")).toBe("Berat Tour | Wonder Albania");
  });
});
