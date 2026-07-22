import { createFileRoute } from "@tanstack/react-router";
import { PlaceAdminList } from "../components/admin/PlaceAdminList";
import { listAdminPlacesFn } from "../lib/places/server";
export const Route = createFileRoute("/admin/destinations/")({
  loader: () => listAdminPlacesFn({ data: { kind: "destination" } }),
  component: AdminDestinationsPage,
});

function AdminDestinationsPage() {
  return <PlaceAdminList kind="destination" places={Route.useLoaderData()} />;
}
