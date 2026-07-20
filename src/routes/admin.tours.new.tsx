import { createFileRoute } from "@tanstack/react-router";
import { TourEditor } from "../components/admin/TourEditor";
import { getAdminReferenceDataFn } from "../lib/tours/server";
import { createEmptyTour } from "../lib/tours/types";

export const Route = createFileRoute("/admin/tours/new")({
  loader: () => getAdminReferenceDataFn(),
  component: NewTourPage,
});

function NewTourPage() {
  return <TourEditor initialTour={createEmptyTour()} referenceData={Route.useLoaderData()} />;
}

