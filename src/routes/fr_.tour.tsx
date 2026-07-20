import { createFileRoute } from "@tanstack/react-router";
import { TourListingPage } from "../components/tour/TourListingPage";
import { getPublishedTourListingFn } from "../lib/tours/server";

export const Route = createFileRoute("/fr_/tour")({
  loader: () => getPublishedTourListingFn({ data: { locale: "fr" } }),
  head: () => ({
    meta: [
      { title: "Circuits et voyages en Albanie | WonderAlbania" },
      {
        name: "description",
        content:
          "Découvrez nos circuits en Albanie, voyages privés, séjours culturels et aventures imaginés par des experts locaux.",
      },
      { property: "og:url", content: "https://wonderalbania.com/fr/tour" },
    ],
    links: [
      { rel: "canonical", href: "https://wonderalbania.com/fr/tour" },
      { rel: "alternate", hrefLang: "en", href: "https://wonderalbania.com/tour" },
      { rel: "alternate", hrefLang: "fr", href: "https://wonderalbania.com/fr/tour" },
      { rel: "alternate", hrefLang: "x-default", href: "https://wonderalbania.com/tour" },
    ],
  }),
  component: FrenchTourIndexRoute,
});

function FrenchTourIndexRoute() {
  return <TourListingPage locale="fr" data={Route.useLoaderData()} />;
}
