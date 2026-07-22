import { createFileRoute } from "@tanstack/react-router";
import { MediaLibraryManager } from "../components/admin/MediaLibraryManager";
import { listMediaAssetsFn } from "../lib/places/server";
export const Route = createFileRoute("/admin/media")({
  loader: () => listMediaAssetsFn(),
  component: AdminMediaPage,
});

function AdminMediaPage() {
  return <MediaLibraryManager initialAssets={Route.useLoaderData()} />;
}
