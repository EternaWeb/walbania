import { createFileRoute } from "@tanstack/react-router";
import { DestinationDetailPage } from "../components/destination/DestinationDetailPage";

const canonical = "https://wonderalbania.com/destination/berat";

export const Route = createFileRoute("/destination/berat")({
  head: () => ({
    meta: [
      { title: "Visit Berat, Albania | Tours & Travel Guide | WonderAlbania" },
      {
        name: "description",
        content:
          "Discover Berat's UNESCO old town, castle, neighbourhoods and handpicked local tours with WonderAlbania.",
      },
      { property: "og:title", content: "Berat, Albania | WonderAlbania" },
      {
        property: "og:description",
        content: "Meet the city of a thousand windows and find the right Berat experience.",
      },
      {
        property: "og:image",
        content: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1600&q=88",
      },
      { property: "og:url", content: canonical },
      { name: "twitter:title", content: "Berat, Albania | WonderAlbania" },
      {
        name: "twitter:description",
        content: "Meet the city of a thousand windows and find the right Berat experience.",
      },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: DestinationDetailPage,
});
