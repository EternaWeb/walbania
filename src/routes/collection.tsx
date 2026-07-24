import { createFileRoute } from "@tanstack/react-router";
import { CollectionDirectoryPage } from "../components/collection/CollectionDirectoryPage";
import { getPublicCollectionsFn } from "../lib/collections/server";
import { SITE_NAME, SITE_URL } from "../lib/site";

export const Route = createFileRoute("/collection")({
  loader: () => getPublicCollectionsFn({ data: { locale: "en" } }),
  head: () => ({
    meta: [
      { title: `Holiday Collections in Albania | ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Explore couples, family, summer and hiking holiday collections designed by local Albania travel experts.",
      },
      { property: "og:url", content: `${SITE_URL}/collection` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/collection` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/collection` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/collection` },
    ],
  }),
  component: CollectionRoute,
});

function CollectionRoute() {
  return <CollectionDirectoryPage locale="en" collections={Route.useLoaderData()} />;
}
