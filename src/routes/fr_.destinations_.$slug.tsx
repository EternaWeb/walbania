import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PlaceDetailPage } from "../components/destination/PlaceDetailPage";
import { getPublicPlaceFn, placeJsonLd } from "../lib/places/server";

export const Route = createFileRoute("/fr_/destinations_/$slug")({
  loader: async ({ params }) => {
    const result = await getPublicPlaceFn({
      data: { kind: "destination", locale: "fr", slug: params.slug },
    });
    if (result.kind === "not-found") throw notFound();
    if (result.kind === "redirect") throw redirect({ href: result.location, statusCode: 301 });
    return result.place;
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: loaderData.seoTitle || loaderData.title },
            { name: "description", content: loaderData.seoDescription },
            { property: "og:image", content: loaderData.heroImage },
          ],
          links: [
            { rel: "canonical", href: `${loaderData.siteUrl}${loaderData.href}` },
            {
              rel: "alternate",
              hrefLang: "en",
              href: `${loaderData.siteUrl}${loaderData.alternateHref}`,
            },
            { rel: "alternate", hrefLang: "fr", href: `${loaderData.siteUrl}${loaderData.href}` },
          ],
          scripts: [{ type: "application/ld+json", children: placeJsonLd(loaderData) }],
        }
      : {},
  component: FrenchDestinationRoute,
});

function FrenchDestinationRoute() {
  return <PlaceDetailPage place={Route.useLoaderData()} />;
}
