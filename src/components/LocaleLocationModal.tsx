import { Check, ChevronRight, Globe2, LoaderCircle, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { localizedPath, useLocalize, useSiteLocale } from "../i18n";
import type { SiteLocale } from "../i18n";

const LOCALE_KEY = "wonderalbania-locale";
const LOCATION_KEY = "wonderalbania-location";

function locationKey(locale: SiteLocale) {
  return `${LOCATION_KEY}-${locale}`;
}

function saveLocale(locale: SiteLocale) {
  window.localStorage.setItem(LOCALE_KEY, locale);
  document.cookie = `wonderalbania_locale=${locale}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function moveToLocale(locale: SiteLocale) {
  const path = localizedPath(window.location.pathname, locale);
  window.location.assign(`${path}${window.location.search}${window.location.hash}`);
}

export function LocaleLocationModal({ className = "icon-chip" }: { className?: string }) {
  const locale = useSiteLocale();
  const localize = useLocalize();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("Detect location");
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const savedLocation = window.localStorage.getItem(locationKey(locale));
    if (savedLocation) setLocation(savedLocation);
    else setLocation("Detect location");

    const savedLocale = window.localStorage.getItem(LOCALE_KEY) as SiteLocale | null;
    if (savedLocale === "en" || savedLocale === "fr") {
      if (savedLocale !== locale) moveToLocale(savedLocale);
      return;
    }

    if (locale === "fr") {
      saveLocale("fr");
      return;
    }

    const browserPrefersFrench = navigator.languages.some((language) =>
      language.toLowerCase().startsWith("fr"),
    );
    const initialLocale: SiteLocale = browserPrefersFrench ? "fr" : "en";
    saveLocale(initialLocale);
    if (initialLocale !== locale) moveToLocale(initialLocale);
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation("Location unavailable");
      window.localStorage.setItem(locationKey(locale), "Location unavailable");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const fallback = `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=${locale}`,
          );
          if (!response.ok) throw new Error("Reverse geocoding failed");
          const result = (await response.json()) as {
            city?: string;
            locality?: string;
            principalSubdivision?: string;
            countryName?: string;
          };
          const place =
            [result.city || result.locality || result.principalSubdivision, result.countryName]
              .filter(Boolean)
              .join(", ") || fallback;
          setLocation(place);
          window.localStorage.setItem(locationKey(locale), place);
        } catch {
          setLocation(fallback);
          window.localStorage.setItem(locationKey(locale), fallback);
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setLocation("Location permission denied");
        window.localStorage.setItem(locationKey(locale), "Location permission denied");
        setDetecting(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 900000 },
    );
  }, [locale]);

  const openModal = () => {
    setOpen(true);
    if (!window.localStorage.getItem(locationKey(locale))) detectLocation();
  };

  const chooseLocale = (nextLocale: SiteLocale) => {
    saveLocale(nextLocale);
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }
    moveToLocale(nextLocale);
  };

  return localize(
    <>
      <button
        type="button"
        className={className}
        aria-label="Language and location"
        onClick={openModal}
      >
        <Globe2 size={18} />
      </button>
      {open && (
        <div className="preference-overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            className="preference-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preference-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="preference-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X size={19} />
            </button>
            <h2 id="preference-title">Choose location and language</h2>

            <button type="button" className="location-choice" onClick={detectLocation}>
              <span className="preference-icon">
                {detecting ? (
                  <LoaderCircle className="preference-spinner" size={19} />
                ) : (
                  <MapPin size={19} />
                )}
              </span>
              <strong>{detecting ? "Detecting location…" : location}</strong>
              <ChevronRight size={18} />
            </button>

            <div className="language-list" aria-label="Language selection">
              <button
                type="button"
                className={locale === "en" ? "is-current" : ""}
                onClick={() => chooseLocale("en")}
              >
                <span>English</span>
                {locale === "en" && <Check size={18} />}
              </button>
              <button
                type="button"
                className={locale === "fr" ? "is-current" : ""}
                onClick={() => chooseLocale("fr")}
              >
                <span>Français</span>
                {locale === "fr" && <Check size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
  );
}
