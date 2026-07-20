import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  BadgeCheck,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Facebook,
  Instagram,
  Languages,
  Linkedin,
  MapPin,
  Minus,
  Mountain,
  Navigation,
  Phone,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  ThermometerSun,
  Ticket,
  Users,
  Utensils,
  Waves,
  X,
  Youtube,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { LocaleLocationModal } from "../components/LocaleLocationModal";
import { SiteMenu } from "../components/SiteMenu";
import {
  TourItineraryMap,
  type TourItineraryStop,
  type TourRouteGeometry,
} from "../components/TourItineraryMap";
import { SiteLocaleProvider, translate, useLocalize, useSiteLocale } from "../i18n";
import type { SiteLocale } from "../i18n";

export const Route = createFileRoute("/tour")({
  head: () => ({
    meta: [
      { title: "Albanian Riviera Private Tour | WonderAlbania" },
      {
        name: "description",
        content:
          "A private day along Albania’s southern Riviera, with hidden beaches, stone villages, Porto Palermo and a local lunch.",
      },
      { property: "og:title", content: "Albanian Riviera Private Tour | WonderAlbania" },
      {
        property: "og:description",
        content: "Villages, bays and blue water on a private day through southern Albania.",
      },
      { name: "twitter:title", content: "Albanian Riviera Private Tour | WonderAlbania" },
      {
        name: "twitter:description",
        content: "Villages, bays and blue water on a private day through southern Albania.",
      },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "fr_FR" },
      { property: "og:url", content: "https://wonderalbania.com/tour" },
    ],
    links: [
      { rel: "canonical", href: "https://wonderalbania.com/tour" },
      { rel: "alternate", hrefLang: "en", href: "https://wonderalbania.com/tour" },
      { rel: "alternate", hrefLang: "fr", href: "https://wonderalbania.com/fr/tour" },
      { rel: "alternate", hrefLang: "x-default", href: "https://wonderalbania.com/tour" },
    ],
  }),
  component: () => <TourPage locale="en" />,
});

const images = {
  hero: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1800&q=80",
  coast:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
  town: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=85",
  mountains:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85",
  boat: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=85",
  sunset:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85",
};

const galleryImages = [
  { src: images.coast, alt: "Clear Ionian water along a sheltered beach" },
  { src: images.town, alt: "Historic stone town in southern Albania" },
  { src: images.food, alt: "A shared table with fresh local food" },
  { src: images.boat, alt: "A boat crossing calm blue water" },
  { src: images.sunset, alt: "Golden evening light over the coast" },
];

const quickFacts = [
  { icon: Clock3, label: "Duration", value: "8 hours" },
  { icon: Mountain, label: "Difficulty", value: "Easy" },
  { icon: Users, label: "Group size", value: "Up to 8" },
  { icon: Car, label: "Tour type", value: "Private" },
  { icon: Languages, label: "Languages", value: "EN · FR · SQ" },
  { icon: MapPin, label: "Starts in", value: "Sarandë" },
  { icon: Navigation, label: "Ends in", value: "Sarandë" },
  { icon: Accessibility, label: "Accessibility", value: "Ask our team" },
];

const highlights = [
  { icon: Waves, label: "Hidden beaches", text: "Swim in quiet coves with clear Ionian water." },
  { icon: Utensils, label: "Local table", text: "Share a seasonal lunch at a family-run taverna." },
  { icon: Camera, label: "Coastal villages", text: "Wander the stone lanes of Qeparo and Himarë." },
  { icon: Sun, label: "Golden hour", text: "See the Riviera soften into warm evening light." },
  {
    icon: ShieldCheck,
    label: "Porto Palermo",
    text: "Step inside the fortress above its dramatic bay.",
  },
  {
    icon: Mountain,
    label: "Mountain road",
    text: "Follow one of Albania’s most scenic coastal drives.",
  },
];

const itinerary = [
  {
    id: "sarande-pickup",
    sequence: 1,
    time: "08:30",
    place: "Sarandë",
    duration: "30 min",
    text: "Meet your local guide at your hotel and settle into a private, air-conditioned vehicle.",
    tag: "Pickup",
    location: {
      id: "sarande-centre",
      label: "Sarandë city centre",
      coordinates: [20.0065258, 39.8752198],
      osmReference: "relation/1255541",
    },
  },
  {
    id: "porto-palermo-castle",
    sequence: 2,
    time: "09:30",
    place: "Porto Palermo",
    duration: "1 hr 15 min",
    text: "Explore the triangular fortress and hear the stories behind one of Albania’s most dramatic bays.",
    tag: "History",
    location: {
      id: "porto-palermo-castle",
      label: "Porto Palermo Castle",
      coordinates: [19.79071, 40.062179],
      osmReference: "way/86825930",
    },
  },
  {
    id: "himare-waterfront",
    sequence: 3,
    time: "11:15",
    place: "Himarë",
    duration: "2 hr",
    text: "Swim, stroll the seafront and enjoy an unhurried lunch made with produce from the coast.",
    tag: "Swim & lunch",
    location: {
      id: "himare-waterfront",
      label: "Himarë waterfront",
      coordinates: [19.7472977, 40.102163],
      osmReference: "relation/1255539",
    },
  },
  {
    id: "old-qeparo",
    sequence: 4,
    time: "14:15",
    place: "Qeparo village",
    duration: "1 hr 15 min",
    text: "Climb into the old village for slate roofs, mountain air and wide views across the Ionian Sea.",
    tag: "Village walk",
    location: {
      id: "old-qeparo",
      label: "Old Qeparo",
      coordinates: [19.8267781, 40.0678221],
      osmReference: "node/713605143",
    },
  },
  {
    id: "borsh-castle-viewpoint",
    sequence: 5,
    time: "16:30",
    place: "Borsh viewpoint",
    duration: "45 min",
    text: "Pause for coffee and a final panorama before the relaxed drive back to Sarandë.",
    tag: "Viewpoint",
    location: {
      id: "borsh-castle-viewpoint",
      label: "Borsh Castle viewpoint",
      coordinates: [19.8561846, 40.069896],
      osmReference: "way/1124215012",
    },
  },
] satisfies readonly TourItineraryStop[];

const demoRouteGeometry = {
  type: "LineString",
  coordinates: [
    [20.0065258, 39.8752198],
    [19.9905, 39.912],
    [19.956, 39.956],
    [19.914, 40.006],
    [19.8561846, 40.069896],
    [19.8267781, 40.0678221],
    [19.79071, 40.062179],
    [19.766, 40.084],
    [19.7472977, 40.102163],
    [19.766, 40.084],
    [19.79071, 40.062179],
    [19.8267781, 40.0678221],
    [19.8561846, 40.069896],
    [19.914, 40.006],
    [19.956, 39.956],
    [19.9905, 39.912],
    [20.0065258, 39.8752198],
  ],
} satisfies TourRouteGeometry;

const included = [
  "Private return transport",
  "Licensed local guide",
  "Seasonal Albanian lunch",
  "Fortress entrance ticket",
  "Hotel pickup in Sarandë",
  "Bottled water",
];
const excluded = [
  "Personal purchases",
  "Additional drinks",
  "Guide gratuities",
  "Optional beach equipment",
];
const packing = [
  "Comfortable shoes",
  "Swimwear & towel",
  "Passport or ID",
  "Refillable water bottle",
  "Sunscreen",
  "Light jacket",
];

const faqs = [
  [
    "Can children join this tour?",
    "Yes. The relaxed pace works well for families, and child seats can be requested in advance.",
  ],
  [
    "Is October a good month to visit?",
    "October is usually quieter and mild. Sea conditions vary, so swimming is always weather-dependent.",
  ],
  [
    "How much walking is involved?",
    "Around 3 km in total, mostly easy, with some uneven stone lanes in Qeparo and at Porto Palermo.",
  ],
  [
    "Can dietary requirements be accommodated?",
    "Vegetarian and common dietary needs can usually be arranged when shared before the tour.",
  ],
];

const relatedTours = [
  {
    title: "Blue Eye & Gjirokastër",
    meta: "Full day · Culture",
    price: "From €95 per person",
    image: images.town,
    ribbon: "Popular",
  },
  {
    title: "Llogara Sunset Escape",
    meta: "5 hours · Nature",
    price: "From €75 per person",
    image: images.mountains,
    ribbon: "New",
  },
  {
    title: "Ksamil by Private Boat",
    meta: "4 hours · Sea",
    price: "From €110 per person",
    image: images.boat,
    ribbon: "-15%",
  },
];

function Header() {
  const localize = useLocalize();
  return localize(
    <>
      <div className="tour-contact-bar">
        <div className="page-inset site-navigation py-2 text-xs">
          <a href="#support" className="text-white underline underline-offset-2">
            Talk with Us
          </a>
        </div>
      </div>
      <header className="tour-header page-inset site-navigation">
        <div className="tour-header-row">
          <nav className="tour-header-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/tour">Tours</a>
            <span>/</span>
            <b>Albanian Riviera</b>
          </nav>
          <a className="tour-header-logo" href="/" aria-label="WonderAlbania home">
            <img src="/weblogo.png" alt="WonderAlbania" />
          </a>
          <div className="tour-header-tools">
            <LocaleLocationModal />
            <button type="button" className="icon-chip" aria-label="Search">
              <Search size={18} />
            </button>
            <button type="button" className="icon-chip" aria-label="AI">
              <Sparkles size={18} fill="black" />
            </button>
            <SiteMenu />
          </div>
        </div>
      </header>
    </>,
  );
}

function BookingCalendar() {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const [viewMonth, setViewMonth] = useState(() => new Date(Date.UTC(2026, 8, 1)));
  const [selectedDate, setSelectedDate] = useState("2026-09-16");
  const year = viewMonth.getUTCFullYear();
  const month = viewMonth.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const monthLabel = viewMonth.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const changeMonth = (offset: number) => {
    setViewMonth(new Date(Date.UTC(year, month + offset, 1)));
  };

  return localize(
    <div className="booking-calendar" aria-label="Choose a tour date">
      <div className="calendar-header">
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">
          <ChevronLeft size={17} />
        </button>
        <strong>{monthLabel}</strong>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
          <ChevronRight size={17} />
        </button>
      </div>
      <div className="calendar-weekdays" aria-hidden="true">
        {(locale === "fr"
          ? ["D", "L", "M", "M", "J", "V", "S"]
          : ["S", "M", "T", "W", "T", "F", "S"]
        ).map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="calendar-days">
        {Array.from({ length: firstDay }).map((_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const selected = value === selectedDate;
          return (
            <button
              type="button"
              className={selected ? "is-selected" : ""}
              aria-label={`${monthLabel} ${day}`}
              aria-pressed={selected}
              key={value}
              onClick={() => setSelectedDate(value)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>,
  );
}

function BookingCard({ mobile = false }: { mobile?: boolean }) {
  const localize = useLocalize();
  return localize(
    <aside
      className={mobile ? "booking-card booking-card-mobile" : "booking-card"}
      aria-label="Booking preview"
    >
      <div className="booking-eyebrow">Instant confirmation</div>
      <div className="price-line">
        <div>
          <span className="price-note">Sample price from</span>
          <strong>€129</strong>
          <span className="per-person"> / person</span>
        </div>
        <span className="discount-chip">Save 15%</span>
      </div>
      <BookingCalendar />
      <div className="booking-field">
        <span>
          <Users size={18} /> 2 travellers
        </span>
        <div className="stepper-preview" aria-hidden="true">
          <Minus size={14} />
          <b>2</b>
          <span>+</span>
        </div>
      </div>
      <button type="button" className="primary-button">
        Check availability
      </button>
      <p className="booking-small">You won’t be charged. This page is a visual preview.</p>
      <div className="booking-trust">
        <span>
          <ShieldCheck size={17} /> Free cancellation preview
        </span>
        <span>
          <Phone size={17} /> Local support
        </span>
        <a className="booking-policy" href="#support">
          View cancellation policy
        </a>
      </div>
    </aside>,
  );
}

function NativeShareButton() {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const [copied, setCopied] = useState(false);

  const shareTour = async () => {
    const shareData = {
      title: translate(locale, "Riviera secrets: villages, bays & blue water"),
      text: translate(
        locale,
        "A private day along Albania’s wild southern coast with WonderAlbania.",
      ),
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  };

  return localize(
    <button
      type="button"
      className="square-button"
      aria-label={copied ? "Tour link copied" : "Share tour"}
      title={copied ? "Link copied" : "Share tour"}
      onClick={() => void shareTour()}
    >
      <Share2 size={18} />
    </button>,
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
}) {
  const localize = useLocalize();
  return localize(
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>,
  );
}

function HighlightsCarousel() {
  const localize = useLocalize();
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => {
    trackRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  };

  return localize(
    <div className="highlight-shell">
      <div ref={trackRef} className="highlight-track">
        {highlights.map(({ icon: Icon, label, text }) => (
          <article className="highlight-card" key={label}>
            <div className="highlight-icon">
              <Icon size={20} />
            </div>
            <h3>{label}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="highlight-controls" aria-label="Tour highlight controls">
        <button type="button" onClick={() => scroll(-1)} aria-label="Previous highlights">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label="Next highlights">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>,
  );
}

function Gallery() {
  const localize = useLocalize();
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);

  const previous = () =>
    setActive((current) =>
      current === null ? 0 : (current - 1 + galleryImages.length) % galleryImages.length,
    );
  const next = () =>
    setActive((current) => (current === null ? 0 : (current + 1) % galleryImages.length));

  useEffect(() => {
    if (active === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  const onTouchStart = (event: TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    if (Math.abs(distance) > 45) {
      if (distance > 0) previous();
      else next();
    }
    touchStart.current = null;
  };

  return localize(
    <section id="gallery" className="content-section tour-gallery">
      <div className="gallery-heading-row">
        <SectionHeading eyebrow="Tour gallery" title="Five views from the journey" />
        <button
          type="button"
          className="gallery-toggle"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Stack photos" : "Expand gallery"}
        </button>
      </div>
      <div className={`gallery-stack ${expanded ? "is-expanded" : ""}`}>
        {galleryImages.map((image, index) => (
          <button
            type="button"
            className={`gallery-stack-card gallery-stack-card-${index}`}
            key={image.src}
            onClick={() => setActive(index)}
            aria-label={`Open photo ${index + 1}`}
          >
            <img src={image.src} alt={image.alt} />
            {expanded && <span>{String(index + 1).padStart(2, "0")}</span>}
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Tour photo viewer"
        >
          <button
            type="button"
            className="gallery-modal-close"
            onClick={() => setActive(null)}
            aria-label="Close photo viewer"
          >
            <X size={22} />
          </button>
          <button
            type="button"
            className="gallery-modal-arrow gallery-modal-prev"
            onClick={previous}
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="gallery-modal-image" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <img src={galleryImages[active].src} alt={galleryImages[active].alt} />
            <span>
              {active + 1} / {galleryImages.length}
            </span>
          </div>
          <button
            type="button"
            className="gallery-modal-arrow gallery-modal-next"
            onClick={next}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>,
  );
}

function TourContent() {
  const localize = useLocalize();
  const [activeStopId, setActiveStopId] = useState(itinerary[0].id);
  const stopElementsRef = useRef(new Map<string, HTMLElement>());
  const suppressObserverUntilRef = useRef(0);

  const selectTimelineStop = useCallback((stopId: string) => {
    setActiveStopId(stopId);
  }, []);

  const selectMapStop = useCallback((stopId: string) => {
    suppressObserverUntilRef.current = Date.now() + 900;
    setActiveStopId(stopId);
    const stopElement = stopElementsRef.current.get(stopId);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stopElement?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
    stopElement?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 821px)");
    let observer: IntersectionObserver | null = null;

    const observeStops = () => {
      observer?.disconnect();
      observer = null;
      if (!desktopQuery.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (Date.now() < suppressObserverUntilRef.current) return;
          const mostVisible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          const stopId = (mostVisible?.target as HTMLElement | undefined)?.dataset.stopId;
          if (stopId) setActiveStopId(stopId);
        },
        {
          rootMargin: "-24% 0px -54% 0px",
          threshold: [0.1, 0.35, 0.65],
        },
      );

      stopElementsRef.current.forEach((element) => observer?.observe(element));
    };

    observeStops();
    desktopQuery.addEventListener("change", observeStops);
    return () => {
      observer?.disconnect();
      desktopQuery.removeEventListener("change", observeStops);
    };
  }, []);

  return localize(
    <div className="tour-page">
      <Header />
      <main>
        <section className="tour-container hero-section">
          <div className="hero-shell">
            <div className="hero-grid">
              <div className="hero-visual">
                <img src={images.hero} alt="White coastal village beside clear blue water" />
                <div className="hero-ribbons">
                  <div className="hero-badge hero-badge-mobile">Local favourite</div>
                  <a className="photo-count" href="#gallery">
                    View 5 photos
                  </a>
                </div>
              </div>
              <div className="hero-copy">
                <div className="hero-badge hero-badge-desktop">Local favourite</div>
                <div className="hero-copy-content">
                  <div className="hero-info-row">
                    <div className="location-label">
                      <MapPin size={16} /> Albanian Riviera · Southern Albania
                    </div>
                    <span className="rating">
                      <Star size={17} fill="currentColor" /> 4.9
                    </span>
                    <a href="#reviews">128 traveller reviews</a>
                    <span className="hero-duration">
                      <Clock3 size={17} /> 8 hours
                    </span>
                  </div>
                  <h1>Riviera secrets: villages, bays & blue water</h1>
                  <p className="hero-intro">
                    A private day along Albania’s wild southern coast, pairing hidden beaches, stone
                    villages and lunch with a local family.
                  </p>
                  <div className="hero-actions">
                    <a className="primary-button hero-book" href="#booking">
                      Check availability
                    </a>
                    <NativeShareButton />
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-facts-strip">
              <div className="hero-fact">
                <span>Duration</span>
                <strong>8 hours</strong>
              </div>
              <div className="hero-fact">
                <span>Location</span>
                <strong>Southern Albania</strong>
              </div>
              <div className="hero-facts-action">
                <a className="primary-button hero-book" href="#booking">
                  Check availability
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="tour-container content-shell">
          <div className="content-main">
            <nav className="section-nav" aria-label="Tour sections">
              <a href="#overview">Overview</a>
              <a href="#itinerary">Itinerary</a>
              <a href="#included">Details</a>
              <a href="#reviews">Reviews</a>
            </nav>

            <section className="facts-panel" aria-label="Quick tour facts">
              {quickFacts.map(({ icon: Icon, label, value }) => (
                <div className="fact" key={label}>
                  <Icon size={20} />
                  <div>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                </div>
              ))}
            </section>

            <section id="overview" className="content-section overview-section">
              <SectionHeading eyebrow="The experience" title="A slower way to see the Riviera" />
              <details className="experience-details">
                <summary>
                  <span>
                    This isn’t a checklist tour. It’s a locally shaped day of sea views, village
                    tables and quiet coastal stops.
                  </span>
                  <ChevronDown size={19} />
                </summary>
                <p>
                  Your guide knows where the road opens to its best view, which café is worth a
                  detour and when each bay is at its quietest. The pace balances easy exploration
                  with time to swim, eat and take in the coast without rushing between stops.
                </p>
              </details>
            </section>

            <section className="content-section highlights-section">
              <SectionHeading eyebrow="Why you’ll love it" title="Tour highlights" />
              <HighlightsCarousel />
            </section>

            <Gallery />

            <section id="itinerary" className="content-section">
              <SectionHeading
                eyebrow="Your day"
                title="The full itinerary"
                text="Times are a guide. Your host keeps the day flexible for weather, traffic and the best local moments."
              />
              <div className="itinerary-experience">
                <div className="itinerary">
                  {itinerary.map((stop) => {
                    const isActive = stop.id === activeStopId;
                    return (
                      <article
                        ref={(element) => {
                          if (element) stopElementsRef.current.set(stop.id, element);
                          else stopElementsRef.current.delete(stop.id);
                        }}
                        className={`itinerary-stop${isActive ? " is-active" : ""}`}
                        key={stop.id}
                        data-stop-id={stop.id}
                        role="button"
                        tabIndex={0}
                        aria-current={isActive ? "step" : undefined}
                        aria-label={`Show stop ${stop.sequence}, ${stop.place}, on the map`}
                        onClick={() => selectTimelineStop(stop.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            selectTimelineStop(stop.id);
                          }
                        }}
                      >
                        <div className="timeline-marker">
                          <span>{String(stop.sequence).padStart(2, "0")}</span>
                        </div>
                        <div className="itinerary-time">
                          <strong>{stop.time}</strong>
                          <span>{stop.duration}</span>
                        </div>
                        <div className="itinerary-copy">
                          <span className="tag">{stop.tag}</span>
                          <h3>{stop.place}</h3>
                          <p>{stop.text}</p>
                          <span className="coordinate">
                            <MapPin size={14} /> {stop.location?.label ?? "Location pending"}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div id="map" className="itinerary-map-column">
                  <TourItineraryMap
                    stops={itinerary}
                    activeStopId={activeStopId}
                    onStopSelect={selectMapStop}
                    routeGeometry={demoRouteGeometry}
                  />
                  <div className="itinerary-route-context">
                    <div>
                      <span className="eyebrow">The route</span>
                      <strong>Coastline, connected.</strong>
                    </div>
                    <p>
                      An interactive route overview connecting every stop. It is not intended for
                      turn-by-turn navigation.
                    </p>
                    <div className="itinerary-route-stats">
                      <span>
                        <Navigation size={16} />
                        <b>112 km</b> return route
                      </span>
                      <span>
                        <Clock3 size={16} />
                        <b>8 hours</b> door to door
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="included" className="content-section details-section">
              <SectionHeading eyebrow="Good to know" title="Everything, clearly explained" />
              <div className="included-grid">
                <article className="detail-card included-card">
                  <h3>
                    <Check size={20} /> What’s included
                  </h3>
                  <ul>
                    {included.map((item) => (
                      <li key={item}>
                        <Check size={16} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="detail-card">
                  <h3>
                    <Minus size={20} /> Not included
                  </h3>
                  <ul>
                    {excluded.map((item) => (
                      <li key={item}>
                        <Minus size={16} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="detail-card packing-card">
                  <h3>
                    <Ticket size={20} /> What to bring
                  </h3>
                  <div className="packing-list">
                    {packing.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              </div>
            </section>

            <section className="weather-card">
              <div>
                <span className="eyebrow">Best time to go</span>
                <h2>Made for long, blue days.</h2>
                <p>
                  May through October is the classic season, with June and September balancing warm
                  water and quieter roads.
                </p>
              </div>
              <div className="weather-stats">
                <div>
                  <ThermometerSun size={23} />
                  <strong>24–29°C</strong>
                  <span>Typical summer high</span>
                </div>
                <div>
                  <Waves size={23} />
                  <strong>22–26°C</strong>
                  <span>Typical sea temperature</span>
                </div>
                <div>
                  <Sun size={23} />
                  <strong>May–Oct</strong>
                  <span>Recommended window</span>
                </div>
              </div>
            </section>

            <section id="reviews" className="content-section reviews-section">
              <SectionHeading
                eyebrow="Traveller stories"
                title="Trusted by travellers, rated 4.9"
              />
              <div className="review-overview">
                <div className="review-score">
                  <strong>4.9</strong>
                  <div>
                    <div className="stars">★★★★★</div>
                    <span>Based on 128 verified reviews</span>
                  </div>
                </div>
                <div className="rating-bars">
                  {[
                    ["Guide", "4.9", 98],
                    ["Itinerary", "4.8", 94],
                    ["Value", "4.8", 94],
                    ["Transport", "4.9", 98],
                  ].map(([label, score, width]) => (
                    <div className="rating-row" key={label}>
                      <span>{label}</span>
                      <div>
                        <i style={{ width: `${width}%` }} />
                      </div>
                      <b>{score}</b>
                    </div>
                  ))}
                </div>
              </div>
              <div className="review-grid professional-reviews">
                <article className="review-card">
                  <div className="review-top">
                    <div className="avatar">AM</div>
                    <div>
                      <strong>Amelia M.</strong>
                      <span>
                        <BadgeCheck size={14} /> Verified traveller
                      </span>
                    </div>
                    <time>Sep 2026</time>
                  </div>
                  <div className="stars">★★★★★</div>
                  <p>
                    “The day felt completely personal. Our guide knew exactly when to linger, and
                    lunch overlooking the water was the moment we’ll remember.”
                  </p>
                  <span>United Kingdom · Travelled as a couple</span>
                </article>
                <article className="review-card">
                  <div className="review-top">
                    <div className="avatar">JL</div>
                    <div>
                      <strong>Jonas L.</strong>
                      <span>
                        <BadgeCheck size={14} /> Verified traveller
                      </span>
                    </div>
                    <time>Aug 2026</time>
                  </div>
                  <div className="stars">★★★★★</div>
                  <p>
                    “A beautifully paced route with enough time to swim and explore. Porto Palermo
                    and Qeparo were highlights, and the vehicle was spotless.”
                  </p>
                  <span>Germany · Travelled with family</span>
                </article>
              </div>
              <button type="button" className="reviews-button">
                Read all 128 reviews
              </button>
            </section>

            <section className="content-section faq-section">
              <SectionHeading eyebrow="Before you go" title="Frequently asked questions" />
              <div className="faq-list">
                {faqs.map(([question, answer], index) => (
                  <details key={question} open={index === 0}>
                    <summary>
                      <span>{question}</span>
                      <ChevronDown size={20} />
                    </summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
          <div id="booking" className="booking-column">
            <BookingCard />
          </div>
        </div>

        <BookingCard mobile />

        <section id="related" className="related-section tour-container">
          <div className="related-panel">
            <SectionHeading eyebrow="Keep exploring" title="More ways to see Albania" />
            <div className="related-track">
              {relatedTours.map((tour) => (
                <article className="index-tour-card card-zoom" key={tour.title}>
                  <div className="index-tour-image">
                    <img className="card-zoom-img" src={tour.image} alt={tour.title} />
                    <span className="ribbon">{tour.ribbon}</span>
                  </div>
                  <span>{tour.meta}</span>
                  <a href="/tour">{tour.title}</a>
                  <p>{tour.price}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>,
  );
}

function Footer() {
  const localize = useLocalize();
  return localize(
    <footer id="support" className="site-footer">
      <div className="tour-container newsletter">
        <div>
          <span className="eyebrow">A little Albania, monthly</span>
          <h2>Travel stories worth opening.</h2>
        </div>
        <div className="newsletter-form">
          <span>your@email.com</span>
          <button type="button">Join us</button>
        </div>
      </div>
      <div className="tour-container footer-main">
        <div className="footer-brand">
          <img src="/weblogo.png" alt="WonderAlbania" />
          <p>Thoughtful Albania journeys, shaped by people who call it home.</p>
          <a href="mailto:hello@wonderalbania.com">hello@wonderalbania.com</a>
        </div>
        <div className="footer-links">
          <div>
            <b>Explore</b>
            <a href="#related">Tours</a>
            <a href="#map">Destinations</a>
            <a href="#reviews">Stories</a>
          </div>
          <div>
            <b>Company</b>
            <a href="#overview">About us</a>
            <a href="#support">Contact</a>
            <a href="#support">Local experts</a>
          </div>
          <div>
            <b>Support</b>
            <a href="#included">Tour details</a>
            <a href="#support">Booking terms</a>
            <a href="#support">Accessibility</a>
          </div>
        </div>
      </div>
      <div className="tour-container footer-bottom">
        <span>© 2026 WonderAlbania. Design preview.</span>
        <div>
          <a href="#support" aria-label="Instagram">
            <Instagram size={17} />
          </a>
          <a href="#support" aria-label="Facebook">
            <Facebook size={17} />
          </a>
          <a href="#support" aria-label="YouTube">
            <Youtube size={17} />
          </a>
          <a href="#support" aria-label="LinkedIn">
            <Linkedin size={17} />
          </a>
        </div>
      </div>
    </footer>,
  );
}

export function TourPage({ locale }: { locale: SiteLocale }) {
  return (
    <SiteLocaleProvider locale={locale}>
      <TourContent />
    </SiteLocaleProvider>
  );
}
