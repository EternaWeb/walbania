import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PlaceDetailPage } from "../components/destination/PlaceDetailPage";
import { getPublicPlaceFn, placeSeoHead } from "../lib/places/server";

export const Route = createFileRoute("/fr_/destinations_/$slug")({
  loader: async ({ params }) => {
    const result = await getPublicPlaceFn({
      data: { kind: "destination", locale: "fr", slug: params.slug },
    });
    if (result.kind === "not-found") throw notFound();
    if (result.kind === "redirect") throw redirect({ href: result.location, statusCode: 301 });
    return result.place;
  },
  head: ({ loaderData }) => (loaderData ? placeSeoHead(loaderData) : {}),
  component: FrenchDestinationRoute,
});

function FrenchDestinationRoute() {
  return <PlaceDetailPage place={Route.useLoaderData()} />;
}
