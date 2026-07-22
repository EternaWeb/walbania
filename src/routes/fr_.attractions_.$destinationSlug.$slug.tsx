import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PlaceDetailPage } from "../components/destination/PlaceDetailPage";
import { getPublicPlaceFn, placeSeoHead } from "../lib/places/server";

export const Route = createFileRoute("/fr_/attractions_/$destinationSlug/$slug")({
  loader: async ({ params }) => {
    const result = await getPublicPlaceFn({
      data: {
        kind: "attraction",
        locale: "fr",
        parentSlug: params.destinationSlug,
        slug: params.slug,
      },
    });
    if (result.kind === "not-found") throw notFound();
    if (result.kind === "redirect") throw redirect({ href: result.location, statusCode: 301 });
    return result.place;
  },
  head: ({ loaderData }) => (loaderData ? placeSeoHead(loaderData) : {}),
  component: FrenchAttractionRoute,
});

function FrenchAttractionRoute() {
  return <PlaceDetailPage place={Route.useLoaderData()} />;
}
