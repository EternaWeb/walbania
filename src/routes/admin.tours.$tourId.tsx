import { createFileRoute } from "@tanstack/react-router";
import { TourEditor } from "../components/admin/TourEditor";
import { getAdminReferenceDataFn, getTourEditorFn } from "../lib/tours/server";

export const Route = createFileRoute("/admin/tours/$tourId")({
  loader: async ({ params }) => {
    const [tour, referenceData] = await Promise.all([
      getTourEditorFn({ data: { id: params.tourId } }),
      getAdminReferenceDataFn(),
    ]);
    return { tour, referenceData };
  },
  component: EditTourPage,
});

function EditTourPage() {
  const { tour, referenceData } = Route.useLoaderData();
  return <TourEditor initialTour={tour} referenceData={referenceData} />;
}

