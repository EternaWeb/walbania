import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PlaceDetailPage } from "../components/destination/PlaceDetailPage";
import { getPublicPlaceFn, placeSeoHead } from "../lib/places/server";

export const Route = createFileRoute("/destinations_/$slug")({
  loader: async ({ params }) => {
    const result = await getPublicPlaceFn({
      data: { kind: "destination", locale: "en", slug: params.slug },
    });
    if (result.kind === "not-found") throw notFound();
    if (result.kind === "redirect") throw redirect({ href: result.location, statusCode: 301 });
    return result.place;
  },
  head: ({ loaderData }) => (loaderData ? placeSeoHead(loaderData) : {}),
  component: DestinationRoute,
});

function DestinationRoute() {
  return <PlaceDetailPage place={Route.useLoaderData()} />;
}
