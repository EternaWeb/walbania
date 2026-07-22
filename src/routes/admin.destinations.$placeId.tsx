import { createFileRoute } from "@tanstack/react-router";
import { PlaceEditor } from "../components/admin/PlaceEditor";
import { getPlaceEditorFn, getPlaceReferenceDataFn } from "../lib/places/server";
export const Route = createFileRoute("/admin/destinations/$placeId")({
  loader: async ({ params }) => {
    const [place, references] = await Promise.all([
      getPlaceEditorFn({ data: { id: params.placeId } }),
      getPlaceReferenceDataFn({ data: { placeId: params.placeId } }),
    ]);
    return { place, references };
  },
  component: EditDestinationPage,
});

function EditDestinationPage() {
  const data = Route.useLoaderData();
  return <PlaceEditor initialPlace={data.place} referenceData={data.references} />;
}
