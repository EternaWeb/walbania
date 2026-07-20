import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getSiteUrl } from "../lib/supabase";
import { listPublishedTourEntries } from "../lib/tours/server";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getSiteUrl();
        const entries = await listPublishedTourEntries();
        const lines = [
          "# WonderAlbania",
          "",
          "> Bilingual, locally designed tours and travel experiences across Albania.",
          "",
          "## Tour collections",
          "",
          `- [All tours (EN)](${baseUrl}/tour): Browse every published WonderAlbania tour.`,
          `- [Tous les circuits (FR)](${baseUrl}/fr/tour): Découvrez tous les circuits WonderAlbania publiés.`,
          "",
          "## Published tours",
          "",
          ...entries.map((entry) => {
            const path = entry.locale === "fr" ? `/fr/${entry.slug}` : `/${entry.slug}`;
            const language = entry.locale === "fr" ? "FR" : "EN";
            return `- [${entry.title} (${language})](${baseUrl}${path}): ${entry.seo_description}`;
          }),
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
