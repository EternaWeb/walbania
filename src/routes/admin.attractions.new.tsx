import { createFileRoute } from "@tanstack/react-router";
import { PlaceEditor } from "../components/admin/PlaceEditor";
import { getPlaceReferenceDataFn } from "../lib/places/server";
import { createEmptyPlace } from "../lib/places/types";
export const Route = createFileRoute("/admin/attractions/new")({
  loader: () => getPlaceReferenceDataFn({ data: {} }),
  component: NewAttractionPage,
});

function NewAttractionPage() {
  return (
    <PlaceEditor
      initialPlace={createEmptyPlace("attraction")}
      referenceData={Route.useLoaderData()}
    />
  );
}
