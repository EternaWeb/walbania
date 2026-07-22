import { createFileRoute } from "@tanstack/react-router";
import { PlaceAdminList } from "../components/admin/PlaceAdminList";
import { listAdminPlacesFn } from "../lib/places/server";
export const Route = createFileRoute("/admin/attractions/")({
  loader: () => listAdminPlacesFn({ data: { kind: "attraction" } }),
  component: AdminAttractionsPage,
});

function AdminAttractionsPage() {
  return <PlaceAdminList kind="attraction" places={Route.useLoaderData()} />;
}
