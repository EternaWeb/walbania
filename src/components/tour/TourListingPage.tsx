import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Minus,
  Plus,
  X,
} from "lucide-react";
import "../../tour-listing.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { SiteLocaleProvider } from "../../i18n";
import type { SiteLocale } from "../../i18n";
import type { TourListingCard, TourListingData, TourListingTaxonomy } from "../../lib/tours/types";
import { PerformanceImage } from "../PerformanceImage";

const TOUR_HERO_POSTER = "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=1800&q=85";

const DESTINATIONS = [
  {
    name: "The Albanian Alps",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=82",
  },
  {
    name: "The Riviera",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=82",
  },
  {
    name: "Berat",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=900&q=82",
    href: "/destinations/berat",
  },
  {
    name: "Gjirokastër",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=82",
  },
  {
    name: "Tirana",
    image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=900&q=82",
  },
] as const satisfies ReadonlyArray<{ name: string; image: string; href?: string }>;

type SearchFieldKey = "type" | "categories" | "people" | "dates" | "difficulty";

type TourSearchState = {
  typeId: string | null;
  categoryIds: string[] | null;
  people: number | null;
  startDate: string | null;
  endDate: string | null;
  difficultyId: string | null;
};

const EMPTY_SEARCH: TourSearchState = {
  typeId: null,
  categoryIds: null,
  people: null,
  startDate: null,
  endDate: null,
  difficultyId: null,
};

function dateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function dateFromValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatShortDate(value: string, locale: SiteLocale) {
  return dateFromValue(value).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
  });
}

function uniqueTours(tours: TourListingCard[]) {
  return tours.filter((tour, index) => tours.findIndex((item) => item.id === tour.id) === index);
}

function SearchField({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="tour-search-field" onClick={onClick}>
      <span>{label}</span>
      <strong title={value}>{value}</strong>
    </button>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="tour-search-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        className="tour-search-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-search-modal-title"
      >
        <header>
          <h2 id="tour-search-modal-title">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function ChoiceList({
  options,
  selectedIds,
  multiple = false,
  onSelect,
}: {
  options: TourListingTaxonomy[];
  selectedIds: string[];
  multiple?: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="tour-choice-list">
      {options.map((option) => {
        const selected = selectedIds.includes(option.id);
        return (
          <button
            type="button"
            key={option.id}
            className={selected ? "is-selected" : ""}
            aria-pressed={selected}
            onClick={() => onSelect(option.id)}
          >
            <span>{option.name}</span>
            {selected && <Check size={17} />}
            {!selected && multiple && <span className="tour-choice-box" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

function DateRangeCalendar({
  locale,
  startDate,
  endDate,
  showSingleDayNote,
  onChange,
  onAnyTime,
  onDone,
}: {
  locale: SiteLocale;
  startDate: string | null;
  endDate: string | null;
  showSingleDayNote: boolean;
  onChange: (start: string | null, end: string | null) => void;
  onAnyTime: () => void;
  onDone: () => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const leading = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const monthName = viewMonth.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
  });
  const startTime = startDate ? dateFromValue(startDate).getTime() : null;
  const endTime = endDate ? dateFromValue(endDate).getTime() : null;

  const chooseDate = (value: string) => {
    if (!startDate || endDate) {
      onChange(value, null);
      return;
    }
    if (value < startDate) {
      onChange(value, null);
      return;
    }
    onChange(startDate, value);
  };

  return (
    <div className="tour-calendar">
      <div className="tour-calendar-topline">
        <button type="button" className="tour-calendar-any" onClick={onAnyTime}>
          {locale === "fr" ? "À tout moment" : "Any Time"}
        </button>
        {showSingleDayNote && (
          <span>{locale === "fr" ? "CE CIRCUIT DURE UNE JOURNÉE" : "THIS TOUR LASTS ONE DAY"}</span>
        )}
      </div>
      <div className="tour-calendar-heading">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setViewMonth(new Date(year, month - 1, 1))}
        >
          <ChevronLeft size={18} />
        </button>
        <strong>{monthName}</strong>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="tour-calendar-grid is-weekdays" aria-hidden="true">
        {(locale === "fr"
          ? ["L", "M", "M", "J", "V", "S", "D"]
          : ["M", "T", "W", "T", "F", "S", "S"]
        ).map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="tour-calendar-grid">
        {Array.from({ length: leading }, (_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {Array.from({ length: count }, (_, index) => {
          const date = new Date(year, month, index + 1);
          const value = dateValue(date);
          const time = date.getTime();
          const isStart = value === startDate;
          const isEnd = value === endDate;
          const inRange =
            startTime !== null && endTime !== null && time > startTime && time < endTime;
          const disabled =
            time < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
          return (
            <button
              type="button"
              key={value}
              disabled={disabled}
              className={`${isStart || isEnd ? "is-edge" : ""}${inRange ? " is-range" : ""}`}
              aria-pressed={isStart || isEnd}
              onClick={() => chooseDate(value)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <button type="button" className="tour-modal-done" onClick={onDone}>
        {locale === "fr" ? "Terminé" : "Done"}
      </button>
    </div>
  );
}

function PeoplePicker({
  locale,
  value,
  onDone,
}: {
  locale: SiteLocale;
  value: number | null;
  onDone: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value ?? 1));
  const currentValue = Math.min(50, Math.max(1, Number(draft) || 1));

  const updateDraft = (nextValue: number) => {
    setDraft(String(Math.min(50, Math.max(1, nextValue))));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onDone(currentValue);
      }}
    >
      <div className="tour-people-picker">
        <button
          type="button"
          aria-label="Remove one person"
          disabled={currentValue <= 1}
          onClick={() => updateDraft(currentValue - 1)}
        >
          <Minus size={20} />
        </button>
        <input
          type="number"
          min={1}
          max={50}
          inputMode="numeric"
          aria-label={locale === "fr" ? "Nombre de personnes" : "Number of people"}
          value={draft}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => {
            const next = event.target.value;
            if (next === "") {
              setDraft("");
              return;
            }
            updateDraft(Number(next));
          }}
          onBlur={() => updateDraft(currentValue)}
        />
        <button
          type="button"
          aria-label="Add one person"
          disabled={currentValue >= 50}
          onClick={() => updateDraft(currentValue + 1)}
        >
          <Plus size={20} />
        </button>
      </div>
      <p className="tour-picker-help">
        {locale === "fr" ? "50 personnes maximum" : "50 people maximum"}
      </p>
      <button type="submit" className="tour-modal-done">
        {locale === "fr" ? "Terminé" : "Done"}
      </button>
    </form>
  );
}

function TourFinder({
  locale,
  data,
  search,
  setSearch,
  hasSearched,
  onSearch,
  onReset,
}: {
  locale: SiteLocale;
  data: TourListingData;
  search: TourSearchState;
  setSearch: React.Dispatch<React.SetStateAction<TourSearchState>>;
  hasSearched: boolean;
  onSearch: () => void;
  onReset: () => void;
}) {
  const [activeModal, setActiveModal] = useState<SearchFieldKey | null>(null);
  const type = data.tourTypes.find((item) => item.id === search.typeId);
  const difficulty = data.difficulties.find((item) => item.id === search.difficultyId);
  const categoryNames =
    search.categoryIds
      ?.map((id) => data.categories.find((item) => item.id === id)?.name)
      .filter(Boolean) ?? [];
  const typeName = type?.name ?? (locale === "fr" ? "Sélectionner" : "Select");
  const categoryName =
    search.categoryIds === null
      ? locale === "fr"
        ? "Sélectionner"
        : "Select"
      : search.categoryIds.length === 0
        ? locale === "fr"
          ? "Toutes"
          : "All"
        : categoryNames.join(", ");
  const datesName = search.startDate
    ? search.endDate
      ? `${formatShortDate(search.startDate, locale)} – ${formatShortDate(search.endDate, locale)}`
      : formatShortDate(search.startDate, locale)
    : locale === "fr"
      ? "À tout moment"
      : "Any Time";
  const hasSelections = Object.values(search).some((value) => value !== null);
  const oneDayType = Boolean(
    type && /half[- ]?day|daily|day tour|journée|demi[- ]journée/i.test(`${type.key} ${type.name}`),
  );
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <div className="tour-finder-band">
      <div className="tour-finder-box">
        <span className="tour-finder-label">
          {locale === "fr" ? "TROUVEZ VOTRE CIRCUIT" : "FIND YOUR TOUR"}
        </span>
        <div className="tour-finder-fields">
          <SearchField
            label={locale === "fr" ? "TYPE DE CIRCUIT" : "TOUR TYPE"}
            value={typeName}
            onClick={() => setActiveModal("type")}
          />
          <SearchField
            label={locale === "fr" ? "CATÉGORIES" : "CATEGORIES"}
            value={categoryName}
            onClick={() => setActiveModal("categories")}
          />
          <SearchField
            label={locale === "fr" ? "PERSONNES" : "PEOPLE"}
            value={search.people ? `${search.people}` : locale === "fr" ? "Sélectionner" : "Select"}
            onClick={() => setActiveModal("people")}
          />
          <SearchField
            label={locale === "fr" ? "DATES" : "DATES"}
            value={datesName}
            onClick={() => setActiveModal("dates")}
          />
          <SearchField
            label={locale === "fr" ? "DIFFICULTÉ" : "DIFFICULTY"}
            value={difficulty?.name ?? (locale === "fr" ? "Sélectionner" : "Select")}
            onClick={() => setActiveModal("difficulty")}
          />
          <div className="tour-search-action">
            <button type="button" className="tour-search-submit" onClick={onSearch}>
              <span>{locale === "fr" ? "RECHERCHER" : "SEARCH TOURS"}</span>
              <i aria-hidden="true">
                <ArrowUpRight />
              </i>
            </button>
            <button
              type="button"
              className={`tour-search-reset${hasSelections || hasSearched ? "" : " is-hidden"}`}
              aria-hidden={!hasSelections && !hasSearched}
              tabIndex={hasSelections || hasSearched ? 0 : -1}
              onClick={onReset}
            >
              {locale === "fr" ? "Réinitialiser" : "Reset Fields"}
            </button>
          </div>
        </div>
      </div>

      {activeModal === "type" && (
        <ModalShell title={locale === "fr" ? "Type de circuit" : "Tour Type"} onClose={closeModal}>
          <ChoiceList
            options={data.tourTypes}
            selectedIds={search.typeId ? [search.typeId] : []}
            onSelect={(id) => {
              setSearch((current) => ({ ...current, typeId: id }));
              closeModal();
            }}
          />
        </ModalShell>
      )}

      {activeModal === "categories" && (
        <ModalShell title={locale === "fr" ? "Catégories" : "Categories"} onClose={closeModal}>
          <div className="tour-choice-list">
            <button
              type="button"
              className={search.categoryIds?.length === 0 ? "is-selected" : ""}
              aria-pressed={search.categoryIds?.length === 0}
              onClick={() => setSearch((current) => ({ ...current, categoryIds: [] }))}
            >
              <span>{locale === "fr" ? "Toutes" : "All"}</span>
              {search.categoryIds?.length === 0 && <Check size={17} />}
            </button>
          </div>
          <ChoiceList
            options={data.categories}
            multiple
            selectedIds={search.categoryIds ?? []}
            onSelect={(id) =>
              setSearch((current) => {
                const selected = current.categoryIds ?? [];
                return {
                  ...current,
                  categoryIds: selected.includes(id)
                    ? selected.filter((item) => item !== id)
                    : [...selected, id],
                };
              })
            }
          />
          <button type="button" className="tour-modal-done" onClick={closeModal}>
            {locale === "fr" ? "Terminé" : "Done"}
          </button>
        </ModalShell>
      )}

      {activeModal === "people" && (
        <ModalShell
          title={locale === "fr" ? "Nombre de personnes" : "Number of People"}
          onClose={closeModal}
        >
          <PeoplePicker
            locale={locale}
            value={search.people}
            onDone={(people) => {
              setSearch((current) => ({ ...current, people }));
              closeModal();
            }}
          />
        </ModalShell>
      )}

      {activeModal === "dates" && (
        <ModalShell
          title={locale === "fr" ? "Choisissez vos dates" : "Choose Your Dates"}
          onClose={closeModal}
        >
          <DateRangeCalendar
            locale={locale}
            startDate={search.startDate}
            endDate={search.endDate}
            showSingleDayNote={oneDayType}
            onChange={(startDate, endDate) =>
              setSearch((current) => ({ ...current, startDate, endDate }))
            }
            onAnyTime={() => {
              setSearch((current) => ({ ...current, startDate: null, endDate: null }));
              closeModal();
            }}
            onDone={closeModal}
          />
        </ModalShell>
      )}

      {activeModal === "difficulty" && (
        <ModalShell title={locale === "fr" ? "Difficulté" : "Difficulty"} onClose={closeModal}>
          <ChoiceList
            options={data.difficulties}
            selectedIds={search.difficultyId ? [search.difficultyId] : []}
            onSelect={(id) => {
              setSearch((current) => ({ ...current, difficultyId: id }));
              closeModal();
            }}
          />
        </ModalShell>
      )}
    </div>
  );
}

export function TourCard({ tour, locale }: { tour: TourListingCard; locale: SiteLocale }) {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
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
          <PerformanceImage
            src={tour.image}
            alt={tour.imageAlt}
            width={900}
            height={600}
            sizes="(max-width: 720px) calc(100vw - 24px), (max-width: 1100px) 48vw, 420px"
            maxWidth={900}
          />
        ) : (
          <span className="tours-listing-image-fallback" aria-hidden="true">
            Wonder Albania
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

export function Rail({ children, locale }: { children: React.ReactNode[]; locale: SiteLocale }) {
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
  }, [children.length, updateControls]);

  const move = (direction: number) => {
    scrollerRef.current?.scrollBy({
      left: direction * scrollerRef.current.clientWidth * 0.88,
      behavior: "smooth",
    });
  };

  return (
    <div className="tours-listing-scroller-shell">
      <div ref={scrollerRef} className="tours-listing-scroller scroll-hide">
        {children}
      </div>
      {canLeft && (
        <button
          type="button"
          className="tours-listing-control is-left"
          onClick={() => move(-1)}
          aria-label={locale === "fr" ? "Précédent" : "Previous"}
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {canRight && (
        <button
          type="button"
          className="tours-listing-control is-right"
          onClick={() => move(1)}
          aria-label={locale === "fr" ? "Suivant" : "Next"}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}

export function TourRail({ tours, locale }: { tours: TourListingCard[]; locale: SiteLocale }) {
  return (
    <Rail locale={locale}>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} locale={locale} />
      ))}
    </Rail>
  );
}

function tourMatchesDates(tour: TourListingCard, startDate: string, endDate: string | null) {
  const start = dateFromValue(startDate);
  const end = dateFromValue(endDate ?? startDate);
  const overrides = new Map(tour.dateOverrides.map((item) => [item.date, item.isAvailable]));
  const cursor = new Date(start);
  let checked = 0;
  while (cursor <= end && checked < 732) {
    const override = overrides.get(dateValue(cursor));
    const available = override ?? tour.defaultAvailable;
    if (available) return true;
    cursor.setDate(cursor.getDate() + 1);
    checked += 1;
  }
  return false;
}

function EmptyTours({ locale }: { locale: SiteLocale }) {
  return (
    <div className="tours-listing-empty">
      <h3>{locale === "fr" ? "Aucun circuit trouvé" : "No tours found"}</h3>
      <p>
        {locale === "fr"
          ? "Essayez de modifier ou de réinitialiser vos critères."
          : "Try changing or resetting your search fields."}
      </p>
    </div>
  );
}

function ToursIndex({ locale, data }: { locale: SiteLocale; data: TourListingData }) {
  const [search, setSearch] = useState<TourSearchState>(EMPTY_SEARCH);
  const [submittedSearch, setSubmittedSearch] = useState<TourSearchState | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [showAllTours, setShowAllTours] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const orderedTours = uniqueTours([...data.tours.filter((tour) => tour.featured), ...data.tours]);
  const featuredTours = showAllTours ? orderedTours : orderedTours.slice(0, 3);

  const searchResults = useMemo(() => {
    if (!submittedSearch) return [];
    return data.tours.filter((tour) => {
      if (submittedSearch.typeId && tour.typeId !== submittedSearch.typeId) return false;
      if (
        submittedSearch.categoryIds?.length &&
        !submittedSearch.categoryIds.every((id) => tour.categoryIds.includes(id))
      )
        return false;
      if (submittedSearch.people && tour.maxGroupSize < submittedSearch.people) return false;
      if (submittedSearch.difficultyId && tour.difficultyId !== submittedSearch.difficultyId)
        return false;
      if (
        submittedSearch.startDate &&
        !tourMatchesDates(tour, submittedSearch.startDate, submittedSearch.endDate)
      )
        return false;
      return true;
    });
  }, [data.tours, submittedSearch]);

  const runSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSubmittedSearch({ ...search });
    setLoadingResults(true);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    timerRef.current = setTimeout(() => setLoadingResults(false), 1300);
  };

  const resetSearch = () => {
    setSearch(EMPTY_SEARCH);
    setSubmittedSearch(null);
    setLoadingResults(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div className="tours-index-page min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="tours-index-hero" aria-labelledby="tours-index-title">
          <div className="index-hero-media">
            <PerformanceImage
              src={TOUR_HERO_POSTER}
              alt={locale === "fr" ? "Voyager en Albanie" : "Travel through Albania"}
              className="index-hero-poster"
              width={1920}
              height={1080}
              sizes="100vw"
              maxWidth={1920}
              priority
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
              <a className="index-hero-cta" href="#featured-tours">
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
          <TourFinder
            locale={locale}
            data={data}
            search={search}
            setSearch={setSearch}
            hasSearched={submittedSearch !== null}
            onSearch={runSearch}
            onReset={resetSearch}
          />
        </section>

        <section id="featured-tours" className="tours-listing-section tours-featured-section">
          <div className="page-inset">
            <div className="tours-index-heading">
              <h2>{locale === "fr" ? "Circuits en vedette" : "Featured Tours"}</h2>
            </div>
            <div className="tours-section-body">
              {featuredTours.length > 0 ? (
                <TourRail tours={featuredTours} locale={locale} />
              ) : (
                <EmptyTours locale={locale} />
              )}
            </div>
            {data.tours.length > 3 && (
              <button
                type="button"
                className="tours-view-more"
                onClick={() => setShowAllTours((current) => !current)}
              >
                {showAllTours
                  ? locale === "fr"
                    ? "VOIR MOINS"
                    : "VIEW LESS"
                  : locale === "fr"
                    ? "VOIR PLUS"
                    : "VIEW MORE"}
              </button>
            )}
          </div>
        </section>

        {submittedSearch && (
          <section
            ref={resultsRef}
            className="tours-listing-section tours-results-section"
            aria-live="polite"
          >
            <div className="page-inset">
              <div className="tours-listing-heading-row">
                <div className="tours-index-heading is-left">
                  <h2>{locale === "fr" ? "Résultats de recherche" : "Search Results"}</h2>
                </div>
                {!loadingResults && (
                  <p>
                    {searchResults.length} {locale === "fr" ? "circuits" : "tours"}
                  </p>
                )}
              </div>
              {loadingResults ? (
                <div className="tour-results-loader" role="status">
                  <LoaderCircle size={24} />
                  <span>{locale === "fr" ? "Recherche en cours…" : "Finding your tours…"}</span>
                </div>
              ) : searchResults.length > 0 ? (
                <TourRail tours={searchResults} locale={locale} />
              ) : (
                <EmptyTours locale={locale} />
              )}
            </div>
          </section>
        )}

        <section
          id="destinations"
          className="tour-destinations-section"
          aria-labelledby="destinations-title"
        >
          <div className="page-inset">
            <div className="tour-destinations-heading">
              <span>ALBANIA</span>
              <h2 id="destinations-title">
                {locale === "fr" ? "Explorer les destinations" : "Explore Destinations"}
              </h2>
            </div>
            <Rail locale={locale}>
              {DESTINATIONS.map((destination) => {
                const card = (
                  <>
                    <PerformanceImage
                      src={destination.image}
                      alt=""
                      width={900}
                      height={600}
                      sizes="(max-width: 720px) calc(100vw - 24px), (max-width: 1100px) 48vw, 420px"
                      maxWidth={900}
                    />
                    <span aria-hidden="true" />
                    <h3>{destination.name}</h3>
                  </>
                );
                return "href" in destination ? (
                  <a
                    className="tour-destination-card"
                    href={destination.href}
                    key={destination.name}
                  >
                    {card}
                  </a>
                ) : (
                  <article className="tour-destination-card" key={destination.name}>
                    {card}
                  </article>
                );
              })}
            </Rail>
          </div>
        </section>
      </main>
      <SiteFooter />
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
