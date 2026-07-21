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
  Waves,
  X,
  Youtube,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LocaleLocationModal } from "../LocaleLocationModal";
import { SiteMenu } from "../SiteMenu";
import { SiteFooter as SharedSiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { TourItineraryMap } from "../TourItineraryMap";
import { SiteLocaleProvider, useLocalize } from "../../i18n";
import type {
  TourDateOverride,
  TourListKind,
  TourLocale,
  TourViewModel,
  TravelType,
} from "../../lib/tours/types";

const ICONS: Record<string, LucideIcon> = {
  accessibility: Accessibility,
  camera: Camera,
  car: Car,
  clock: Clock3,
  food: Utensils,
  languages: Languages,
  map: MapPin,
  mountain: Mountain,
  navigation: Navigation,
  shield: ShieldCheck,
  sparkles: Sparkles,
  sun: Sun,
  temperature: ThermometerSun,
  ticket: Ticket,
  users: Users,
  waves: Waves,
};

const COPY = {
  en: {
    home: "Home",
    tours: "Tours",
    talk: "Talk with Us",
    photos: (count: number) => `View ${count} photos`,
    reviews: (count: number) => `${count} traveller ${count === 1 ? "review" : "reviews"}`,
    duration: "Duration",
    location: "Location",
    availability: "Check availability",
    overview: "Overview",
    itinerary: "Itinerary",
    details: "Details",
    reviewsNav: "Reviews",
    difficulty: "Difficulty",
    groupSize: "Group size",
    tourType: "Tour type",
    languages: "Languages",
    startsIn: "Starts in",
    endsIn: "Ends in",
    accessibility: "Accessibility",
    experience: "The experience",
    highlightsEyebrow: "Why you’ll love it",
    highlights: "Tour highlights",
    gallery: "Tour gallery",
    galleryTitle: "Views from the journey",
    fullItinerary: "The full itinerary",
    yourDay: "Your day",
    itineraryHelp:
      "Times are a guide. Your host keeps the day flexible for weather, traffic and the best local moments.",
    route: "The route",
    returnRoute: "return route",
    doorToDoor: "door to door",
    goodToKnow: "Good to know",
    clearlyExplained: "Everything, clearly explained",
    included: "What’s included",
    excluded: "Not included",
    bring: "What to bring",
    bestTime: "Best time to go",
    stories: "Traveller stories",
    trusted: (rating: string) => `Trusted by travellers, rated ${rating}`,
    basedOn: (count: number) => `Based on ${count} verified ${count === 1 ? "review" : "reviews"}`,
    verified: "Verified traveller",
    before: "Before you go",
    faq: "Frequently asked questions",
    more: "More ways to see Albania",
    exploring: "Keep exploring",
    from: "From",
    perPerson: "/ person",
    chooseDate: "Choose a tour date",
    comingSoon: "Booking coming soon",
    noCharge: "Date selection is for information only. No booking will be created.",
    cancellation: "Cancellation information",
    localSupport: "Local support",
    unavailable: "Unavailable",
    selectedPrice: "Selected date",
    share: "Share tour",
    copied: "Tour link copied",
    close: "Close",
    monthly: "A little Albania, monthly",
    storiesWorth: "Travel stories worth opening.",
    join: "Join us",
    thoughtful: "Thoughtful Albania journeys, shaped by people who call it home.",
    copyright: "© 2026 WonderAlbania.",
  },
  fr: {
    home: "Accueil",
    tours: "Circuits",
    talk: "Parlez-nous",
    photos: (count: number) => `Voir ${count} photos`,
    reviews: (count: number) => `${count} ${count === 1 ? "avis voyageur" : "avis voyageurs"}`,
    duration: "Durée",
    location: "Lieu",
    availability: "Voir les disponibilités",
    overview: "Aperçu",
    itinerary: "Itinéraire",
    details: "Détails",
    reviewsNav: "Avis",
    difficulty: "Difficulté",
    groupSize: "Taille du groupe",
    tourType: "Type de circuit",
    languages: "Langues",
    startsIn: "Départ",
    endsIn: "Arrivée",
    accessibility: "Accessibilité",
    experience: "L’expérience",
    highlightsEyebrow: "Pourquoi vous allez l’aimer",
    highlights: "Points forts",
    gallery: "Galerie du circuit",
    galleryTitle: "Vues du voyage",
    fullItinerary: "L’itinéraire complet",
    yourDay: "Votre journée",
    itineraryHelp:
      "Les horaires sont indicatifs. Votre hôte adapte la journée à la météo, à la circulation et aux meilleurs moments locaux.",
    route: "Le parcours",
    returnRoute: "aller-retour",
    doorToDoor: "porte à porte",
    goodToKnow: "Bon à savoir",
    clearlyExplained: "Tout, clairement expliqué",
    included: "Ce qui est inclus",
    excluded: "Non inclus",
    bring: "À emporter",
    bestTime: "Meilleure saison",
    stories: "Récits de voyageurs",
    trusted: (rating: string) => `Plébiscité par les voyageurs, note ${rating}`,
    basedOn: (count: number) =>
      `Basé sur ${count} ${count === 1 ? "avis vérifié" : "avis vérifiés"}`,
    verified: "Voyageur vérifié",
    before: "Avant de partir",
    faq: "Questions fréquentes",
    more: "D’autres façons de découvrir l’Albanie",
    exploring: "Continuez à explorer",
    from: "À partir de",
    perPerson: "/ personne",
    chooseDate: "Choisissez une date",
    comingSoon: "Réservation bientôt disponible",
    noCharge: "La sélection de date est informative. Aucune réservation ne sera créée.",
    cancellation: "Informations d’annulation",
    localSupport: "Assistance locale",
    unavailable: "Indisponible",
    selectedPrice: "Date sélectionnée",
    share: "Partager le circuit",
    copied: "Lien du circuit copié",
    close: "Fermer",
    monthly: "Un peu d’Albanie, chaque mois",
    storiesWorth: "Des histoires de voyage qui méritent d’être ouvertes.",
    join: "S’inscrire",
    thoughtful: "Des voyages en Albanie façonnés par celles et ceux qui y vivent.",
    copyright: "© 2026 WonderAlbania.",
  },
} as const;

function formatPrice(value: number, locale: TourLocale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

function durationLabel(value: number, unit: "hours" | "days", locale: TourLocale) {
  const formatted = Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, "");
  if (locale === "fr") {
    if (unit === "days") return `${formatted} ${value === 1 ? "jour" : "jours"}`;
    return `${formatted} ${value === 1 ? "heure" : "heures"}`;
  }
  if (unit === "days") return `${formatted} ${value === 1 ? "day" : "days"}`;
  return `${formatted} ${value === 1 ? "hour" : "hours"}`;
}

function formatDate(value: string, locale: TourLocale) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function travelTypeLabel(type: TravelType, locale: TourLocale) {
  const labels: Record<TourLocale, Record<TravelType, string>> = {
    en: {
      solo: "Travelled solo",
      couple: "Travelled as a couple",
      family: "Travelled with family",
      friends: "Travelled with friends",
      group: "Group travel",
      business: "Business travel",
      other: "Traveller",
    },
    fr: {
      solo: "Voyage en solo",
      couple: "Voyage en couple",
      family: "Voyage en famille",
      friends: "Voyage entre amis",
      group: "Voyage en groupe",
      business: "Voyage d’affaires",
      other: "Voyageur",
    },
  };
  return labels[locale][type];
}

function LegacyHeader({ tour }: { tour: TourViewModel }) {
  const localize = useLocalize();
  const copy = COPY[tour.locale];
  return localize(
    <>
      <div className="tour-contact-bar">
        <div className="page-inset site-navigation py-2 text-xs">
          <a href="#support" className="text-white underline underline-offset-2">
            {copy.talk}
          </a>
        </div>
      </div>
      <header className="tour-header page-inset site-navigation">
        <div className="tour-header-row">
          <nav className="tour-header-breadcrumb" aria-label="Breadcrumb">
            <a href={tour.locale === "fr" ? "/fr/" : "/"}>{copy.home}</a>
            <span>/</span>
            <a href={tour.locale === "fr" ? "/fr/tour" : "/tour"}>{copy.tours}</a>
            <span>/</span>
            <b>{tour.title}</b>
          </nav>
          <a
            className="tour-header-logo"
            href={tour.locale === "fr" ? "/fr/" : "/"}
            aria-label="WonderAlbania home"
          >
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

function BookingCalendar({
  locale,
  basePrice,
  defaultAvailable,
  overrides,
  onSelection,
}: {
  locale: TourLocale;
  basePrice: number;
  defaultAvailable: boolean;
  overrides: TourDateOverride[];
  onSelection: (date: string, price: number | null) => void;
}) {
  const today = new Date();
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [viewMonth, setViewMonth] = useState(
    () => new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1)),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const year = viewMonth.getUTCFullYear();
  const month = viewMonth.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const monthLabel = viewMonth.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const overrideByDate = useMemo(
    () => new Map(overrides.map((item) => [item.date, item])),
    [overrides],
  );

  return (
    <div className="booking-calendar" aria-label={COPY[locale].chooseDate}>
      <div className="calendar-header">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(Date.UTC(year, month - 1, 1)))}
          aria-label="Previous month"
        >
          <ChevronLeft size={17} />
        </button>
        <strong>{monthLabel}</strong>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(Date.UTC(year, month + 1, 1)))}
          aria-label="Next month"
        >
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
          const override = overrideByDate.get(value);
          const available = value >= todayValue && (override?.isAvailable ?? defaultAvailable);
          const price = available ? (override?.priceEur ?? basePrice) : null;
          const selected = value === selectedDate;
          return (
            <button
              type="button"
              className={`${selected ? "is-selected" : ""}${!available ? " is-unavailable" : ""}${override?.priceEur != null ? " has-price-override" : ""}`}
              aria-label={`${monthLabel} ${day}, ${available ? formatPrice(price!, locale) : COPY[locale].unavailable}`}
              aria-pressed={selected}
              disabled={!available}
              key={value}
              onClick={() => {
                setSelectedDate(value);
                onSelection(value, price);
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingCard({ tour, mobile = false }: { tour: TourViewModel; mobile?: boolean }) {
  const copy = COPY[tour.locale];
  const [selection, setSelection] = useState<{ date: string; price: number | null } | null>(null);
  const shownPrice = selection?.price ?? tour.basePriceEur;
  return (
    <aside
      className={mobile ? "booking-card booking-card-mobile" : "booking-card"}
      aria-label={copy.availability}
    >
      <div className="booking-eyebrow">{copy.availability}</div>
      <div className="price-line">
        <div>
          <span className="price-note">{copy.from}</span>
          <strong>{formatPrice(shownPrice, tour.locale)}</strong>
          <span className="per-person"> {copy.perPerson}</span>
        </div>
        {tour.discountPercent && <span className="discount-chip">-{tour.discountPercent}%</span>}
      </div>
      <BookingCalendar
        locale={tour.locale}
        basePrice={tour.basePriceEur}
        defaultAvailable={tour.defaultAvailable}
        overrides={tour.dateOverrides}
        onSelection={(date, price) => setSelection({ date, price })}
      />
      {selection && (
        <div className="booking-field">
          <span>
            <Clock3 size={18} /> {copy.selectedPrice}
          </span>
          <strong>{formatDate(selection.date, tour.locale)}</strong>
        </div>
      )}
      <button type="button" className="primary-button" disabled>
        {copy.comingSoon}
      </button>
      <p className="booking-small">{copy.noCharge}</p>
      <div className="booking-trust">
        {tour.cancellationSummary && (
          <span>
            <ShieldCheck size={17} /> {tour.cancellationSummary}
          </span>
        )}
        <span>
          <Phone size={17} /> {copy.localSupport}
        </span>
      </div>
    </aside>
  );
}

function ShareButton({ tour }: { tour: TourViewModel }) {
  const copy = COPY[tour.locale];
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="square-button"
      aria-label={copied ? copy.copied : copy.share}
      title={copied ? copy.copied : copy.share}
      onClick={async () => {
        const share = { title: tour.title, text: tour.heroIntro, url: window.location.href };
        try {
          if (navigator.share) await navigator.share(share);
          else {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          }
        } catch {
          // A cancelled native share needs no UI error.
        }
      }}
    >
      <Share2 size={18} />
    </button>
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
  return (
    <div className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function Gallery({ tour }: { tour: TourViewModel }) {
  const copy = COPY[tour.locale];
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => {
    if (active === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current === null ? 0 : (current - 1 + tour.gallery.length) % tour.gallery.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActive((current) => (current === null ? 0 : (current + 1) % tour.gallery.length));
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, tour.gallery.length]);

  if (tour.gallery.length === 0) return null;
  return (
    <section id="gallery" className="content-section tour-gallery">
      <div className="gallery-heading-row">
        <SectionHeading eyebrow={copy.gallery} title={copy.galleryTitle} />
      </div>
      <div className="gallery-stack is-expanded">
        {tour.gallery.map((image, index) => (
          <button
            type="button"
            className={`gallery-stack-card gallery-stack-card-${index}`}
            key={`${image.src}-${index}`}
            onClick={() => setActive(index)}
            aria-label={`${copy.gallery} ${index + 1}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={index > 1 ? "lazy" : "eager"}
              decoding="async"
            />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={copy.gallery}>
          <button
            type="button"
            className="gallery-modal-close"
            onClick={() => setActive(null)}
            aria-label={copy.close}
          >
            <X size={22} />
          </button>
          <div className="gallery-modal-image">
            <img src={tour.gallery[active].src} alt={tour.gallery[active].alt} decoding="async" />
            <span>
              {active + 1} / {tour.gallery.length}
            </span>
          </div>
          <button
            type="button"
            className="gallery-modal-prev"
            onClick={() => setActive((active - 1 + tour.gallery.length) % tour.gallery.length)}
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            className="gallery-modal-next"
            onClick={() => setActive((active + 1) % tour.gallery.length)}
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
}

function DetailCard({ kind, tour }: { kind: TourListKind; tour: TourViewModel }) {
  const copy = COPY[tour.locale];
  const items = tour.listItems.filter((item) => item.kind === kind);
  if (items.length === 0) return null;
  const config = {
    included: { title: copy.included, icon: Check },
    excluded: { title: copy.excluded, icon: Minus },
    bring: { title: copy.bring, icon: Ticket },
  }[kind];
  const Icon = config.icon;
  if (kind === "bring") {
    return (
      <article className="detail-card packing-card">
        <h3>
          <Icon size={20} /> {config.title}
        </h3>
        <div className="packing-list">
          {items.map((item, index) => (
            <span key={`${item.text}-${index}`}>{item.text}</span>
          ))}
        </div>
      </article>
    );
  }
  return (
    <article className={`detail-card ${kind === "included" ? "included-card" : ""}`}>
      <h3>
        <Icon size={20} /> {config.title}
      </h3>
      <ul>
        {items.map((item, index) => (
          <li key={`${item.text}-${index}`}>
            <Icon size={16} /> {item.text}
          </li>
        ))}
      </ul>
    </article>
  );
}

function LegacyFooter({ locale }: { locale: TourLocale }) {
  const copy = COPY[locale];
  return (
    <footer id="support" className="site-footer">
      <div className="tour-container newsletter">
        <div>
          <span className="eyebrow">{copy.monthly}</span>
          <h2>{copy.storiesWorth}</h2>
        </div>
        <div className="newsletter-form">
          <span>your@email.com</span>
          <button type="button">{copy.join}</button>
        </div>
      </div>
      <div className="tour-container footer-main">
        <div className="footer-brand">
          <img src="/weblogo.png" alt="WonderAlbania" />
          <p>{copy.thoughtful}</p>
          <a href="mailto:hello@wonderalbania.com">hello@wonderalbania.com</a>
        </div>
      </div>
      <div className="tour-container footer-bottom">
        <span>{copy.copyright}</span>
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
    </footer>
  );
}

function TourContent({ tour }: { tour: TourViewModel }) {
  const copy = COPY[tour.locale];
  const [activeStopId, setActiveStopId] = useState(tour.itinerary[0]?.id ?? "");
  const stopElements = useRef(new Map<string, HTMLElement>());
  const rating = tour.ratingAverage?.toFixed(1) ?? "";
  const countryNames = useMemo(
    () =>
      new Intl.DisplayNames([tour.locale === "fr" ? "fr" : "en"], {
        type: "region",
      }),
    [tour.locale],
  );
  const facts = [
    {
      icon: Clock3,
      label: copy.duration,
      value: durationLabel(tour.durationValue, tour.durationUnit, tour.locale),
    },
    { icon: Mountain, label: copy.difficulty, value: tour.difficultyName },
    { icon: Users, label: copy.groupSize, value: `${tour.maxGroupSize}` },
    { icon: Car, label: copy.tourType, value: tour.typeName },
    { icon: Languages, label: copy.languages, value: tour.languageCodes.join(" · ") },
    { icon: MapPin, label: copy.startsIn, value: tour.startPlace },
    { icon: Navigation, label: copy.endsIn, value: tour.endPlace },
    { icon: Accessibility, label: copy.accessibility, value: tour.accessibility },
  ].filter((fact) => fact.value);

  return (
    <div className="tour-page">
      <SiteHeader />
      <main>
        <section className="tour-container hero-section">
          <div className="hero-shell">
            <div className="hero-grid">
              <div className="hero-visual">
                <img
                  src={tour.heroImage}
                  alt={tour.heroAlt}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="hero-ribbons">
                  {tour.heroBadge && (
                    <div className="hero-badge hero-badge-mobile">{tour.heroBadge}</div>
                  )}
                  {tour.gallery.length > 0 && (
                    <a className="photo-count" href="#gallery">
                      {copy.photos(tour.gallery.length)}
                    </a>
                  )}
                </div>
              </div>
              <div className="hero-copy">
                {tour.heroBadge && (
                  <div className="hero-badge hero-badge-desktop">{tour.heroBadge}</div>
                )}
                <div className="hero-copy-content">
                  <div className="hero-info-row">
                    <div className="location-label">
                      <MapPin size={16} /> {tour.locationLabel || tour.region}
                    </div>
                    {tour.ratingCount > 0 && (
                      <>
                        <span className="rating">
                          <Star size={17} fill="currentColor" /> {rating}
                        </span>
                        <a href="#reviews">{copy.reviews(tour.ratingCount)}</a>
                      </>
                    )}
                    <span className="hero-duration">
                      <Clock3 size={17} />{" "}
                      {durationLabel(tour.durationValue, tour.durationUnit, tour.locale)}
                    </span>
                  </div>
                  <h1>{tour.title}</h1>
                  <p className="hero-intro">{tour.heroIntro}</p>
                  <div className="hero-actions">
                    <a className="primary-button hero-book" href="#booking">
                      {copy.availability}
                    </a>
                    <ShareButton tour={tour} />
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-facts-strip">
              <div className="hero-fact">
                <span>{copy.duration}</span>
                <strong>{durationLabel(tour.durationValue, tour.durationUnit, tour.locale)}</strong>
              </div>
              <div className="hero-fact">
                <span>{copy.location}</span>
                <strong>{tour.region}</strong>
              </div>
              <div className="hero-facts-action">
                <a className="primary-button hero-book" href="#booking">
                  {copy.availability}
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="tour-container content-shell">
          <div className="content-main">
            <nav className="section-nav" aria-label="Tour sections">
              <a href="#overview">{copy.overview}</a>
              <a href="#itinerary">{copy.itinerary}</a>
              <a href="#included">{copy.details}</a>
              {tour.ratingCount > 0 && <a href="#reviews">{copy.reviewsNav}</a>}
            </nav>

            <section className="facts-panel" aria-label="Quick tour facts">
              {facts.map(({ icon: Icon, label, value }) => (
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
              <SectionHeading eyebrow={copy.experience} title={tour.overviewTitle} />
              <details className="experience-details" open>
                <summary>
                  <span>{tour.overviewSummary}</span>
                  <ChevronDown size={19} />
                </summary>
                <p>{tour.overviewBody}</p>
              </details>
            </section>

            {tour.highlights.length > 0 && (
              <section className="content-section highlights-section">
                <SectionHeading eyebrow={copy.highlightsEyebrow} title={copy.highlights} />
                <div className="highlight-shell">
                  <div className="highlight-track">
                    {tour.highlights.map((highlight, index) => {
                      const Icon = ICONS[highlight.iconKey] ?? Sparkles;
                      return (
                        <article className="highlight-card" key={`${highlight.label}-${index}`}>
                          <div className="highlight-icon">
                            <Icon size={20} />
                          </div>
                          <h3>{highlight.label}</h3>
                          <p>{highlight.text}</p>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            <Gallery tour={tour} />

            {tour.itinerary.length > 0 && (
              <section id="itinerary" className="content-section">
                <SectionHeading
                  eyebrow={copy.yourDay}
                  title={copy.fullItinerary}
                  text={copy.itineraryHelp}
                />
                <div className="itinerary-experience">
                  <div className="itinerary">
                    {tour.itinerary.map((stop) => (
                      <article
                        ref={(element) => {
                          if (element) stopElements.current.set(stop.id, element);
                          else stopElements.current.delete(stop.id);
                        }}
                        className={`itinerary-stop${stop.id === activeStopId ? " is-active" : ""}`}
                        key={stop.id}
                        data-stop-id={stop.id}
                        role="button"
                        tabIndex={0}
                        aria-current={stop.id === activeStopId ? "step" : undefined}
                        onClick={() => setActiveStopId(stop.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setActiveStopId(stop.id);
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
                            <MapPin size={14} /> {stop.location?.label ?? stop.place}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div id="map" className="itinerary-map-column">
                    <TourItineraryMap
                      stops={tour.itinerary}
                      activeStopId={activeStopId}
                      onStopSelect={(id) => {
                        setActiveStopId(id);
                        stopElements.current.get(id)?.scrollIntoView({
                          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                            ? "auto"
                            : "smooth",
                          block: "center",
                        });
                      }}
                    />
                    <div className="itinerary-route-context">
                      <div>
                        <span className="eyebrow">{copy.route}</span>
                        <strong>{tour.routeTitle}</strong>
                      </div>
                      <p>{tour.routeDescription}</p>
                      <div className="itinerary-route-stats">
                        {tour.routeDistanceKm != null && (
                          <span>
                            <Navigation size={16} />
                            <b>{tour.routeDistanceKm} km</b> {copy.returnRoute}
                          </span>
                        )}
                        <span>
                          <Clock3 size={16} />
                          <b>
                            {durationLabel(tour.durationValue, tour.durationUnit, tour.locale)}
                          </b>{" "}
                          {copy.doorToDoor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {tour.listItems.length > 0 && (
              <section id="included" className="content-section details-section">
                <SectionHeading eyebrow={copy.goodToKnow} title={copy.clearlyExplained} />
                <div className="included-grid">
                  <DetailCard kind="included" tour={tour} />
                  <DetailCard kind="excluded" tour={tour} />
                  <DetailCard kind="bring" tour={tour} />
                </div>
              </section>
            )}

            <section className="weather-card">
              <div>
                <span className="eyebrow">{copy.bestTime}</span>
                <h2>{tour.bestSeasonTitle}</h2>
                <p>{tour.bestSeasonBody}</p>
              </div>
              <div className="weather-stats">
                {tour.weatherStats.map((stat, index) => {
                  const Icon = ICONS[stat.iconKey] ?? Sun;
                  return (
                    <div key={`${stat.value}-${index}`}>
                      <Icon size={23} />
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {tour.reviews.length > 0 && (
              <section id="reviews" className="content-section reviews-section">
                <SectionHeading eyebrow={copy.stories} title={copy.trusted(rating)} />
                <div className="review-overview">
                  <div className="review-score">
                    <strong>{rating}</strong>
                    <div>
                      <div className="stars">{"★".repeat(Math.round(tour.ratingAverage ?? 0))}</div>
                      <span>{copy.basedOn(tour.ratingCount)}</span>
                    </div>
                  </div>
                </div>
                <div className="review-grid professional-reviews">
                  {tour.reviews.map((review) => (
                    <article className="review-card" key={review.id}>
                      <div className="review-top">
                        <div className="avatar">
                          {review.name
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <strong>{review.name}</strong>
                          <span>
                            <BadgeCheck size={14} /> {copy.verified}
                          </span>
                        </div>
                        <time dateTime={review.reviewDate}>
                          {formatDate(review.reviewDate, tour.locale)}
                        </time>
                      </div>
                      <div className="stars">{"★".repeat(review.rating)}</div>
                      <p>“{review.body}”</p>
                      <span>
                        {countryNames.of(review.nationCode) ?? review.nationCode} ·{" "}
                        {travelTypeLabel(review.travelType, tour.locale)}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {tour.faqs.length > 0 && (
              <section className="content-section faq-section">
                <SectionHeading eyebrow={copy.before} title={copy.faq} />
                <div className="faq-list">
                  {tour.faqs.map((faq, index) => (
                    <details key={`${faq.question}-${index}`} open={index === 0}>
                      <summary>
                        <span>{faq.question}</span>
                        <ChevronDown size={20} />
                      </summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div id="booking" className="booking-column">
            <BookingCard tour={tour} />
          </div>
        </div>

        <BookingCard tour={tour} mobile />

        {tour.relatedTours.length > 0 && (
          <section id="related" className="related-section tour-container">
            <div className="related-panel">
              <SectionHeading eyebrow={copy.exploring} title={copy.more} />
              <div className="related-track">
                {tour.relatedTours.map((related) => (
                  <article className="index-tour-card card-zoom" key={related.id}>
                    <div className="index-tour-image">
                      <img
                        className="card-zoom-img"
                        src={related.image}
                        alt={related.title}
                        loading="lazy"
                        decoding="async"
                      />
                      {related.badge && <span className="ribbon">{related.badge}</span>}
                    </div>
                    <span>{related.meta}</span>
                    <a href={related.href}>{related.title}</a>
                    <p>
                      {copy.from} {formatPrice(related.priceEur, tour.locale)} {copy.perPerson}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SharedSiteFooter />
    </div>
  );
}

export function DynamicTourPage({ tour }: { tour: TourViewModel }) {
  return (
    <SiteLocaleProvider
      locale={tour.locale}
      alternatePaths={{
        [tour.locale]: tour.href,
        [tour.alternateLocale]: tour.alternateHref,
      }}
    >
      <TourContent tour={tour} />
    </SiteLocaleProvider>
  );
}
