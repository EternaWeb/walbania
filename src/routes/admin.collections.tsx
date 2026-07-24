import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "../components/admin/CollectionManager";
import { listAdminCollectionsFn } from "../lib/collections/server";

export const Route = createFileRoute("/admin/collections")({
  loader: () => listAdminCollectionsFn(),
  component: AdminCollectionsPage,
});

function AdminCollectionsPage() {
  return <CollectionManager initialData={Route.useLoaderData()} />;
}
