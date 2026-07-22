import {
  CalendarDays,
  Camera,
  Church,
  Clock3,
  CloudSun,
  Compass,
  Footprints,
  Home,
  Landmark,
  MapPin,
  Mountain,
  Navigation,
  Route,
  Sparkles,
  Sun,
  Sunset,
  Utensils,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { SiteLocaleProvider } from "../../i18n";
import type { PlaceViewModel } from "../../lib/places/types";
import { TourRail } from "../tour/TourListingPage";
import {
  DetailFacts,
  DetailHero,
  DetailHighlights,
  DetailSectionNav,
  SectionHeading,
} from "../tour/TourDetailPrimitives";
import { AlbaniaDestinationMap } from "./AlbaniaDestinationMap";
import type { DestinationMapLocation } from "./AlbaniaDestinationMap";
import { PlaceCardRail } from "./PlaceCardRail";
import "../../destination-detail.css";
import "../../tour-listing.css";

const ICONS: Record<string, LucideIcon> = {
  calendar: CalendarDays,
  camera: Camera,
  church: Church,
  clock: Clock3,
  "cloud-sun": CloudSun,
  compass: Compass,
  footprints: Footprints,
  home: Home,
  landmark: Landmark,
  map: MapPin,
  mountain: Mountain,
  navigation: Navigation,
  route: Route,
  sparkles: Sparkles,
  sun: Sun,
  sunset: Sunset,
  utensils: Utensils,
  wine: Wine,
};

function iconFor(key: string) {
  return ICONS[key] ?? MapPin;
}

function mapLocations(place: PlaceViewModel): DestinationMapLocation[] {
  return place.mapPoints.flatMap((point) =>
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

function PlaceDetailContent({ place }: { place: PlaceViewModel }) {
  const locale = place.locale;
  const isFrench = locale === "fr";
  const collectionHref = isFrench
    ? place.kind === "destination"
      ? "/fr/destinations"
      : "/fr/attractions"
    : place.kind === "destination"
      ? "/destinations"
      : "/attractions";
  const collectionName = isFrench
    ? place.kind === "destination"
      ? "Destinations"
      : "Attractions"
    : place.kind === "destination"
      ? "Destinations"
      : "Attractions";
  const breadcrumbs = [
    { href: collectionHref, label: collectionName },
    ...(place.parent ? [{ href: place.parent.href, label: place.parent.title }] : []),
    { label: place.title },
  ];
  const quickFacts = place.quickFacts.map((fact) => ({
    icon: iconFor(fact.iconKey),
    label: fact.label,
    value: fact.value,
  }));
  const highlights = place.highlights.map((item) => ({
    icon: iconFor(item.iconKey),
    label: item.label,
    text: item.text,
  }));
  const locations = mapLocations(place);

  return (
    <div className="tour-page destination-page place-detail-page">
      <SiteHeader breadcrumbs={breadcrumbs} />
      <main>
        <DetailHero
          image={place.heroImage}
          imageAlt={place.heroAlt}
          info={
            <>
              <div className="location-label">
                {place.kind === "attraction" ? <Landmark size={16} /> : <MapPin size={16} />}
                {place.parent ? `${place.parent.title}, Albania` : "Albania"}
              </div>
              {quickFacts[0] ? (
                <span className="hero-duration">
                  <Clock3 size={17} /> {quickFacts[0].value}
                </span>
              ) : null}
            </>
          }
          title={place.title}
          intro={place.heroIntro}
          primaryAction={{
            href: "#tours",
            label: isFrench ? "VOIR LES CIRCUITS" : "EXPLORE TOURS",
          }}
          secondaryAction={
            <a className="secondary-button" href="#map">
              <MapPin size={17} /> {isFrench ? "VOIR LA CARTE" : "VIEW MAP"}
            </a>
          }
          facts={place.quickFacts.slice(0, 2).map((fact) => ({
            label: fact.label,
            value: fact.value,
          }))}
          mobileBreadcrumb={breadcrumbs}
        />

        <div className="tour-container destination-content">
          <DetailSectionNav
            label={isFrench ? "Sections du lieu" : "Place sections"}
            links={[
              { href: "#story", label: isFrench ? "Découvrir" : "Discover" },
              { href: "#tours", label: isFrench ? "Circuits" : "Tours" },
              { href: "#map", label: isFrench ? "Carte" : "Map" },
            ]}
          />

          {quickFacts.length ? (
            <DetailFacts
              label={isFrench ? `${place.title} en bref` : `${place.title} at a glance`}
              facts={quickFacts}
            />
          ) : null}

          <section id="story" className="destination-stack-section">
            <div className="destination-story-stack">
              {place.sections.map((section, index) => (
                <article
                  className={`destination-story-card destination-story-card-${["one", "two", "three"][index]}`}
                  key={`${section.title}-${index}`}
                >
                  <div className="destination-story-media">
                    {section.image ? (
                      <img
                        src={section.image}
                        alt={section.imageAlt}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>
                  <div className="destination-story-copy">
                    <SectionHeading title={section.title} text={section.body} />
                    {section.secondaryBody ? <p>{section.secondaryBody}</p> : null}
                    {index === 1 && highlights.length ? (
                      <DetailHighlights highlights={highlights} />
                    ) : null}
                    {index === 2 && place.weatherFacts.length ? (
                      <div className="weather-stats destination-weather-stats">
                        {place.weatherFacts.map((fact) => {
                          const Icon = iconFor(fact.iconKey);
                          return (
                            <div key={`${fact.label}-${fact.value}`}>
                              <Icon size={23} />
                              <strong>{fact.value}</strong>
                              <span>{fact.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="tours" className="content-section destination-tours-section">
            <SectionHeading
              title={isFrench ? `Circuits liés à ${place.title}` : `Tours linked to ${place.title}`}
              text={
                isFrench
                  ? "Des expériences qui commencent ici, visitent ce lieu ou l’intègrent à leur itinéraire."
                  : "Experiences that start here, visit this place or include it in their route."
              }
            />
            <div className="destination-tour-rail">
              {place.tours.length ? (
                <TourRail tours={place.tours} locale={locale} />
              ) : (
                <p className="place-empty-message">
                  {isFrench
                    ? "Les circuits liés seront bientôt disponibles."
                    : "Linked tours will be available soon."}
                </p>
              )}
            </div>
          </section>

          <section id="map" className="content-section destination-map-section">
            <SectionHeading
              title={isFrench ? `${place.title} sur la carte` : `${place.title} on the map`}
              text={
                isFrench
                  ? "Ce lieu reste sélectionné. Touchez une autre destination ou attraction pour l’explorer."
                  : "This place stays selected. Touch another destination or attraction to explore it."
              }
            />
            <AlbaniaDestinationMap activeSlug={place.id} locations={locations} />
          </section>
        </div>

        <section className="place-related-section">
          <div className="page-inset">
            <SectionHeading
              title={
                isFrench
                  ? `Explorer d’autres ${place.kind === "destination" ? "destinations" : "attractions"}`
                  : `Explore Other ${place.kind === "destination" ? "Destinations" : "Attractions"}`
              }
            />
            {place.relatedPlaces.length ? (
              <PlaceCardRail places={place.relatedPlaces} locale={locale} />
            ) : (
              <p className="place-empty-message">
                {isFrench ? "D’autres lieux arrivent bientôt." : "More places are coming soon."}
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function PlaceDetailPage({ place }: { place: PlaceViewModel }) {
  return (
    <SiteLocaleProvider
      locale={place.locale}
      alternatePaths={{
        en: place.locale === "en" ? place.href : place.alternateHref,
        fr: place.locale === "fr" ? place.href : place.alternateHref,
      }}
    >
      <PlaceDetailContent place={place} />
    </SiteLocaleProvider>
  );
}
