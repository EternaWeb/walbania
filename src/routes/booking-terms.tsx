import { createFileRoute } from "@tanstack/react-router";
import bookingTerms from "../content/legal/booking-terms.md?raw";
import legalCss from "../legal.css?url";
import { LegalDocumentPage } from "../components/LegalDocumentPage";
import { SITE_NAME, SITE_URL } from "../lib/site";

export const Route = createFileRoute("/booking-terms")({
  head: () => ({
    meta: [
      { title: `Booking Terms and Conditions | ${SITE_NAME}` },
      {
        name: "description",
        content:
          "The terms governing bookings, payments, changes, traveller responsibilities and services arranged by Wonder Albania.",
      },
      { property: "og:title", content: `Booking Terms and Conditions | ${SITE_NAME}` },
      {
        property: "og:description",
        content:
          "The terms governing bookings, payments, changes and travel services arranged by Wonder Albania.",
      },
      { property: "og:url", content: `${SITE_URL}/booking-terms` },
    ],
    links: [
      { rel: "stylesheet", href: legalCss },
      { rel: "canonical", href: `${SITE_URL}/booking-terms` },
    ],
  }),
  component: BookingTermsRoute,
});

function BookingTermsRoute() {
  return (
    <LegalDocumentPage
      title="Booking Terms and Conditions"
      summary="The agreement that applies when you book a tour, package or travel service with Wonder Albania."
      note="Your confirmation, invoice, itinerary and any written special conditions supplied before booking also form part of your Booking Agreement."
      markdown={bookingTerms}
    />
  );
}
