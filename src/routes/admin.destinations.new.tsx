import { createFileRoute } from "@tanstack/react-router";
import { PlaceEditor } from "../components/admin/PlaceEditor";
import { getPlaceReferenceDataFn } from "../lib/places/server";
import { createEmptyPlace } from "../lib/places/types";
export const Route = createFileRoute("/admin/destinations/new")({
  loader: () => getPlaceReferenceDataFn({ data: {} }),
  component: NewDestinationPage,
});

function NewDestinationPage() {
  return (
    <PlaceEditor
      initialPlace={createEmptyPlace("destination")}
      referenceData={Route.useLoaderData()}
    />
  );
}
