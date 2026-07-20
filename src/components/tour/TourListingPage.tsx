import {
  ArrowUpRight,
  Bike,
  Camera,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crown,
  Footprints,
  Globe,
  Landmark,
  Leaf,
  Mountain,
  Search,
  Sparkle,
  Sun,
  TentTree,
  Trees,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LocaleLocationModal } from "../LocaleLocationModal";
import { SiteMenu } from "../SiteMenu";
import { SiteLocaleProvider, useLocalize } from "../../i18n";
import type { LucideIcon } from "lucide-react";
import type { SiteLocale } from "../../i18n";
import type { TourListingCard, TourListingData } from "../../lib/tours/types";

const TOUR_HERO_POSTER = "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1800&q=85";

const categoryIconMap: Record<string, LucideIcon> = {
  adventure: Compass,
  nature: Leaf,
  "cultural-heritage": Landmark,
  history: Landmark,
  archaeology: Landmark,
  beaches: Waves,
  mountains: Mountain,
  "food-wine": UtensilsCrossed,
  luxury: Crown,
  photography: Camera,
  wildlife: Trees,
  winter: Sun,
  "road-trips": Compass,
  "city-breaks": Landmark,
  "unesco-sites": Landmark,
  "hidden-gems": Compass,
  "sailing-coast": Waves,
  hiking: Footprints,
  cycling: Bike,
  camping: TentTree,
};

function Header() {
  const localize = useLocalize();
  return localize(
    <>
      <div className="tours-index-topbar">
        <div className="page-inset site-navigation py-2 text-xs">
          <a href="#contact" className="talk-with-us-link underline underline-offset-2">
            Talk with Us
          </a>
        </div>
      </div>
      <header className="page-inset site-navigation py-4">
        <div className="flex items-center justify-between gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm flex-1" aria-label="Primary">
            <a href="/#about" className="hover:text-[#1F2528]">
              About
            </a>
            <a href="/#offers" className="hover:text-[#1F2528]">
              Offers
            </a>
            <a href="/#destinations" className="hover:text-[#1F2528]">
              Destinations
            </a>
          </nav>
          <div className="flex-1 md:flex md:justify-center">
            <a href="/" aria-label="WonderAlbania home">
              <img src="/weblogo.png" alt="WonderAlbania" className="h-6 md:h-7 w-auto" />
            </a>
          </div>
          <div className="flex items-center gap-[10px] flex-1 justify-end">
            <LocaleLocationModal />
            <button type="button" aria-label="Search" className="icon-chip">
              <Search size={18} />
            </button>
            <button type="button" aria-label="AI" className="icon-chip">
              <Sparkle size={19} fill="black" strokeWidth={1.7} />
            </button>
            <SiteMenu />
          </div>
        </div>
      </header>
    </>,
  );
}

function CategoryCard({
  category,
  selected,
  onSelect,
  locale,
}: {
  category: TourListingData["categories"][number];
  selected: boolean;
  onSelect: () => void;
  locale: SiteLocale;
}) {
  const Icon = categoryIconMap[category.key] ?? Globe;
  const countLabel =
    locale === "fr"
      ? `${category.count} ${category.count === 1 ? "circuit" : "circuits"}`
      : `${category.count} ${category.count === 1 ? "tour" : "tours"}`;
  return (
    <button
      type="button"
      className={`tours-category-card${selected ? " is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="tours-category-icon">
        <Icon size={21} strokeWidth={1.6} />
      </span>
      <span className="tours-category-copy">
        <strong>{category.name}</strong>
        <small>{countLabel}</small>
      </span>
      <ArrowUpRight size={18} className="tours-category-arrow" aria-hidden="true" />
    </button>
  );
}

function TourCard({ tour, locale }: { tour: TourListingCard; locale: SiteLocale }) {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  return (
    <article className="tours-listing-card">
      <a href={tour.href} className="tours-listing-media" aria-label={tour.title}>
        {tour.image ? (
          <img src={tour.image} alt={tour.imageAlt} loading="lazy" decoding="async" />
        ) : (
          <span className="tours-listing-image-fallback" aria-hidden="true">
            WonderAlbania
          </span>
        )}
        <span className="tours-listing-meta">
          <span>{tour.duration}</span>
          <span>{tour.typeName}</span>
        </span>
      </a>
      <h3>
        <a href={tour.href}>{tour.title}</a>
      </h3>
      <div className="tours-listing-footer">
        <a href={tour.href} className="tours-listing-button">
          {locale === "fr" ? "Voir le circuit" : "View tour"}
        </a>
        <p>
          <span>{locale === "fr" ? "À partir de" : "From"}</span>{" "}
          <strong>{formatter.format(tour.priceEur)}</strong>
          <small>{locale === "fr" ? "/ personne" : "/ person"}</small>
        </p>
      </div>
    </article>
  );
}

function TourScroller({ tours, locale }: { tours: TourListingCard[]; locale: SiteLocale }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateControls = useCallback(() => {
    const element = scrollerRef.current;
    if (!element) return;
    setCanLeft(element.scrollLeft > 4);
    setCanRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const element = scrollerRef.current;
    if (!element) return;
    updateControls();
    element.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      element.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [updateControls, tours]);

  const move = (direction: number) => {
    scrollerRef.current?.scrollBy({
      left: direction * scrollerRef.current.clientWidth * 0.88,
      behavior: "smooth",
    });
  };

  return (
    <div className="tours-listing-scroller-shell">
      <div ref={scrollerRef} className="tours-listing-scroller scroll-hide">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} locale={locale} />
        ))}
      </div>
      {canLeft && (
        <button
          type="button"
          className="tours-listing-control is-left"
          onClick={() => move(-1)}
          aria-label={locale === "fr" ? "Circuits précédents" : "Previous tours"}
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {canRight && (
        <button
          type="button"
          className="tours-listing-control is-right"
          onClick={() => move(1)}
          aria-label={locale === "fr" ? "Circuits suivants" : "Next tours"}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}

function ToursIndex({ locale, data }: { locale: SiteLocale; data: TourListingData }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const visibleTours = selectedCategory
    ? data.tours.filter((tour) => tour.categoryIds.includes(selectedCategory))
    : data.tours;

  return (
    <div className="tours-index-page min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section className="tours-index-hero" aria-labelledby="tours-index-title">
          <div className="index-hero-media">
            <img
              src={TOUR_HERO_POSTER}
              alt={locale === "fr" ? "Voyager en Albanie" : "Travel through Albania"}
              className="index-hero-poster"
              loading="eager"
              fetchPriority="high"
            />
            <video
              className="index-hero-video is-ready"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              poster={TOUR_HERO_POSTER}
              aria-hidden="true"
              tabIndex={-1}
            >
              <source src="/videos/hero-1080.mp4" type="video/mp4" />
            </video>
            <span className="index-hero-film" aria-hidden="true" />
            <div className="index-hero-copy">
              <a className="index-hero-cta" href="#tour-categories">
                <span className="index-hero-cta-label">
                  {locale === "fr" ? "Explorer nos circuits" : "Explore our tours"}
                </span>
                <span className="index-hero-cta-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
              <h1 id="tours-index-title">
                {locale === "fr" ? "L’Albanie, à votre façon." : "Albania, your way."}
              </h1>
            </div>
          </div>
          <div className="index-hero-features" aria-label="WonderAlbania tours">
            {[
              [
                "01",
                locale === "fr" ? "Experts locaux" : "Local experts",
                locale === "fr" ? "Une Albanie vécue de l’intérieur" : "Albania from the inside",
              ],
              [
                "02",
                locale === "fr" ? "Petits groupes" : "Small groups",
                locale === "fr" ? "Des voyages plus personnels" : "More personal journeys",
              ],
              [
                "03",
                locale === "fr" ? "Rythme flexible" : "Flexible pace",
                locale === "fr" ? "Du temps pour vraiment découvrir" : "Time to truly discover",
              ],
            ].map(([number, title, detail]) => (
              <div className="index-hero-feature" key={number}>
                <span className="index-hero-feature-number">{number}</span>
                <div>
                  <h2>{title}</h2>
                  <p>{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="tour-categories" className="page-inset tours-category-section">
          <div className="tours-category-panel">
            <div className="tours-index-heading">
              <span>{locale === "fr" ? "Choisissez votre voyage" : "Choose your journey"}</span>
              <h2>{locale === "fr" ? "Explorer par catégorie" : "Explore by category"}</h2>
              <p>
                {locale === "fr"
                  ? "Culture, côte, montagne ou aventure — trouvez l’Albanie qui vous ressemble."
                  : "Culture, coast, mountains or adventure — find the Albania that feels like yours."}
              </p>
            </div>

            {data.categories.length > 0 ? (
              <div className="tours-category-track scroll-hide">
                <button
                  type="button"
                  className={`tours-category-card${selectedCategory === null ? " is-selected" : ""}`}
                  onClick={() => setSelectedCategory(null)}
                  aria-pressed={selectedCategory === null}
                >
                  <span className="tours-category-icon">
                    <Compass size={21} strokeWidth={1.6} />
                  </span>
                  <span className="tours-category-copy">
                    <strong>{locale === "fr" ? "Tous les circuits" : "All tours"}</strong>
                    <small>
                      {data.tours.length} {locale === "fr" ? "circuits" : "tours"}
                    </small>
                  </span>
                  <ArrowUpRight size={18} className="tours-category-arrow" aria-hidden="true" />
                </button>
                {data.categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    locale={locale}
                    selected={selectedCategory === category.id}
                    onSelect={() => setSelectedCategory(category.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="tours-category-empty">
                {locale === "fr"
                  ? "Les catégories apparaîtront dès la publication du premier circuit."
                  : "Categories will appear as soon as the first tour is published."}
              </p>
            )}
          </div>
        </section>

        <section className="tours-listing-section" aria-labelledby="all-tours-title">
          <div className="page-inset">
            <div className="tours-listing-heading-row">
              <div className="tours-index-heading is-left">
                <span>{locale === "fr" ? "Circuits WonderAlbania" : "WonderAlbania tours"}</span>
                <h2 id="all-tours-title">
                  {selectedCategory
                    ? data.categories.find((category) => category.id === selectedCategory)?.name
                    : locale === "fr"
                      ? "Tous nos circuits"
                      : "All our tours"}
                </h2>
              </div>
              <p>
                {visibleTours.length} {locale === "fr" ? "circuits disponibles" : "tours available"}
              </p>
            </div>

            {visibleTours.length > 0 ? (
              <TourScroller tours={visibleTours} locale={locale} />
            ) : (
              <div className="tours-listing-empty">
                <Compass size={30} strokeWidth={1.4} />
                <h3>
                  {locale === "fr" ? "De nouveaux circuits arrivent" : "New tours are on the way"}
                </h3>
                <p>
                  {locale === "fr"
                    ? "Nos prochains voyages seront affichés ici dès leur publication."
                    : "Our next journeys will appear here as soon as they are published."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer id="contact" className="tours-index-footer">
        <div className="page-inset tours-index-footer-inner">
          <img src="/weblogo.png" alt="WonderAlbania" />
          <p>
            {locale === "fr"
              ? "Des voyages en Albanie imaginés par ceux qui y vivent."
              : "Thoughtful Albania journeys, shaped by people who call it home."}
          </p>
          <a href="mailto:hello@wonderalbania.com">hello@wonderalbania.com</a>
        </div>
      </footer>
    </div>
  );
}

export function TourListingPage({ locale, data }: { locale: SiteLocale; data: TourListingData }) {
  return (
    <SiteLocaleProvider locale={locale} alternatePaths={{ en: "/tour", fr: "/fr/tour" }}>
      <ToursIndex locale={locale} data={data} />
    </SiteLocaleProvider>
  );
}
