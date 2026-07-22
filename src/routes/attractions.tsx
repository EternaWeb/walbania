import { createFileRoute } from "@tanstack/react-router";
import { PlaceCollectionPage } from "../components/destination/PlaceCollectionPage";
import { getPublicPlaceCollectionFn } from "../lib/places/server";

export const Route = createFileRoute("/attractions")({
  loader: () => getPublicPlaceCollectionFn({ data: { kind: "attraction", locale: "en" } }),
  head: () => ({
    meta: [
      { title: "Attractions in Albania | Wonder Albania" },
      {
        name: "description",
        content: "Explore Albania’s landmarks and the tours that visit each attraction.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://wonderalbania.com/attractions" },
      { rel: "alternate", hrefLang: "en", href: "https://wonderalbania.com/attractions" },
      { rel: "alternate", hrefLang: "fr", href: "https://wonderalbania.com/fr/attractions" },
    ],
  }),
  component: AttractionsRoute,
});

function AttractionsRoute() {
  const data = Route.useLoaderData();
  return <PlaceCollectionPage kind="attraction" locale="en" {...data} />;
}
