import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { DynamicTourPage } from "../components/tour/DynamicTourPage";
import { getTourPreviewFn } from "../lib/tours/server";

export const Route = createFileRoute("/admin_/tours/$tourId/preview")({
  validateSearch: z.object({ locale: z.enum(["en", "fr"]).catch("en") }),
  loaderDeps: ({ search }) => ({ locale: search.locale }),
  loader: ({ params, deps }) =>
    getTourPreviewFn({ data: { id: params.tourId, locale: deps.locale } }),
  head: () => ({
    meta: [
      { title: "Tour preview | WonderAlbania Admin" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  component: TourPreviewPage,
});

function TourPreviewPage() {
  return <DynamicTourPage tour={Route.useLoaderData()} />;
}
