import { Landmark, MapPin } from "lucide-react";
import type { SiteLocale } from "../../i18n";
import type { PlaceCard } from "../../lib/places/types";
import { Rail } from "../tour/TourListingPage";
import { PerformanceImage } from "../PerformanceImage";

export function PlaceCardTile({ place }: { place: PlaceCard }) {
  const Icon = place.kind === "attraction" ? Landmark : MapPin;
  return (
    <a className="tour-destination-card place-card-tile" href={place.href}>
      {place.image ? (
        <PerformanceImage
          src={place.image}
          alt={place.imageAlt}
          width={900}
          height={600}
          sizes="(max-width: 720px) calc(100vw - 24px), (max-width: 1100px) 48vw, 420px"
          maxWidth={900}
        />
      ) : (
        <div className="place-card-fallback" aria-hidden="true">
          WonderAlbania
        </div>
      )}
      <span aria-hidden="true" />
      <div className="place-card-copy">
        <small>
          <Icon size={13} />
          {place.kind === "attraction" && place.parentTitle
            ? place.parentTitle
            : place.kind === "attraction"
              ? "Attraction"
              : "Destination"}
        </small>
        <h3>{place.title}</h3>
      </div>
    </a>
  );
}

export function PlaceCardRail({ places, locale }: { places: PlaceCard[]; locale: SiteLocale }) {
  return (
    <Rail locale={locale}>
      {places.map((place) => (
        <PlaceCardTile place={place} key={place.id} />
      ))}
    </Rail>
  );
}
