import { ArrowUpRight } from "lucide-react";
import type { SiteLocale } from "../../i18n";
import { SiteLocaleProvider } from "../../i18n";
import type { PlaceCard, PlaceKind, PlaceMapPoint } from "../../lib/places/types";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { PerformanceImage } from "../PerformanceImage";
import { AlbaniaDestinationMap } from "./AlbaniaDestinationMap";
import type { DestinationMapLocation } from "./AlbaniaDestinationMap";
import { PlaceCardTile } from "./PlaceCardRail";
import "../../tour-listing.css";
import "../../destination-detail.css";

function toMapLocations(points: PlaceMapPoint[]): DestinationMapLocation[] {
  return points.flatMap((point) =>
    point.coordinates
      ? [
          {
            slug: point.id,
            kind: point.kind,
            name: point.title,
            region: point.parentTitle,
            summary: point.summary,
            image: point.image,
            href: point.href,
            coordinates: point.coordinates,
          },
        ]
      : [],
  );
}

function CollectionContent({
  kind,
  locale,
  cards,
  mapPoints,
}: {
  kind: PlaceKind;
  locale: SiteLocale;
  cards: PlaceCard[];
  mapPoints: PlaceMapPoint[];
}) {
  const isFrench = locale === "fr";
  const isAttraction = kind === "attraction";
  const title = isAttraction ? "Attractions" : "Destinations";
  const mapLocations = toMapLocations(mapPoints);
  const first = cards[0];
  const heroLabel = isFrench
    ? isAttraction
      ? "Explorer les attractions"
      : "Explorer les destinations"
    : isAttraction
      ? "Explore attractions"
      : "Explore destinations";
  const introTitle = isFrench
    ? isAttraction
      ? "Des monuments, des paysages et des histoires qui méritent le détour."
      : "Des villes, des côtes et des villages de montagne, chacun avec son propre rythme."
    : isAttraction
      ? "Landmarks, landscapes and stories worth stopping for."
      : "Cities, coasts and mountain towns — each with its own rhythm.";

  return (
    <div className="tours-index-page place-collection-page min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="place-collection-hero">
          {first?.image ? (
            <PerformanceImage
              src={first.image}
              alt={first.imageAlt}
              width={1920}
              height={1080}
              sizes="100vw"
              maxWidth={1920}
              priority
            />
          ) : null}
          <span className="index-hero-film" aria-hidden="true" />
          <div className="place-collection-hero-copy">
            <a className="index-hero-cta" href="#places">
              <span className="index-hero-cta-label">{heroLabel}</span>
              <span className="index-hero-cta-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
            <h1>{title}</h1>
            <p>
              {isFrench
                ? isAttraction
                  ? "Explorez les sites, monuments et paysages qui donnent à chaque voyage son caractère."
                  : "Découvrez les villes albanaises et reliez chaque lieu aux circuits qui le traversent."
                : isAttraction
                  ? "Explore the sights, landmarks and landscapes that give each journey its character."
                  : "Discover Albania’s cities and connect each place with the tours that travel through it."}
            </p>
          </div>
        </section>

        <section className="place-collection-intro">
          <div className="page-inset">
            <span>{isFrench ? "DÉCOUVRIR L’ALBANIE" : "DISCOVER ALBANIA"}</span>
            <h2>{introTitle}</h2>
            <p>
              {isFrench
                ? isAttraction
                  ? "Reliez les lieux emblématiques de l’Albanie aux circuits qui leur donnent du contexte."
                  : "Choisissez un lieu, découvrez son caractère et trouvez les circuits qui vous y emmènent."
                : isAttraction
                  ? "Connect Albania’s defining sights with the journeys that give each one context."
                  : "Choose a place, understand its character and find the journeys that take you there."}
            </p>
          </div>
        </section>

        <section className="place-collection-list page-inset" id="places">
          <div className="place-collection-heading">
            <div className="tours-index-heading is-left">
              <span>{isFrench ? "TOUS LES LIEUX" : "ALL PLACES"}</span>
              <h2>
                {isFrench
                  ? isAttraction
                    ? "Des lieux qui racontent l’Albanie"
                    : "Choisissez votre prochaine étape"
                  : isAttraction
                    ? "Places that tell Albania’s story"
                    : "Choose your next stop"}
              </h2>
            </div>
            <p>
              {cards.length} {isFrench ? "lieux publiés" : "places to explore"}
            </p>
          </div>
          {cards.length ? (
            <div className="place-card-grid">
              {cards.map((card) => (
                <PlaceCardTile place={card} key={card.id} />
              ))}
            </div>
          ) : (
            <p className="place-empty-message">
              {isFrench
                ? "Le premier lieu sera bientôt publié."
                : "The first place will be published soon."}
            </p>
          )}
        </section>

        {mapLocations.length ? (
          <section className="place-collection-map">
            <div className="page-inset place-collection-map-inner">
              <div className="tour-destinations-heading">
                <span>{isFrench ? "ALBANIE" : "ALBANIA"}</span>
                <h2>{isFrench ? "Explorer la carte" : "Explore the map"}</h2>
              </div>
              <AlbaniaDestinationMap activeSlug={mapLocations[0].slug} locations={mapLocations} />
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}

export function PlaceCollectionPage(props: {
  kind: PlaceKind;
  locale: SiteLocale;
  cards: PlaceCard[];
  mapPoints: PlaceMapPoint[];
}) {
  const en = props.kind === "destination" ? "/destinations" : "/attractions";
  const fr = `/fr${en}`;
  return (
    <SiteLocaleProvider locale={props.locale} alternatePaths={{ en, fr }}>
      <CollectionContent {...props} />
    </SiteLocaleProvider>
  );
}
