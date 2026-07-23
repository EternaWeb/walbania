import { createFileRoute } from "@tanstack/react-router";
import { TourListingPage } from "../components/tour/TourListingPage";
import { getPublishedTourListingFn } from "../lib/tours/server";

export const Route = createFileRoute("/tour")({
  loader: () => getPublishedTourListingFn({ data: { locale: "en" } }),
  head: () => ({
    meta: [
      { title: "Albania Tours & Holiday Packages | Wonder Albania" },
      {
        name: "description",
        content:
          "Explore curated Albania tours, private journeys, cultural escapes and adventure packages designed by local experts.",
      },
      { property: "og:url", content: "https://wonderalbania.com/tour" },
    ],
    links: [
      { rel: "canonical", href: "https://wonderalbania.com/tour" },
      { rel: "alternate", hrefLang: "en", href: "https://wonderalbania.com/tour" },
      { rel: "alternate", hrefLang: "fr", href: "https://wonderalbania.com/fr/tour" },
      { rel: "alternate", hrefLang: "x-default", href: "https://wonderalbania.com/tour" },
    ],
  }),
  component: TourIndexRoute,
});

function TourIndexRoute() {
  return <TourListingPage locale="en" data={Route.useLoaderData()} />;
}
