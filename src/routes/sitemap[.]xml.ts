import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getSiteUrl } from "../lib/supabase";
import { listPublishedTourEntries } from "../lib/tours/server";
import { listPublishedPlaceEntries } from "../lib/places/server";

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
  lastmod?: string;
  alternates?: { en: string; fr: string; default: string };
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getSiteUrl();
        const [entries, placeRows] = await Promise.all([
          listPublishedTourEntries(),
          listPublishedPlaceEntries(),
        ]);
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
          {
            loc: `${baseUrl}/`,
            alternates: {
              en: `${baseUrl}/`,
              fr: `${baseUrl}/fr/`,
              default: `${baseUrl}/`,
            },
          },
          {
            loc: `${baseUrl}/fr/`,
            alternates: {
              en: `${baseUrl}/`,
              fr: `${baseUrl}/fr/`,
              default: `${baseUrl}/`,
            },
          },
          { loc: `${baseUrl}/about` },
          { loc: `${baseUrl}/booking-terms` },
          { loc: `${baseUrl}/cancelation` },
          { loc: `${baseUrl}/privacy-policy` },
          {
            loc: `${baseUrl}/tour`,
            alternates: {
              en: `${baseUrl}/tour`,
              fr: `${baseUrl}/fr/tour`,
              default: `${baseUrl}/tour`,
            },
          },
          {
            loc: `${baseUrl}/fr/tour`,
            alternates: {
              en: `${baseUrl}/tour`,
              fr: `${baseUrl}/fr/tour`,
              default: `${baseUrl}/tour`,
            },
          },
          {
            loc: `${baseUrl}/destinations`,
            alternates: {
              en: `${baseUrl}/destinations`,
              fr: `${baseUrl}/fr/destinations`,
              default: `${baseUrl}/destinations`,
            },
          },
          {
            loc: `${baseUrl}/fr/destinations`,
            alternates: {
              en: `${baseUrl}/destinations`,
              fr: `${baseUrl}/fr/destinations`,
              default: `${baseUrl}/destinations`,
            },
          },
          {
            loc: `${baseUrl}/attractions`,
            alternates: {
              en: `${baseUrl}/attractions`,
              fr: `${baseUrl}/fr/attractions`,
              default: `${baseUrl}/attractions`,
            },
          },
          {
            loc: `${baseUrl}/fr/attractions`,
            alternates: {
              en: `${baseUrl}/attractions`,
              fr: `${baseUrl}/fr/attractions`,
              default: `${baseUrl}/attractions`,
            },
          },
        ];
        const tourEntries: SitemapEntry[] = [...byTour.values()].flatMap((tour) => {
          if (!tour.en || !tour.fr) return [];
          const enUrl = `${baseUrl}/${tour.en.slug}`;
          const frUrl = `${baseUrl}/fr/${tour.fr.slug}`;
          return [
            {
              loc: enUrl,
              lastmod: tour.en.updatedAt,
              alternates: { en: enUrl, fr: frUrl, default: enUrl },
            },
            {
              loc: frUrl,
              lastmod: tour.fr.updatedAt,
              alternates: { en: enUrl, fr: frUrl, default: enUrl },
            },
          ];
        });
        const byPlace = new Map<string, Partial<Record<"en" | "fr", (typeof placeRows)[number]>>>();
        for (const entry of placeRows) {
          const place = byPlace.get(entry.id) ?? {};
          place[entry.locale] = entry;
          byPlace.set(entry.id, place);
        }
        const placeEntries: SitemapEntry[] = [...byPlace.values()].flatMap((place) => {
          if (!place.en || !place.fr) return [];
          const enUrl = `${baseUrl}${place.en.href}`;
          const frUrl = `${baseUrl}${place.fr.href}`;
          const alternates = { en: enUrl, fr: frUrl, default: enUrl };
          return [
            { loc: enUrl, lastmod: place.en.updatedAt, alternates },
            { loc: frUrl, lastmod: place.fr.updatedAt, alternates },
          ];
        });
        const urls = [...staticEntries, ...tourEntries, ...placeEntries]
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
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
