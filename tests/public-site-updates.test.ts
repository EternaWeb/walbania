import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(import.meta.dir, `..\\${path}`), "utf8");

const header = read("src/components/SiteHeader.tsx");
const footer = read("src/components/SiteFooter.tsx");
const faq = read("src/components/FaqSection.tsx");
const home = read("src/routes/index.tsx");
const terms = read("src/routes/terms-of-service.tsx");
const styles = read("src/styles.css");

describe("requested public-site updates", () => {
  test("keeps the AI navigation control commented out", () => {
    expect(header).toContain("AI navigation button — intentionally hidden");
    expect(header).not.toContain('import { Search, Sparkle }');
  });

  test("rotates traveler stories and only fully opens photos on press", () => {
    expect(home).toContain("window.setInterval");
    expect(home).toContain("}, 4000)");
    expect(home).toContain('isExpanded ? " is-expanded"');
    expect(styles).toContain(".tly-stack.is-expanded .tly-card-0");
    expect(styles).not.toContain(".tly-stack:hover .tly-card-0");
  });

  test("keeps the FAQ image fixed while answers animate", () => {
    expect(faq).toContain('className="shared-faq-answer"');
    expect(styles).toMatch(/\.shared-faq-media \{[\s\S]*?height: 590px;/);
    expect(styles).toContain("grid-template-rows: 0fr");
    expect(styles).toContain("grid-template-rows: 1fr");
  });

  test("uses the simplified footer contact and social details", () => {
    expect(footer).not.toContain("Join the Wonder Albania newsletter");
    expect(footer).not.toContain("Certifications & Memberships");
    expect(footer).toContain("+355 692290036");
    expect(footer).toContain("0682778037");
    expect(footer).toContain("https://www.instagram.com/wonder.albania/");
    expect(footer).toContain("https://www.linkedin.com/company/wonderalbania");
  });

  test("provides a dedicated terms route with shared navigation", () => {
    expect(terms).toContain('createFileRoute("/terms-of-service")');
    expect(terms).toContain("<SiteHeader");
    expect(terms).toContain("<SiteFooter />");
    expect(terms).toContain("mandatory consumer");
  });
});
