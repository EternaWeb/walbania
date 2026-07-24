import "../../collection.css";
import { SiteLocaleProvider } from "../../i18n";
import type { CollectionLocale, CollectionSummary } from "../../lib/collections/types";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { HolidayCollectionCard } from "./HolidayCollectionCard";

const DIRECTORY_HERO =
  "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=2000&q=84";

export function CollectionDirectoryPage({
  locale,
  collections,
}: {
  locale: CollectionLocale;
  collections: CollectionSummary[];
}) {
  const isFrench = locale === "fr";
  return (
    <SiteLocaleProvider locale={locale}>
      <div className="collection-page min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main>
          <section className="index-hero-shell collection-directory-hero">
            <div className="index-hero-media">
              <img
                className="index-hero-poster"
                src={DIRECTORY_HERO}
                alt="Mountain landscapes in Albania"
                fetchPriority="high"
              />
              <span className="index-hero-film" aria-hidden="true" />
              <div className="index-hero-copy">
                <span className="index-hero-cta">
                  <span className="index-hero-cta-label">
                    {isFrench ? "Collections Wonder Albania" : "Wonder Albania Collections"}
                  </span>
                </span>
                <h1>{isFrench ? "Voyagez à votre façon." : "Travel your way."}</h1>
              </div>
            </div>
          </section>

          <section
            className="page-inset collection-directory-list"
            aria-labelledby="collections-title"
          >
            <div className="section-heading">
              <span className="eyebrow">
                {isFrench ? "Choisissez votre voyage" : "Choose your journey"}
              </span>
              <h2 id="collections-title">
                {isFrench
                  ? "Des collections pensées pour votre façon de voyager."
                  : "Collections shaped around how you want to travel."}
              </h2>
            </div>
            <div className="holiday-collection-grid is-directory">
              {collections.map((collection, index) => (
                <HolidayCollectionCard
                  collection={collection}
                  priority={index < 4}
                  key={collection.id}
                />
              ))}
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </SiteLocaleProvider>
  );
}
