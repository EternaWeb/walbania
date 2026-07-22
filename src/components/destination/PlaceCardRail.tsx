import { Landmark, MapPin } from "lucide-react";
import type { SiteLocale } from "../../i18n";
import type { PlaceCard } from "../../lib/places/types";
import { Rail } from "../tour/TourListingPage";

export function PlaceCardTile({ place }: { place: PlaceCard }) {
  const Icon = place.kind === "attraction" ? Landmark : MapPin;
  return (
    <a className="tour-destination-card place-card-tile" href={place.href}>
      {place.image ? (
        <img src={place.image} alt={place.imageAlt} loading="lazy" decoding="async" />
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
