import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import legalCss from "../legal.css?url";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { SiteLocaleProvider } from "../i18n";
import { SITE_NAME, SITE_URL } from "../lib/site";

const sections = [
  {
    id: "scope",
    title: "1. Scope and acceptance",
    content: (
      <>
        <p>
          These Terms of Service apply when you use the Wonder Albania website, ask us to prepare a
          travel proposal, or book a tour, activity, transfer, stay or other travel service through
          us. By making a booking, you confirm that you are at least 18 years old, have authority to
          accept these terms for everyone named in the booking, and will provide complete and
          accurate information.
        </p>
        <p>
          Your confirmed itinerary, invoice and any service-specific conditions form part of your
          agreement with us. If they conflict with these general terms, the more specific confirmed
          terms will apply.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "2. Our services",
    content: (
      <p>
        Wonder Albania designs and arranges travel experiences in Albania. Depending on the booking,
        we may provide a service directly or arrange it with independent accommodation, transport,
        guide, activity and hospitality providers. The identity of the relevant provider and the
        principal services included will be shown in your proposal or booking confirmation.
      </p>
    ),
  },
  {
    id: "booking",
    title: "3. Booking and payment",
    content: (
      <>
        <p>
          A request or proposal is not a confirmed booking. A binding booking is created when we
          send written confirmation and receive any deposit or payment stated in the proposal.
          Prices are shown in the stated currency and include only the services listed as included.
        </p>
        <p>
          You must pay the balance by the due date on your invoice. If payment is late, we may treat
          the booking as cancelled by you after giving reasonable notice. Bank, card or currency
          conversion charges imposed by your payment provider remain your responsibility.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "4. Changes, cancellations and refunds",
    content: (
      <>
        <p>
          The change and cancellation conditions shown before booking apply to your reservation. If
          you ask to change a confirmed booking, we will try to help, but availability and any
          supplier charges may affect the price. Name changes may be treated as cancellations where
          a supplier does not allow a transfer.
        </p>
        <p>
          If we need to make a significant change, we will tell you as soon as reasonably possible
          and explain the available options. Where applicable law gives you a right to cancel,
          receive a refund, accept an alternative, or transfer a package booking, those mandatory
          rights remain unaffected by these terms.
        </p>
      </>
    ),
  },
  {
    id: "traveler",
    title: "5. Your responsibilities",
    content: (
      <>
        <p>
          You are responsible for passports, visas, entry requirements, health requirements,
          insurance and arriving at each departure point on time. Tell us before booking about
          mobility needs, medical conditions, allergies or other requirements that may affect safe
          participation.
        </p>
        <p>
          Travelers must follow reasonable safety instructions and respect local communities,
          guides, accommodation and the natural environment. We or a provider may refuse or end a
          service where conduct creates a safety risk, materially disrupts others, or breaks the
          law. Refunds are not normally available in those circumstances.
        </p>
      </>
    ),
  },
  {
    id: "insurance",
    title: "6. Travel insurance",
    content: (
      <p>
        We strongly recommend comprehensive travel insurance from the date you book. Your policy
        should be appropriate for your itinerary and cover medical care, evacuation, cancellation,
        interruption, baggage and any planned adventure activities. Insurance is not included unless
        your confirmation expressly says otherwise.
      </p>
    ),
  },
  {
    id: "unavoidable",
    title: "7. Events beyond reasonable control",
    content: (
      <p>
        Weather, natural events, public authority decisions, border restrictions, strikes, civil
        disruption, public-health events and similar circumstances can affect travel. We will take
        reasonable steps to assist and to provide any remedy required by applicable law, but we are
        not responsible for losses that could not have been avoided even with reasonable care.
        Additional accommodation, transport or personal costs may remain your responsibility or that
        of your insurer.
      </p>
    ),
  },
  {
    id: "liability",
    title: "8. Liability",
    content: (
      <>
        <p>
          We will perform the services we provide with reasonable care and skill. Nothing in these
          terms excludes or limits liability that cannot legally be excluded, including liability
          for death or personal injury caused by negligence, fraud, or your mandatory consumer
          rights.
        </p>
        <p>
          Subject to those protections, we are not responsible for indirect or unforeseeable loss,
          business loss, or loss caused by your act or omission, an unrelated third party, or an
          unavoidable event outside reasonable control. Any limitation in an applicable
          international transport convention also applies where relevant.
        </p>
      </>
    ),
  },
  {
    id: "website",
    title: "9. Website use and intellectual property",
    content: (
      <p>
        Website content is provided for personal travel planning. Wonder Albania or its licensors
        own the text, branding, design, photography and other protected content. You may not copy,
        scrape, republish, sell, interfere with, or attempt unauthorized access to the website
        except where the law permits it. Availability, itineraries and prices may change before a
        booking is confirmed.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "10. Privacy",
    content: (
      <p>
        We use personal information to answer inquiries, administer bookings, coordinate providers,
        process payments, meet legal obligations and support travelers. Our Privacy Policy explains
        this in more detail. You are responsible for ensuring that other travelers have agreed to
        you sharing their information with us for the booking.
      </p>
    ),
  },
  {
    id: "complaints",
    title: "11. Problems and complaints",
    content: (
      <p>
        Tell your guide, provider or our team promptly if a problem arises during a trip so there is
        a fair opportunity to resolve it. If it is not resolved, email hello@wonderalbania.com with
        your booking reference and relevant details as soon as possible after the service. We will
        review the matter and respond within a reasonable period.
      </p>
    ),
  },
  {
    id: "law",
    title: "12. Governing law",
    content: (
      <p>
        These terms are governed by the laws of the Republic of Albania. The courts of Albania will
        have jurisdiction, except where the mandatory consumer law of your country of residence
        gives you the right to bring a claim elsewhere or provides protections that cannot be
        waived.
      </p>
    ),
  },
  {
    id: "updates",
    title: "13. Changes to these terms",
    content: (
      <p>
        We may update these terms for future use of the website and future bookings. The version in
        force when your booking is confirmed will continue to govern that booking unless a change is
        required by law or you agree otherwise in writing.
      </p>
    ),
  },
];

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: `Terms of Service | ${SITE_NAME}` },
      {
        name: "description",
        content: "Terms that apply when using Wonder Albania and booking our travel services.",
      },
      { property: "og:title", content: `Terms of Service | ${SITE_NAME}` },
      {
        property: "og:description",
        content: "Terms that apply when using Wonder Albania and booking our travel services.",
      },
      { property: "og:url", content: `${SITE_URL}/terms-of-service` },
    ],
    links: [
      { rel: "stylesheet", href: legalCss },
      { rel: "canonical", href: `${SITE_URL}/terms-of-service` },
    ],
  }),
  component: TermsRoute,
});

function TermsPage() {
  return (
    <div className="legal-page min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <header className="legal-intro page-inset">
          <div className="legal-intro-copy">
            <h1>Terms of Service</h1>
            <p>
              Clear terms for planning and traveling with Wonder Albania, from your first inquiry
              through the journey home.
            </p>
            <div className="legal-meta">
              <span>Effective 24 July 2026</span>
              <a href="mailto:hello@wonderalbania.com">
                Questions about these terms <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </header>

        <div className="legal-layout page-inset">
          <aside className="legal-nav" aria-label="Terms sections">
            <p>On this page</p>
            <nav>
              {sections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  {section.title.replace(/^\d+\.\s/, "")}
                </a>
              ))}
              <a href="#contact-details">Contact</a>
            </nav>
          </aside>

          <article className="legal-content">
            <div className="legal-summary">
              <strong>Please read before booking</strong>
              <p>
                Your booking confirmation may include additional conditions for a particular tour or
                provider. Nothing here removes rights that applicable law says cannot be limited.
              </p>
            </div>

            {sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.content}
              </section>
            ))}

            <section id="contact-details">
              <h2>14. Contact</h2>
              <p>
                Wonder Albania sh.p.k.
                <br />
                Rr. Deshmoret e 4 Shkurtit, Tirana, Albania
                <br />
                <a href="mailto:hello@wonderalbania.com">hello@wonderalbania.com</a>
                <br />
                <a href="tel:+355692290036">+355 692290036</a>
                <br />
                <a href="tel:0682778037">0682778037</a>
              </p>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function TermsRoute() {
  return (
    <SiteLocaleProvider locale="en" alternatePaths={{ en: "/terms-of-service" }}>
      <TermsPage />
    </SiteLocaleProvider>
  );
}
