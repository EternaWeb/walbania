import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "./index";

export const Route = createFileRoute("/fr")({
  head: () => ({
    meta: [
      { title: "WonderAlbania — Découvrez l’Albanie autrement" },
      {
        name: "description",
        content:
          "Séjours en Albanie soigneusement sélectionnés : voyages en couple, en famille, randonnées, escapades estivales et expériences inoubliables.",
      },
      { property: "og:title", content: "WonderAlbania — Découvrez l’Albanie autrement" },
      {
        property: "og:description",
        content: "Des séjours et expériences en Albanie conçus avec nos experts locaux.",
      },
      { name: "twitter:title", content: "WonderAlbania — Découvrez l’Albanie autrement" },
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
  component: () => <HomePage locale="fr" />,
});
