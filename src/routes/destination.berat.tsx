import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/destination/berat")({
  loader: () => {
    throw redirect({ href: "/destinations/berat", statusCode: 301 });
  },
  component: () => null,
});
