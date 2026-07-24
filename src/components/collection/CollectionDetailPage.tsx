import "../../collection.css";
import "../../tour-listing.css";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SiteLocaleProvider } from "../../i18n";
import type { CollectionDetail, CollectionLocale } from "../../lib/collections/types";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { TravelIdeasSection } from "../TravelIdeasSection";
import { TourCard } from "../tour/TourListingPage";

const COLLECTION_FEATURES = [
  {
    number: "01",
    title: "Local expertise",
    detail: "Designed by people who know Albania firsthand",
  },
  {
    number: "02",
    title: "Made around you",
    detail: "Flexible pacing, stays and experiences",
  },
  {
    number: "03",
    title: "Supported throughout",
    detail: "Clear planning and help on the ground",
  },
];

export function CollectionDetailPage({
  locale,
  collection,
}: {
  locale: CollectionLocale;
  collection: CollectionDetail;
}) {
  const isFrench = locale === "fr";
  const [visibleCount, setVisibleCount] = useState(6);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const visibleTours = collection.tours.slice(0, visibleCount);

  return (
    <SiteLocaleProvider locale={locale}>
      <div className="collection-page min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main>
          <section
            className="index-hero-shell collection-detail-hero"
            aria-labelledby="collection-title"
          >
            <div className="index-hero-media">
              {collection.image ? (
                <img
                  className="index-hero-poster"
                  src={collection.image}
                  alt={collection.imageAlt}
                  fetchPriority="high"
                />
              ) : null}
              <span className="index-hero-film" aria-hidden="true" />
              <div className="index-hero-copy">
                <a className="index-hero-cta" href="/collection">
                  <span className="index-hero-cta-label">
                    {isFrench ? "Explorer les collections" : "Explore Collection"}
                  </span>
                </a>
                <h1 id="collection-title">{collection.name}</h1>
              </div>
            </div>

            <div className="index-hero-features" aria-label="Collection benefits">
              {COLLECTION_FEATURES.map((feature) => (
                <div className="index-hero-feature" key={feature.number}>
                  <span className="index-hero-feature-number">{feature.number}</span>
                  <div>
                    <h2>{feature.title}</h2>
                    <p>{feature.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="tour-container collection-tours"
            aria-labelledby="collection-tours-title"
          >
            <div className="collection-tours-heading">
              <div className="section-heading">
                <span className="eyebrow">
                  {isFrench ? "Circuits sélectionnés" : "Selected tours"}
                </span>
                <h2 id="collection-tours-title">
                  {isFrench
                    ? `Découvrez ${collection.name}`
                    : `Ways to experience ${collection.name}`}
                </h2>
              </div>
              <p>
                {collection.tours.length} {isFrench ? "circuits" : "tours"}
              </p>
            </div>

            {visibleTours.length ? (
              <div className="collection-tour-grid">
                {visibleTours.map((tour) => (
                  <TourCard tour={tour} locale={locale} key={tour.id} />
                ))}
              </div>
            ) : (
              <div className="collection-empty">
                <h3>{isFrench ? "De nouveaux circuits arrivent." : "New tours are coming."}</h3>
                <p>
                  {isFrench
                    ? "Cette collection est prête. Les circuits publiés et associés apparaîtront ici automatiquement."
                    : "This collection is ready. Published tours assigned to it will appear here automatically."}
                </p>
              </div>
            )}

            {visibleCount < collection.tours.length ? (
              <button
                type="button"
                className="collection-view-all"
                onClick={() => setVisibleCount((count) => count + 6)}
              >
                {isFrench ? "Voir plus" : "View all"}
              </button>
            ) : null}
          </section>

          <section className="tour-container collection-description">
            <button
              type="button"
              aria-expanded={detailsOpen}
              aria-controls="collection-description-copy"
              onClick={() => setDetailsOpen((open) => !open)}
            >
              <span>
                {collection.name} {isFrench ? "en détail" : "in more detail"}
              </span>
              <ChevronDown size={22} aria-hidden="true" />
            </button>
            <div
              id="collection-description-copy"
              className={`collection-description-answer${detailsOpen ? " is-open" : ""}`}
            >
              <div>
                <p>{collection.description}</p>
              </div>
            </div>
          </section>

          <TravelIdeasSection className="collection-more-ideas" />
        </main>
        <SiteFooter />
      </div>
    </SiteLocaleProvider>
  );
}
