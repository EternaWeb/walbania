import { createFileRoute } from "@tanstack/react-router";
import { PlaceCollectionPage } from "../components/destination/PlaceCollectionPage";
import { getPublicPlaceCollectionFn } from "../lib/places/server";

export const Route = createFileRoute("/fr_/destinations")({
  loader: () => getPublicPlaceCollectionFn({ data: { kind: "destination", locale: "fr" } }),
  head: () => ({
    meta: [
      { title: "Destinations en Albanie | Wonder Albania" },
      {
        name: "description",
        content: "Explorez les villes d’Albanie et les circuits liés à chaque destination.",
      },
    ],
    links: [{ rel: "canonical", href: "https://wonderalbania.com/fr/destinations" }],
  }),
  component: FrenchDestinationsPage,
});

function FrenchDestinationsPage() {
  const data = Route.useLoaderData();
  return (
    <PlaceCollectionPage
      kind="destination"
      locale="fr"
      cards={data.cards}
      mapPoints={data.mapPoints}
    />
  );
}
