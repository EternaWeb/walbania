import { createFileRoute } from "@tanstack/react-router";
import cancellationPolicy from "../content/legal/cancellation.md?raw";
import legalCss from "../legal.css?url";
import { LegalDocumentPage } from "../components/LegalDocumentPage";
import { SITE_NAME, SITE_URL } from "../lib/site";

export const Route = createFileRoute("/cancelation")({
  head: () => ({
    meta: [
      { title: `Cancellation Terms and Conditions | ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Wonder Albania cancellation charges, booking changes, refunds and processing terms.",
      },
      { property: "og:title", content: `Cancellation Terms and Conditions | ${SITE_NAME}` },
      {
        property: "og:description",
        content: "Cancellation charges, booking changes and refund terms for Wonder Albania.",
      },
      { property: "og:url", content: `${SITE_URL}/cancelation` },
    ],
    links: [
      { rel: "stylesheet", href: legalCss },
      { rel: "canonical", href: `${SITE_URL}/cancelation` },
    ],
  }),
  component: CancellationRoute,
});

function CancellationRoute() {
  return (
    <LegalDocumentPage
      title="Cancellation Terms and Conditions"
      summary="The standard cancellation, change and refund rules for bookings made with Wonder Albania."
      note="Your booking confirmation may contain different conditions for a specific service. Clearly disclosed service-specific conditions apply subject to mandatory law."
      markdown={cancellationPolicy}
    />
  );
}
