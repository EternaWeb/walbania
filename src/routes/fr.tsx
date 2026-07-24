import { createFileRoute } from "@tanstack/react-router";
import { getPublicCollectionsFn } from "../lib/collections/server";
import { HomePage } from "./index";

export const Route = createFileRoute("/fr")({
  loader: () => getPublicCollectionsFn({ data: { locale: "fr" } }),
  head: () => ({
    meta: [
      { title: "Wonder Albania — Découvrez l’Albanie autrement" },
      {
        name: "description",
        content:
          "Séjours en Albanie soigneusement sélectionnés : voyages en couple, en famille, randonnées, escapades estivales et expériences inoubliables.",
      },
      { property: "og:title", content: "Wonder Albania — Découvrez l’Albanie autrement" },
      {
        property: "og:description",
        content: "Des séjours et expériences en Albanie conçus avec nos experts locaux.",
      },
      { name: "twitter:title", content: "Wonder Albania — Découvrez l’Albanie autrement" },
      {
        name: "twitter:description",
        content: "Des séjours et expériences en Albanie conçus avec nos experts locaux.",
      },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:url", content: "https://wonderalbania.com/fr/" },
    ],
    links: [
      { rel: "canonical", href: "https://wonderalbania.com/fr/" },
      { rel: "alternate", hrefLang: "en", href: "https://wonderalbania.com/" },
      { rel: "alternate", hrefLang: "fr", href: "https://wonderalbania.com/fr/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://wonderalbania.com/" },
    ],
  }),
  component: FrenchHomeRoute,
});

function FrenchHomeRoute() {
  return <HomePage locale="fr" collections={Route.useLoaderData()} />;
}
