import { createFileRoute } from "@tanstack/react-router";
import { PlaceCollectionPage } from "../components/destination/PlaceCollectionPage";
import { getPublicPlaceCollectionFn } from "../lib/places/server";

export const Route = createFileRoute("/destinations")({
  loader: () => getPublicPlaceCollectionFn({ data: { kind: "destination", locale: "en" } }),
  head: () => ({
    meta: [
      { title: "Destinations in Albania | Wonder Albania" },
      {
        name: "description",
        content: "Explore Albania’s cities and find the tours linked to every destination.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://wonderalbania.com/destinations" },
      { rel: "alternate", hrefLang: "en", href: "https://wonderalbania.com/destinations" },
      { rel: "alternate", hrefLang: "fr", href: "https://wonderalbania.com/fr/destinations" },
    ],
  }),
  component: DestinationsRoute,
});

function DestinationsRoute() {
  const data = Route.useLoaderData();
  return <PlaceCollectionPage kind="destination" locale="en" {...data} />;
}
