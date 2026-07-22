import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PlaceDetailPage } from "../components/destination/PlaceDetailPage";
import { getPublicPlaceFn, placeJsonLd } from "../lib/places/server";

export const Route = createFileRoute("/attractions/$destinationSlug/$slug")({
  loader: async ({ params }) => {
    const result = await getPublicPlaceFn({
      data: {
        kind: "attraction",
        locale: "en",
        parentSlug: params.destinationSlug,
        slug: params.slug,
      },
    });
    if (result.kind === "not-found") throw notFound();
    if (result.kind === "redirect") throw redirect({ href: result.location, statusCode: 301 });
    return result.place;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const canonical = `${loaderData.siteUrl}${loaderData.href}`;
    const alternate = `${loaderData.siteUrl}${loaderData.alternateHref}`;
    return {
      meta: [
        { title: loaderData.seoTitle || loaderData.title },
        { name: "description", content: loaderData.seoDescription },
        { property: "og:title", content: loaderData.seoTitle || loaderData.title },
        { property: "og:description", content: loaderData.seoDescription },
        { property: "og:image", content: loaderData.heroImage },
        { property: "og:url", content: canonical },
      ],
      links: [
        { rel: "canonical", href: canonical },
        { rel: "alternate", hrefLang: "en", href: canonical },
        { rel: "alternate", hrefLang: "fr", href: alternate },
        { rel: "alternate", hrefLang: "x-default", href: canonical },
      ],
      scripts: [{ type: "application/ld+json", children: placeJsonLd(loaderData) }],
    };
  },
  component: AttractionRoute,
});

function AttractionRoute() {
  return <PlaceDetailPage place={Route.useLoaderData()} />;
}
