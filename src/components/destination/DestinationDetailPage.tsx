import {
  CalendarDays,
  Camera,
  Clock3,
  Landmark,
  MapPin,
  Mountain,
  Navigation,
  Sun,
  Utensils,
} from "lucide-react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { SiteLocaleProvider } from "../../i18n";
import type { TourListingCard } from "../../lib/tours/types";
import { TourRail } from "../tour/TourListingPage";
import {
  DetailFacts,
  DetailHero,
  DetailHighlights,
  DetailSectionNav,
  SectionHeading,
} from "../tour/TourDetailPrimitives";
import { AlbaniaDestinationMap } from "./AlbaniaDestinationMap";
import "../../destination-detail.css";

const images = {
  hero: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1800&q=88",
  castle: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=1200&q=84",
  oldTown: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=84",
  river: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=84",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=84",
  hills: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=84",
};

const packages: TourListingCard[] = [
  {
    id: "berat-old-town",
    title: "Berat Old Town, Castle & family lunch",
    href: "/tour",
    image: images.castle,
    imageAlt: "Stone lanes and historic buildings in Berat",
    duration: "Full day",
    typeId: "small-group",
    typeName: "Small group",
    difficultyId: "easy",
    priceEur: 79,
    maxGroupSize: 10,
    categoryIds: ["culture", "food"],
    defaultAvailable: true,
    dateOverrides: [],
    featured: true,
  },
  {
    id: "berat-wine",
    title: "Berat flavours and vineyard escape",
    href: "/tour",
    image: images.food,
    imageAlt: "A table filled with local Albanian food",
    duration: "2 days",
    typeId: "private",
    typeName: "Private",
    difficultyId: "easy",
    priceEur: 245,
    maxGroupSize: 6,
    categoryIds: ["food", "wine"],
    defaultAvailable: true,
    dateOverrides: [],
    featured: true,
  },
  {
    id: "berat-osum",
    title: "Berat, Osum Canyon & Tomorr foothills",
    href: "/tour",
    image: images.hills,
    imageAlt: "Mountain landscape near Berat",
    duration: "3 days",
    typeId: "small-group",
    typeName: "Small group",
    difficultyId: "moderate",
    priceEur: 389,
    maxGroupSize: 8,
    categoryIds: ["nature", "walking"],
    defaultAvailable: true,
    dateOverrides: [],
    featured: true,
  },
];

const highlights = [
  {
    icon: Landmark,
    label: "Berat Castle",
    text: "Walk through a living citadel where stone lanes, churches and family homes share the hilltop.",
  },
  {
    icon: Camera,
    label: "Mangalem quarter",
    text: "See the Ottoman houses that gave Berat its name: the city of a thousand windows.",
  },
  {
    icon: Utensils,
    label: "Local tables",
    text: "Taste slow-cooked dishes, mountain herbs and wines made in the surrounding countryside.",
  },
  {
    icon: Mountain,
    label: "Tomorr landscapes",
    text: "Pair the old town with canyon walks, mountain viewpoints and quiet villages beyond the valley.",
  },
];

function DestinationContent() {
  return (
    <div className="tour-page destination-page">
      <SiteHeader />
      <main>
        <DetailHero
          image={images.hero}
          imageAlt="Historic hillside houses overlooking Berat"
          info={
            <>
              <div className="location-label">
                <MapPin size={16} /> Berat, Central Albania
              </div>
              <span className="hero-duration">
                <Clock3 size={17} /> Ideal for 2–3 days
              </span>
            </>
          }
          title="Berat"
          intro="A city of a thousand windows, lived in one unhurried moment at a time."
          primaryAction={{ href: "#tours", label: "Explore Berat tours" }}
          facts={[
            { label: "Best time", value: "April–October" },
            { label: "From Tirana", value: "2 hours" },
          ]}
        />

        <div className="tour-container destination-content">
          <DetailSectionNav
            label="Destination sections"
            links={[
              { href: "#story", label: "Discover Berat" },
              { href: "#map", label: "Explore the map" },
              { href: "#tours", label: "Berat tours" },
            ]}
          />

          <DetailFacts
            label="Berat at a glance"
            facts={[
              { icon: MapPin, label: "Region", value: "Central Albania" },
              { icon: CalendarDays, label: "Best time", value: "April–October" },
              { icon: Clock3, label: "Ideal stay", value: "2–3 days" },
              { icon: Navigation, label: "From Tirana", value: "2 hours" },
            ]}
          />

          <section id="story" className="destination-stack-section">
            <div className="destination-stack-intro">
              <SectionHeading
                title="Three ways to understand Berat"
                text="Scroll through the city's story, the places that shape it, and the best way to plan your stay."
              />
            </div>

            <div className="destination-story-stack">
              <article className="destination-story-card destination-story-card-one">
                <div className="destination-story-media">
                  <img
                    src={images.castle}
                    alt="Historic stone architecture inside Berat Castle"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="destination-story-copy">
                  <SectionHeading
                    title="A living city inside ancient walls"
                    text="Berat's history is not kept behind glass. Families still live within the castle, gardens grow behind stone walls and neighbours pause beneath centuries-old churches. Below, Mangalem and Gorica face one another across the Osum River in layers of white Ottoman houses."
                  />
                  <p>
                    Come for the architecture, but leave enough time for the rhythm of daily life:
                    morning coffee beside the river, a slow castle walk and the old town turning
                    gold before sunset.
                  </p>
                </div>
              </article>

              <article className="destination-story-card destination-story-card-two">
                <div className="destination-story-copy">
                  <SectionHeading
                    title="The places and flavours that make Berat"
                    text="The essential experiences are close enough to connect in one thoughtful day, yet distinctive enough to reward a longer stay."
                  />
                  <DetailHighlights highlights={highlights} />
                </div>
                <div className="destination-story-media">
                  <img
                    src={images.oldTown}
                    alt="Old town streets and traditional architecture"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>

              <article className="destination-story-card destination-story-card-three">
                <div className="destination-story-media">
                  <img
                    src={images.river}
                    alt="River and mountain landscape near Berat"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="destination-story-copy">
                  <SectionHeading
                    title="Plan for warm days and slow evenings"
                    text="Spring and autumn bring comfortable walking weather and quieter lanes. Summer is lively and sun-filled, so plan the castle early and keep afternoons for long lunches, vineyards or the river."
                  />
                  <div className="weather-stats destination-weather-stats">
                    <div>
                      <Sun size={23} />
                      <strong>28°C</strong>
                      <span>Average summer high</span>
                    </div>
                    <div>
                      <CalendarDays size={23} />
                      <strong>Apr–May</strong>
                      <span>Best for spring walks</span>
                    </div>
                    <div>
                      <Utensils size={23} />
                      <strong>Sep–Oct</strong>
                      <span>Harvest and local food</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section id="map" className="content-section destination-map-section">
            <SectionHeading
              title="Berat on the map of Albania"
              text="Berat stays highlighted on this page. Touch another location to preview it, then choose whether to open its destination page."
            />
            <AlbaniaDestinationMap activeSlug="berat" />
          </section>

          <section id="tours" className="content-section destination-tours-section">
            <SectionHeading
              title="Ways to experience Berat"
              text="The same tour cards and controls used across our tour catalogue, showing sample packages for this destination."
            />
            <div className="destination-tour-rail">
              <TourRail tours={packages} locale="en" />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function DestinationDetailPage() {
  return (
    <SiteLocaleProvider locale="en" alternatePaths={{ en: "/destination/berat", fr: "/fr/" }}>
      <DestinationContent />
    </SiteLocaleProvider>
  );
}
