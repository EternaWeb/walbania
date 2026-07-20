import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getPublicTourFn } from "../lib/tours/server";

export const Route = createFileRoute("/tour_/$slug")({
  loader: async ({ params }) => {
    const result = await getPublicTourFn({ data: { slug: params.slug, locale: "en" } });
    if (result.kind === "not-found") throw notFound();
    throw redirect({
      href: result.kind === "redirect" ? result.location : result.tour.href,
      statusCode: 301,
    });
  },
  component: () => null,
});
