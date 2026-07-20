import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getSiteUrl } from "../lib/supabase";
import { listPublishedTourEntries } from "../lib/tours/server";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type SitemapEntry = {
  loc: string;
  lastmod: string;
  priority: string;
  alternates?: { en: string; fr: string; default: string };
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getSiteUrl();
        const entries = await listPublishedTourEntries();
        const byTour = new Map<
          string,
          Partial<Record<"en" | "fr", { slug: string; updatedAt: string }>>
        >();
        for (const entry of entries) {
          const locale = entry.locale as "en" | "fr";
          const tour = byTour.get(entry.tour_id) ?? {};
          const joinedTour = Array.isArray(entry.tours) ? entry.tours[0] : entry.tours;
          tour[locale] = { slug: entry.slug, updatedAt: joinedTour?.updated_at ?? "" };
          byTour.set(entry.tour_id, tour);
        }
        const staticEntries: SitemapEntry[] = [
          { loc: `${baseUrl}/`, lastmod: "", priority: "1.0" },
          { loc: `${baseUrl}/fr/`, lastmod: "", priority: "1.0" },
        ];
        const tourEntries: SitemapEntry[] = [...byTour.values()].flatMap((tour) => {
          if (!tour.en || !tour.fr) return [];
          const enUrl = `${baseUrl}/${tour.en.slug}`;
          const frUrl = `${baseUrl}/fr/${tour.fr.slug}`;
          return [
            {
              loc: enUrl,
              lastmod: tour.en.updatedAt,
              priority: "0.9",
              alternates: { en: enUrl, fr: frUrl, default: enUrl },
            },
            {
              loc: frUrl,
              lastmod: tour.fr.updatedAt,
              priority: "0.9",
              alternates: { en: enUrl, fr: frUrl, default: enUrl },
            },
          ];
        });
        const urls = [...staticEntries, ...tourEntries]
          .map((entry) => {
            const alternates = entry.alternates
              ? [
                  `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(entry.alternates.en)}" />`,
                  `    <xhtml:link rel="alternate" hreflang="fr" href="${escapeXml(entry.alternates.fr)}" />`,
                  `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.alternates.default)}" />`,
                ].join("\n")
              : "";
            return [
              "  <url>",
              `    <loc>${escapeXml(entry.loc)}</loc>`,
              entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "",
              "    <changefreq>weekly</changefreq>",
              `    <priority>${entry.priority}</priority>`,
              alternates,
              "  </url>",
            ]
              .filter(Boolean)
              .join("\n");
          })
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, must-revalidate",
          },
        });
      },
    },
  },
});
