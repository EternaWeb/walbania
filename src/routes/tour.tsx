import { createFileRoute, redirect } from "@tanstack/react-router";
import { getFeaturedTourPathFn } from "../lib/tours/server";

export const Route = createFileRoute("/tour")({
  loader: async () => {
    const location = await getFeaturedTourPathFn({ data: { locale: "en" } });
    throw redirect({ href: location, statusCode: 302 });
  },
  component: () => null,
});
