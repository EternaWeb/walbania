import { createFileRoute, notFound } from "@tanstack/react-router";
import { CollectionDetailPage } from "../components/collection/CollectionDetailPage";
import { getPublicCollectionFn } from "../lib/collections/server";
import { SITE_NAME, SITE_URL } from "../lib/site";

export const Route = createFileRoute("/collection_/$slug")({
  loader: async ({ params }) => {
    const collection = await getPublicCollectionFn({
      data: { key: params.slug, locale: "en" },
    });
    if (!collection) throw notFound();
    return collection;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const canonical = `${SITE_URL}${loaderData.href}`;
    return {
      meta: [
        { title: `${loaderData.name} in Albania | ${SITE_NAME}` },
        { name: "description", content: loaderData.description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: `${loaderData.name} in Albania | ${SITE_NAME}` },
        { property: "og:description", content: loaderData.description },
        { property: "og:image", content: loaderData.image },
        { property: "og:image:alt", content: loaderData.imageAlt },
        { property: "og:url", content: canonical },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: loaderData.image },
      ],
      links: [
        { rel: "canonical", href: canonical },
        { rel: "alternate", hrefLang: "en", href: canonical },
        { rel: "alternate", hrefLang: "x-default", href: canonical },
      ],
    };
  },
  component: CollectionDetailRoute,
});

function CollectionDetailRoute() {
  return <CollectionDetailPage locale="en" collection={Route.useLoaderData()} />;
}
