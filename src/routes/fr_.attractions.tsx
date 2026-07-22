import { createFileRoute } from "@tanstack/react-router";
import { PlaceCollectionPage } from "../components/destination/PlaceCollectionPage";
import { getPublicPlaceCollectionFn } from "../lib/places/server";

export const Route = createFileRoute("/fr_/attractions")({
  loader: () => getPublicPlaceCollectionFn({ data: { kind: "attraction", locale: "fr" } }),
  head: () => ({
    meta: [
      { title: "Attractions en Albanie | Wonder Albania" },
      {
        name: "description",
        content: "Explorez les sites d’Albanie et les circuits qui visitent chaque attraction.",
      },
    ],
    links: [{ rel: "canonical", href: "https://wonderalbania.com/fr/attractions" }],
  }),
  component: FrenchAttractionsPage,
});

function FrenchAttractionsPage() {
  const data = Route.useLoaderData();
  return (
    <PlaceCollectionPage
      kind="attraction"
      locale="fr"
      cards={data.cards}
      mapPoints={data.mapPoints}
    />
  );
}
