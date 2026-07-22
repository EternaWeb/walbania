import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getSiteUrl } from "../lib/supabase";
import { listPublishedTourEntries } from "../lib/tours/server";
import { listPublishedPlaceEntries } from "../lib/places/server";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getSiteUrl();
        const [entries, places] = await Promise.all([
          listPublishedTourEntries(),
          listPublishedPlaceEntries(),
        ]);
        const lines = [
          "# WonderAlbania",
          "",
          "> Bilingual, locally designed tours and travel experiences across Albania.",
          "",
          "## Collections",
          "",
          `- [All tours (EN)](${baseUrl}/tour): Browse every published WonderAlbania tour.`,
          `- [Tous les circuits (FR)](${baseUrl}/fr/tour): Découvrez tous les circuits WonderAlbania publiés.`,
          `- [Destinations (EN)](${baseUrl}/destinations): Explore Albanian cities and linked tours.`,
          `- [Attractions (EN)](${baseUrl}/attractions): Explore landmarks and the tours that visit them.`,
          "",
          "## Published tours",
          "",
          ...entries.map((entry) => {
            const path = entry.locale === "fr" ? `/fr/${entry.slug}` : `/${entry.slug}`;
            const language = entry.locale === "fr" ? "FR" : "EN";
            return `- [${entry.title} (${language})](${baseUrl}${path}): ${entry.seo_description}`;
          }),
          "",
          "## Published destinations and attractions",
          "",
          ...places.map(
            (entry) =>
              `- [${entry.title} (${entry.locale.toUpperCase()})](${baseUrl}${entry.href}): ${entry.seoDescription}`,
          ),
          "",
          `Sitemap: ${baseUrl}/sitemap.xml`,
        ];
        return new Response(lines.join("\n"), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=0, must-revalidate",
          },
        });
      },
    },
  },
});
