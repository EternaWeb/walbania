import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path: string) => readFileSync(resolve(import.meta.dir, `..\\${path}`), "utf8");

const header = read("src/components/SiteHeader.tsx");
const footer = read("src/components/SiteFooter.tsx");
const faq = read("src/components/FaqSection.tsx");
const home = read("src/routes/index.tsx");
const bookingTerms = read("src/routes/booking-terms.tsx");
const cancellation = read("src/routes/cancelation.tsx");
const privacy = read("src/routes/privacy-policy.tsx");
const legalPage = read("src/components/LegalDocumentPage.tsx");
const legalDocuments = [
  read("src/content/legal/booking-terms.md"),
  read("src/content/legal/cancellation.md"),
  read("src/content/legal/privacy.md"),
];
const styles = read("src/styles.css");

describe("requested public-site updates", () => {
  test("keeps the AI navigation control commented out", () => {
    expect(header).toContain("AI navigation button — intentionally hidden");
    expect(header).not.toContain("import { Search, Sparkle }");
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
    expect(footer).toContain("+355 682778037");
    expect(footer).toContain("https://www.instagram.com/wonder.albania/");
    expect(footer).toContain("https://www.linkedin.com/company/wonderalbania");
    expect(footer).toContain("https://share.google/OUJlx4oikDh8jftuK");
    expect(footer).not.toContain("Facebook");
    expect(footer).not.toContain("YouTube");
    expect(footer).not.toContain("TikTok");
    expect(footer).toContain("© 2026 Wonder Albania. All rights reserved.");
  });

  test("provides only the requested legal routes with shared navigation", () => {
    expect(bookingTerms).toContain('createFileRoute("/booking-terms")');
    expect(cancellation).toContain('createFileRoute("/cancelation")');
    expect(privacy).toContain('createFileRoute("/privacy-policy")');
    expect(legalPage).toContain("<SiteHeader />");
    expect(legalPage).toContain("<SiteFooter />");
  });

  test("publishes legal copy without draft placeholders or internal checklists", () => {
    for (const document of legalDocuments) {
      expect(document).not.toContain("Internal publication checklist");
      expect(document).not.toContain("[DD Month YYYY]");
      expect(document).not.toContain("[FULL REGISTERED LEGAL NAME]");
      expect(document).not.toContain("[INSERT");
    }
  });

  test("uses a large, crawlable homepage preview image", () => {
    expect(home).toContain("const HOME_OG_IMAGE = `${SITE_URL}/og-home.jpg`");
    expect(home).toContain('"max-image-preview:large"');
    expect(home).toContain('{ property: "og:image:width", content: "1600" }');
  });
});
