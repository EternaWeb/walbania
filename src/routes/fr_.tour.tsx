import { createFileRoute, redirect } from "@tanstack/react-router";
import { getFeaturedTourPathFn } from "../lib/tours/server";

export const Route = createFileRoute("/fr_/tour")({
  loader: async () => {
    const location = await getFeaturedTourPathFn({ data: { locale: "fr" } });
    throw redirect({ href: location, statusCode: 302 });
  },
  component: () => null,
});
