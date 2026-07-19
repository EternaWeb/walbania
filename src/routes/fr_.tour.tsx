import { createFileRoute } from "@tanstack/react-router";
import { TourPage } from "./tour";

export const Route = createFileRoute("/fr_/tour")({
  head: () => ({
    meta: [
      { title: "Circuit privé sur la Riviera albanaise | WonderAlbania" },
      {
        name: "description",
        content:
          "Une journée privée sur la Riviera du sud de l’Albanie, entre plages secrètes, villages de pierre, Porto Palermo et déjeuner local.",
      },
      {
        property: "og:title",
        content: "Circuit privé sur la Riviera albanaise | WonderAlbania",
      },
      {
        property: "og:description",
        content:
          "Villages, criques et eaux turquoise lors d’une journée privée dans le sud de l’Albanie.",
      },
      {
        name: "twitter:title",
        content: "Circuit privé sur la Riviera albanaise | WonderAlbania",
      },
      {
        name: "twitter:description",
        content:
          "Villages, criques et eaux turquoise lors d’une journée privée dans le sud de l’Albanie.",
      },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:url", content: "https://wonderalbania.com/fr/tour" },
    ],
    links: [
      { rel: "canonical", href: "https://wonderalbania.com/fr/tour" },
      { rel: "alternate", hrefLang: "en", href: "https://wonderalbania.com/tour" },
      { rel: "alternate", hrefLang: "fr", href: "https://wonderalbania.com/fr/tour" },
      { rel: "alternate", hrefLang: "x-default", href: "https://wonderalbania.com/tour" },
    ],
  }),
  component: () => <TourPage locale="fr" />,
});
