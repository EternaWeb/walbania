import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { useLocalize, useSiteLocale } from "../i18n";
import { PerformanceImage } from "./PerformanceImage";

export type FaqItem = {
  question: string;
  answer: string;
};

export const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "How do I book a trip with Wonder Albania?",
    answer:
      "Choose a collection or deal, click through to the detail page, and follow the booking steps. Our team confirms every reservation within 24 hours.",
  },
  {
    question: "Are flights included in the packages?",
    answer:
      "Most all-inclusive deals include stays, transfers and experiences. Flights are optional and can be added at checkout.",
  },
  {
    question: "Can I customize an itinerary?",
    answer:
      "Yes — every experience can be tailored. Use the 'Not sure where to go?' section or contact us directly.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Free cancellation up to 30 days before departure on most bookings. Details are shown on each package.",
  },
  {
    question: "Do you offer group discounts?",
    answer: "Groups of 6 or more receive automatic discounts. Reach out for tailored quotes.",
  },
];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1200&q=85";

export function FaqSection({
  items = DEFAULT_FAQS,
  eyebrow,
  title,
  image = DEFAULT_IMAGE,
  imageAlt,
  className = "",
}: {
  items?: FaqItem[];
  eyebrow?: string;
  title?: string;
  image?: string;
  imageAlt?: string;
  className?: string;
}) {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const sectionId = useId();
  const [open, setOpen] = useState<number | null>(0);
  const shownTitle =
    title ?? (locale === "fr" ? "Questions fréquentes" : "Frequently asked questions");
  const shownEyebrow = eyebrow ?? (locale === "fr" ? "Bon à savoir" : "Good to know");
  const shownAlt =
    imageAlt ??
    (locale === "fr"
      ? "Paysage albanais vu depuis un sentier"
      : "Albanian landscape viewed from a travel trail");

  return localize(
    <section className={`shared-faq-section page-inset ${className}`.trim()} id="faqs">
      <div className="shared-faq-layout">
        <div className="shared-faq-media">
          <PerformanceImage
            src={image}
            alt={shownAlt}
            width={1000}
            height={1250}
            sizes="(max-width: 720px) 0px, (max-width: 1100px) 42vw, 560px"
            maxWidth={1200}
          />
          <span />
        </div>
        <div className="shared-faq-content">
          <span className="shared-faq-eyebrow">{shownEyebrow}</span>
          <h2>{shownTitle}</h2>
          <div className="shared-faq-list">
            {items.map((item, index) => {
              const expanded = open === index;
              const answerId = `${sectionId}-answer-${index}`;
              return (
                <div className={expanded ? "is-open" : ""} key={`${item.question}-${index}`}>
                  <button
                    type="button"
                    aria-controls={answerId}
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={19} />
                  </button>
                  <div
                    id={answerId}
                    className="shared-faq-answer"
                    role="region"
                    aria-hidden={!expanded}
                  >
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>,
  );
}
