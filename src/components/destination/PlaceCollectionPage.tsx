import { Landmark, MapPin } from "lucide-react";
import type { SiteLocale } from "../../i18n";
import { SiteLocaleProvider } from "../../i18n";
import type { PlaceCard, PlaceKind, PlaceMapPoint } from "../../lib/places/types";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
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
  const Icon = isAttraction ? Landmark : MapPin;
  const mapLocations = toMapLocations(mapPoints);
  const first = cards[0];

  return (
    <div className="tours-index-page place-collection-page min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="place-collection-hero">
          {first?.image ? <img src={first.image} alt={first.imageAlt} /> : null}
          <span aria-hidden="true" />
          <div className="page-inset place-collection-hero-copy">
            <Icon size={28} />
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

        <section className="place-collection-list page-inset">
          <div className="tours-index-heading is-left">
            <h2>{isFrench ? `Toutes les ${title.toLowerCase()}` : `All ${title}`}</h2>
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
          <section className="place-collection-map page-inset">
            <div className="tours-index-heading is-left">
              <h2>{isFrench ? "Explorer la carte" : "Explore the map"}</h2>
            </div>
            <AlbaniaDestinationMap activeSlug={mapLocations[0].slug} locations={mapLocations} />
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
