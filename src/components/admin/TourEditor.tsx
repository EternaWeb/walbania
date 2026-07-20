import { createClient } from "@supabase/supabase-js";
import {
  ArrowDown,
  ArrowUp,
  CalendarPlus,
  Check,
  Copy,
  ExternalLink,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Plus,
  Save,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "./AdminShell";
import {
  deleteTourMediaFn,
  geocodePlaceFn,
  publishTourFn,
  requestTourUploadFn,
  saveTourFn,
  unpublishTourFn,
} from "../../lib/tours/server";
import type {
  GeocodeCandidate,
  PublishResult,
  ReviewRecord,
  TaxonomyItem,
  TourEditorPayload,
  TourLocale,
} from "../../lib/tours/types";

type ReferenceData = {
  categories: TaxonomyItem[];
  tourTypes: TaxonomyItem[];
  difficulties: TaxonomyItem[];
  reviews: ReviewRecord[];
};

const SECTIONS = [
  ["basics", "Basics"],
  ["translations", "English & French"],
  ["content", "Content"],
  ["media", "Gallery"],
  ["itinerary", "Itinerary"],
  ["availability", "Availability"],
  ["reviews", "Reviews"],
  ["seo", "SEO & publish"],
] as const;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  full,
  min,
  max,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  full?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <div className={`admin-field${full ? " is-full" : ""}`}>
      <label>{label}</label>
      <input
        className="admin-input"
        type={type}
        value={value}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  full = true,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  full?: boolean;
  rows?: number;
}) {
  return (
    <div className={`admin-field${full ? " is-full" : ""}`}>
      <label>{label}</label>
      <textarea
        className="admin-textarea"
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function RepeaterHeader({
  label,
  index,
  length,
  onMove,
  onRemove,
}: {
  label: string;
  index: number;
  length: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="admin-repeater-header">
      <strong>
        {label} {index + 1}
      </strong>
      <div className="admin-repeater-actions">
        <button type="button" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          disabled={index === length - 1}
          onClick={() => onMove(1)}
          aria-label="Move down"
        >
          <ArrowDown size={14} />
        </button>
        <button type="button" onClick={onRemove} aria-label="Remove">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function TranslationFields({
  locale,
  tour,
  setTour,
}: {
  locale: TourLocale;
  tour: TourEditorPayload;
  setTour: React.Dispatch<React.SetStateAction<TourEditorPayload>>;
}) {
  const translation = tour.translations[locale];
  const language = locale === "en" ? "English" : "French";
  const update = (field: keyof typeof translation, value: string) =>
    setTour((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], [field]: value },
      },
    }));
  return (
    <div className="admin-form-card">
      <h2>{language} page</h2>
      <p>The slug becomes part of the public URL and can differ between languages.</p>
      <div className="admin-form-grid">
        <TextField
          label="Tour title"
          value={translation.title}
          onChange={(value) => {
            const hadSlug = Boolean(translation.slug);
            update("title", value);
            if (!hadSlug) update("slug", slugify(value));
          }}
        />
        <TextField label="URL slug" value={translation.slug} onChange={(value) => update("slug", slugify(value))} />
        <TextField label="Hero badge" value={translation.heroBadge} onChange={(value) => update("heroBadge", value)} />
        <TextField
          label="Location label"
          value={translation.locationLabel}
          onChange={(value) => update("locationLabel", value)}
        />
        <TextAreaField
          label="Hero introduction"
          value={translation.heroIntro}
          onChange={(value) => update("heroIntro", value)}
        />
      </div>
    </div>
  );
}

export function TourEditor({
  initialTour,
  referenceData,
}: {
  initialTour: TourEditorPayload;
  referenceData: ReferenceData;
}) {
  const [tour, setTour] = useState(initialTour);
  const [section, setSection] = useState<(typeof SECTIONS)[number][0]>("basics");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [geocodeResults, setGeocodeResults] = useState<
    Record<number, GeocodeCandidate[]>
  >({});
  const [searchingStop, setSearchingStop] = useState<number | null>(null);
  const [dateDraft, setDateDraft] = useState({
    date: "",
    isAvailable: true,
    price: "",
  });
  const title = tour.translations.en.title || "Untitled tour";

  const setTranslation = (
    locale: TourLocale,
    field: keyof TourEditorPayload["translations"]["en"],
    value: string,
  ) =>
    setTour((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], [field]: value },
      },
    }));

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await saveTourFn({ data: tour });
      setTour(saved);
      setMessage("Draft saved.");
      if (!initialTour.id && saved.id) {
        window.history.replaceState({}, "", `/admin/tours/${saved.id}`);
      }
      return saved;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The tour could not be saved.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    const saved = await save();
    if (!saved?.id) return;
    setSaving(true);
    try {
      const result = await publishTourFn({ data: { id: saved.id } });
      if (!result.ok) {
        setError(result.problems.join(" "));
        return;
      }
      setTour((current) => ({ ...current, status: "published" }));
      setPublishResult(result.result);
      setMessage("Tour published. Both links are live.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The tour could not be published.");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file: File, role: "hero" | "gallery") => {
    if (!tour.id) {
      setError("Save the draft once before uploading images.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const ticket = await requestTourUploadFn({
        data: {
          tourId: tour.id,
          fileName: file.name,
          contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/avif",
          size: file.size,
        },
      });
      const client = createClient(ticket.url, ticket.publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      });
      const { error: uploadError } = await client.storage
        .from("tour-media")
        .uploadToSignedUrl(ticket.path, ticket.token, file, {
          contentType: file.type,
          cacheControl: "31536000",
        });
      if (uploadError) throw uploadError;
      setTour((current) => {
        const retained =
          role === "hero" ? current.media.filter((item) => item.role !== "hero") : current.media;
        return {
          ...current,
          media: [
            ...retained,
            {
              role,
              storagePath: ticket.path,
              publicUrl: ticket.publicUrl,
              altEn: "",
              altFr: "",
              sortOrder: retained.filter((item) => item.role === role).length,
            },
          ],
        };
      });
      setMessage("Image uploaded. Add both alt texts, then save the tour.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Image upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const removeMedia = async (index: number) => {
    const item = tour.media[index];
    setTour((current) => ({
      ...current,
      media: current.media.filter((_, itemIndex) => itemIndex !== index),
    }));
    try {
      await deleteTourMediaFn({ data: { path: item.storagePath } });
    } catch {
      setMessage("The image was removed from the tour. Storage cleanup can be retried later.");
    }
  };

  const selectedReviews = useMemo(() => new Set(tour.reviewIds), [tour.reviewIds]);

  return (
    <>
      <AdminPageHeader
        eyebrow={tour.status}
        title={title}
        description="Complete every tab, save the draft, preview both languages, then publish."
        actions={
          <>
            {tour.id && (
              <a className="admin-button" href={`/admin/tours/${tour.id}/preview?locale=en`} target="_blank">
                <ExternalLink size={16} /> Preview
              </a>
            )}
            <button className="admin-button" type="button" onClick={() => void save()} disabled={saving}>
              {saving ? <LoaderCircle size={16} /> : <Save size={16} />} Save draft
            </button>
            <button className="admin-button is-primary" type="button" onClick={() => void publish()} disabled={saving}>
              <Send size={16} /> Publish
            </button>
          </>
        }
      />

      <div className="admin-editor-layout">
        <nav className="admin-editor-nav" aria-label="Tour editor sections">
          {SECTIONS.map(([key, label]) => (
            <button
              type="button"
              key={key}
              className={section === key ? "is-current" : ""}
              onClick={() => setSection(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="admin-editor-content">
          {section === "basics" && (
            <>
              <div className="admin-form-card">
                <h2>Tour essentials</h2>
                <p>These values power the hero facts, price and related-tour cards.</p>
                <div className="admin-form-grid is-three">
                  <TextField
                    label="Base price (EUR)"
                    type="number"
                    min={0}
                    value={tour.basePriceEur}
                    onChange={(value) => setTour({ ...tour, basePriceEur: Number(value) })}
                  />
                  <TextField
                    label="Discount % (optional)"
                    type="number"
                    min={1}
                    max={99}
                    value={tour.discountPercent ?? ""}
                    onChange={(value) =>
                      setTour({ ...tour, discountPercent: value ? Number(value) : null })
                    }
                  />
                  <TextField
                    label="Duration (minutes)"
                    type="number"
                    min={1}
                    value={tour.durationMinutes}
                    onChange={(value) => setTour({ ...tour, durationMinutes: Number(value) })}
                  />
                  <TextField
                    label="Maximum group size"
                    type="number"
                    min={1}
                    value={tour.maxGroupSize}
                    onChange={(value) => setTour({ ...tour, maxGroupSize: Number(value) })}
                  />
                  <TextField label="Starts in" value={tour.startPlace} onChange={(value) => setTour({ ...tour, startPlace: value })} />
                  <TextField label="Ends in" value={tour.endPlace} onChange={(value) => setTour({ ...tour, endPlace: value })} />
                  <TextField
                    label="Languages (comma separated)"
                    value={tour.languageCodes.join(", ")}
                    onChange={(value) =>
                      setTour({
                        ...tour,
                        languageCodes: value
                          .split(",")
                          .map((item) => item.trim().toUpperCase())
                          .filter(Boolean),
                      })
                    }
                  />
                  <TextField
                    label="Route distance (km)"
                    type="number"
                    min={0}
                    value={tour.routeDistanceKm ?? ""}
                    onChange={(value) =>
                      setTour({ ...tour, routeDistanceKm: value ? Number(value) : null })
                    }
                  />
                  <label className="admin-check" style={{ alignSelf: "end" }}>
                    <input
                      type="checkbox"
                      checked={tour.featured}
                      onChange={(event) => setTour({ ...tour, featured: event.target.checked })}
                    />
                    <span>Featured tour</span>
                  </label>
                </div>
              </div>
              <div className="admin-form-card">
                <h2>Classification</h2>
                <p>Related tours are ranked by shared categories.</p>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label>Tour type</label>
                    <select
                      className="admin-select"
                      value={tour.tourTypeId ?? ""}
                      onChange={(event) => setTour({ ...tour, tourTypeId: event.target.value || null })}
                    >
                      <option value="">Select a type</option>
                      {referenceData.tourTypes.filter((item) => item.active).map((item) => (
                        <option key={item.id} value={item.id}>{item.nameEn} / {item.nameFr}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Difficulty</label>
                    <select
                      className="admin-select"
                      value={tour.difficultyId ?? ""}
                      onChange={(event) => setTour({ ...tour, difficultyId: event.target.value || null })}
                    >
                      <option value="">Select a difficulty</option>
                      {referenceData.difficulties.filter((item) => item.active).map((item) => (
                        <option key={item.id} value={item.id}>{item.nameEn} / {item.nameFr}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-field is-full">
                    <label>Categories</label>
                    <div className="admin-check-grid">
                      {referenceData.categories.filter((item) => item.active).map((item) => (
                        <label className="admin-check" key={item.id}>
                          <input
                            type="checkbox"
                            checked={tour.categoryIds.includes(item.id)}
                            onChange={(event) =>
                              setTour((current) => ({
                                ...current,
                                categoryIds: event.target.checked
                                  ? [...current.categoryIds, item.id]
                                  : current.categoryIds.filter((id) => id !== item.id),
                              }))
                            }
                          />
                          <span>{item.nameEn} / {item.nameFr}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-form-card">
                <h2>Localized facts</h2>
                <div className="admin-form-grid">
                  <TextField label="Region (English)" value={tour.regionEn} onChange={(value) => setTour({ ...tour, regionEn: value })} />
                  <TextField label="Region (French)" value={tour.regionFr} onChange={(value) => setTour({ ...tour, regionFr: value })} />
                  <TextAreaField label="Accessibility (English)" value={tour.accessibilityEn} onChange={(value) => setTour({ ...tour, accessibilityEn: value })} full={false} />
                  <TextAreaField label="Accessibility (French)" value={tour.accessibilityFr} onChange={(value) => setTour({ ...tour, accessibilityFr: value })} full={false} />
                </div>
              </div>
            </>
          )}

          {section === "translations" && (
            <>
              <TranslationFields locale="en" tour={tour} setTour={setTour} />
              <TranslationFields locale="fr" tour={tour} setTour={setTour} />
            </>
          )}

          {section === "content" && (
            <>
              {(["en", "fr"] as const).map((locale) => {
                const translation = tour.translations[locale];
                const language = locale === "en" ? "English" : "French";
                return (
                  <div className="admin-form-card" key={locale}>
                    <h2>{language} story and season</h2>
                    <div className="admin-form-grid">
                      <TextField label="Overview title" value={translation.overviewTitle} onChange={(value) => setTranslation(locale, "overviewTitle", value)} />
                      <TextField label="Best-season title" value={translation.bestSeasonTitle} onChange={(value) => setTranslation(locale, "bestSeasonTitle", value)} />
                      <TextAreaField label="Overview summary" value={translation.overviewSummary} onChange={(value) => setTranslation(locale, "overviewSummary", value)} />
                      <TextAreaField label="Overview body" value={translation.overviewBody} onChange={(value) => setTranslation(locale, "overviewBody", value)} rows={6} />
                      <TextAreaField label="Best-season information" value={translation.bestSeasonBody} onChange={(value) => setTranslation(locale, "bestSeasonBody", value)} />
                      <TextField label="Route title" value={translation.routeTitle} onChange={(value) => setTranslation(locale, "routeTitle", value)} />
                      <TextAreaField label="Route description" value={translation.routeDescription} onChange={(value) => setTranslation(locale, "routeDescription", value)} />
                      <TextAreaField label="Cancellation summary" value={translation.cancellationSummary} onChange={(value) => setTranslation(locale, "cancellationSummary", value)} />
                    </div>
                  </div>
                );
              })}
              <div className="admin-form-card">
                <h2>Tour highlights</h2>
                <div className="admin-repeater-list">
                  {tour.highlights.map((item, index) => (
                    <div className="admin-repeater" key={item.id ?? `highlight-${index}`}>
                      <RepeaterHeader label="Highlight" index={index} length={tour.highlights.length} onMove={(direction) => setTour({ ...tour, highlights: moveItem(tour.highlights, index, direction) })} onRemove={() => setTour({ ...tour, highlights: tour.highlights.filter((_, itemIndex) => itemIndex !== index) })} />
                      <div className="admin-form-grid">
                        <TextField label="Icon key" value={item.iconKey} onChange={(value) => setTour({ ...tour, highlights: tour.highlights.map((entry, itemIndex) => itemIndex === index ? { ...entry, iconKey: value } : entry) })} />
                        <span />
                        <TextField label="English label" value={item.labelEn} onChange={(value) => setTour({ ...tour, highlights: tour.highlights.map((entry, itemIndex) => itemIndex === index ? { ...entry, labelEn: value } : entry) })} />
                        <TextField label="French label" value={item.labelFr} onChange={(value) => setTour({ ...tour, highlights: tour.highlights.map((entry, itemIndex) => itemIndex === index ? { ...entry, labelFr: value } : entry) })} />
                        <TextAreaField label="English text" value={item.textEn} onChange={(value) => setTour({ ...tour, highlights: tour.highlights.map((entry, itemIndex) => itemIndex === index ? { ...entry, textEn: value } : entry) })} full={false} />
                        <TextAreaField label="French text" value={item.textFr} onChange={(value) => setTour({ ...tour, highlights: tour.highlights.map((entry, itemIndex) => itemIndex === index ? { ...entry, textFr: value } : entry) })} full={false} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="admin-button" type="button" onClick={() => setTour({ ...tour, highlights: [...tour.highlights, { iconKey: "sparkles", labelEn: "", labelFr: "", textEn: "", textFr: "", sortOrder: tour.highlights.length }] })}>
                  <Plus size={15} /> Add highlight
                </button>
              </div>
              <div className="admin-form-card">
                <h2>Included, excluded and what to bring</h2>
                <div className="admin-repeater-list">
                  {tour.listItems.map((item, index) => (
                    <div className="admin-repeater" key={item.id ?? `item-${index}`}>
                      <RepeaterHeader label={item.kind} index={index} length={tour.listItems.length} onMove={(direction) => setTour({ ...tour, listItems: moveItem(tour.listItems, index, direction) })} onRemove={() => setTour({ ...tour, listItems: tour.listItems.filter((_, itemIndex) => itemIndex !== index) })} />
                      <div className="admin-form-grid is-three">
                        <div className="admin-field">
                          <label>Section</label>
                          <select className="admin-select" value={item.kind} onChange={(event) => setTour({ ...tour, listItems: tour.listItems.map((entry, itemIndex) => itemIndex === index ? { ...entry, kind: event.target.value as typeof item.kind } : entry) })}>
                            <option value="included">Included</option>
                            <option value="excluded">Excluded</option>
                            <option value="bring">What to bring</option>
                          </select>
                        </div>
                        <TextField label="English" value={item.textEn} onChange={(value) => setTour({ ...tour, listItems: tour.listItems.map((entry, itemIndex) => itemIndex === index ? { ...entry, textEn: value } : entry) })} />
                        <TextField label="French" value={item.textFr} onChange={(value) => setTour({ ...tour, listItems: tour.listItems.map((entry, itemIndex) => itemIndex === index ? { ...entry, textFr: value } : entry) })} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="admin-button" type="button" onClick={() => setTour({ ...tour, listItems: [...tour.listItems, { kind: "included", textEn: "", textFr: "", sortOrder: tour.listItems.length }] })}>
                  <Plus size={15} /> Add detail
                </button>
              </div>
              <div className="admin-form-card">
                <h2>Weather statistics</h2>
                <div className="admin-repeater-list">
                  {tour.weatherStats.map((item, index) => (
                    <div className="admin-repeater" key={item.id ?? `weather-${index}`}>
                      <RepeaterHeader label="Weather fact" index={index} length={tour.weatherStats.length} onMove={(direction) => setTour({ ...tour, weatherStats: moveItem(tour.weatherStats, index, direction) })} onRemove={() => setTour({ ...tour, weatherStats: tour.weatherStats.filter((_, itemIndex) => itemIndex !== index) })} />
                      <div className="admin-form-grid is-three">
                        <TextField label="Icon key" value={item.iconKey} onChange={(value) => setTour({ ...tour, weatherStats: tour.weatherStats.map((entry, itemIndex) => itemIndex === index ? { ...entry, iconKey: value } : entry) })} />
                        <TextField label="Value" value={item.value} onChange={(value) => setTour({ ...tour, weatherStats: tour.weatherStats.map((entry, itemIndex) => itemIndex === index ? { ...entry, value } : entry) })} />
                        <span />
                        <TextField label="English label" value={item.labelEn} onChange={(value) => setTour({ ...tour, weatherStats: tour.weatherStats.map((entry, itemIndex) => itemIndex === index ? { ...entry, labelEn: value } : entry) })} />
                        <TextField label="French label" value={item.labelFr} onChange={(value) => setTour({ ...tour, weatherStats: tour.weatherStats.map((entry, itemIndex) => itemIndex === index ? { ...entry, labelFr: value } : entry) })} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="admin-button" type="button" onClick={() => setTour({ ...tour, weatherStats: [...tour.weatherStats, { iconKey: "sun", value: "", labelEn: "", labelFr: "", sortOrder: tour.weatherStats.length }] })}>
                  <Plus size={15} /> Add weather fact
                </button>
              </div>
              <div className="admin-form-card">
                <h2>Frequently asked questions</h2>
                <div className="admin-repeater-list">
                  {tour.faqs.map((item, index) => (
                    <div className="admin-repeater" key={item.id ?? `faq-${index}`}>
                      <RepeaterHeader label="FAQ" index={index} length={tour.faqs.length} onMove={(direction) => setTour({ ...tour, faqs: moveItem(tour.faqs, index, direction) })} onRemove={() => setTour({ ...tour, faqs: tour.faqs.filter((_, itemIndex) => itemIndex !== index) })} />
                      <div className="admin-form-grid">
                        <TextField label="English question" value={item.questionEn} onChange={(value) => setTour({ ...tour, faqs: tour.faqs.map((entry, itemIndex) => itemIndex === index ? { ...entry, questionEn: value } : entry) })} />
                        <TextField label="French question" value={item.questionFr} onChange={(value) => setTour({ ...tour, faqs: tour.faqs.map((entry, itemIndex) => itemIndex === index ? { ...entry, questionFr: value } : entry) })} />
                        <TextAreaField label="English answer" value={item.answerEn} onChange={(value) => setTour({ ...tour, faqs: tour.faqs.map((entry, itemIndex) => itemIndex === index ? { ...entry, answerEn: value } : entry) })} full={false} />
                        <TextAreaField label="French answer" value={item.answerFr} onChange={(value) => setTour({ ...tour, faqs: tour.faqs.map((entry, itemIndex) => itemIndex === index ? { ...entry, answerFr: value } : entry) })} full={false} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="admin-button" type="button" onClick={() => setTour({ ...tour, faqs: [...tour.faqs, { questionEn: "", questionFr: "", answerEn: "", answerFr: "", sortOrder: tour.faqs.length }] })}>
                  <Plus size={15} /> Add FAQ
                </button>
              </div>
            </>
          )}

          {section === "media" && (
            <div className="admin-form-card">
              <h2>Hero and gallery</h2>
              <p>JPEG, PNG, WebP or AVIF. Maximum 10 MB. Alt text is required in both languages.</p>
              <div className="admin-upload-grid">
                {tour.media.map((item, index) => (
                  <article className="admin-media-card" key={item.storagePath}>
                    <img src={item.publicUrl} alt="" />
                    <div>
                      <strong>{item.role === "hero" ? "Hero image" : `Gallery ${index + 1}`}</strong>
                      <input className="admin-input" value={item.altEn} placeholder="English alt text" onChange={(event) => setTour({ ...tour, media: tour.media.map((entry, itemIndex) => itemIndex === index ? { ...entry, altEn: event.target.value } : entry) })} />
                      <input className="admin-input" value={item.altFr} placeholder="French alt text" onChange={(event) => setTour({ ...tour, media: tour.media.map((entry, itemIndex) => itemIndex === index ? { ...entry, altFr: event.target.value } : entry) })} />
                      <button className="admin-button is-danger" type="button" onClick={() => void removeMedia(index)}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </article>
                ))}
                <label className="admin-upload-button">
                  <ImagePlus size={24} />
                  <strong>Upload gallery image</strong>
                  <span>Choose a file</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "gallery"); }} />
                </label>
                <label className="admin-upload-button">
                  <ImagePlus size={24} />
                  <strong>{tour.media.some((item) => item.role === "hero") ? "Replace hero image" : "Upload hero image"}</strong>
                  <span>Choose a file</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "hero"); }} />
                </label>
              </div>
            </div>
          )}

          {section === "itinerary" && (
            <div className="admin-form-card">
              <h2>Ordered itinerary</h2>
              <p>Search a city or place, confirm a result, and use the arrows to set the route order.</p>
              <div className="admin-repeater-list">
                {tour.itinerary.map((stop, index) => (
                  <div className="admin-repeater" key={stop.id ?? `stop-${index}`}>
                    <RepeaterHeader label="Stop" index={index} length={tour.itinerary.length} onMove={(direction) => setTour({ ...tour, itinerary: moveItem(tour.itinerary, index, direction) })} onRemove={() => setTour({ ...tour, itinerary: tour.itinerary.filter((_, itemIndex) => itemIndex !== index) })} />
                    <div className="admin-form-grid is-three">
                      <TextField label="Time" type="time" value={stop.time} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, time: value } : entry) })} />
                      <TextField label="Duration (minutes)" type="number" min={1} value={stop.durationMinutes} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, durationMinutes: Number(value) } : entry) })} />
                      <span />
                      <TextField label="English place" value={stop.placeEn} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, placeEn: value } : entry) })} />
                      <TextField label="French place" value={stop.placeFr} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, placeFr: value } : entry) })} />
                      <span />
                      <TextField label="English type" value={stop.typeEn} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, typeEn: value } : entry) })} />
                      <TextField label="French type" value={stop.typeFr} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, typeFr: value } : entry) })} />
                      <span />
                      <TextAreaField label="English description" value={stop.descriptionEn} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, descriptionEn: value } : entry) })} full={false} />
                      <TextAreaField label="French description" value={stop.descriptionFr} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, descriptionFr: value } : entry) })} full={false} />
                      <div className="admin-field is-full">
                        <label>Destination search</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input className="admin-input" value={stop.locationQuery} placeholder="e.g. Himarë, Albania" onChange={(event) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, locationQuery: event.target.value } : entry) })} />
                          <button
                            className="admin-button"
                            type="button"
                            disabled={searchingStop === index || stop.locationQuery.trim().length < 2}
                            onClick={async () => {
                              setSearchingStop(index);
                              setError("");
                              try {
                                const result = await geocodePlaceFn({ data: { query: stop.locationQuery } });
                                setGeocodeResults((current) => ({ ...current, [index]: result.candidates }));
                              } catch (caught) {
                                setError(caught instanceof Error ? caught.message : "Place search failed.");
                              } finally {
                                setSearchingStop(null);
                              }
                            }}
                          >
                            {searchingStop === index ? <LoaderCircle size={15} /> : <Search size={15} />} Find place
                          </button>
                        </div>
                        {geocodeResults[index]?.length > 0 && (
                          <div className="admin-geocode-results">
                            {geocodeResults[index].map((candidate) => (
                              <button
                                type="button"
                                key={candidate.osmReference}
                                onClick={() => {
                                  setTour({
                                    ...tour,
                                    itinerary: tour.itinerary.map((entry, itemIndex) =>
                                      itemIndex === index
                                        ? {
                                            ...entry,
                                            locationLabel: candidate.displayName,
                                            longitude: candidate.longitude,
                                            latitude: candidate.latitude,
                                            osmReference: candidate.osmReference,
                                          }
                                        : entry,
                                    ),
                                  });
                                  setGeocodeResults((current) => ({ ...current, [index]: [] }));
                                }}
                              >
                                <strong>{candidate.displayName}</strong>
                                <small>{candidate.type} · {candidate.latitude.toFixed(5)}, {candidate.longitude.toFixed(5)}</small>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <TextField label="Longitude" type="number" value={stop.longitude ?? ""} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, longitude: value ? Number(value) : null } : entry) })} />
                      <TextField label="Latitude" type="number" value={stop.latitude ?? ""} onChange={(value) => setTour({ ...tour, itinerary: tour.itinerary.map((entry, itemIndex) => itemIndex === index ? { ...entry, latitude: value ? Number(value) : null } : entry) })} />
                      <div className="admin-field">
                        <label>Confirmed location</label>
                        <div className="admin-notice"><MapPin size={15} /> {stop.locationLabel || "Not confirmed"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="admin-button" type="button" onClick={() => setTour({ ...tour, itinerary: [...tour.itinerary, { time: "09:00", durationMinutes: 60, typeEn: "", typeFr: "", placeEn: "", placeFr: "", descriptionEn: "", descriptionFr: "", locationQuery: "", locationLabel: "", longitude: null, latitude: null, osmReference: "", sortOrder: tour.itinerary.length }] })}>
                <Plus size={15} /> Add itinerary stop
              </button>
            </div>
          )}

          {section === "availability" && (
            <div className="admin-form-card">
              <h2>Date availability and price</h2>
              <p>Every future date is available at €{tour.basePriceEur.toFixed(2)} unless an exception is listed below.</p>
              <div className="admin-form-grid is-three">
                <TextField label="Date" type="date" value={dateDraft.date} onChange={(value) => setDateDraft({ ...dateDraft, date: value })} />
                <div className="admin-field">
                  <label>Availability</label>
                  <select className="admin-select" value={dateDraft.isAvailable ? "available" : "unavailable"} onChange={(event) => setDateDraft({ ...dateDraft, isAvailable: event.target.value === "available" })}>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <TextField label="Custom price (optional)" type="number" min={0} value={dateDraft.price} onChange={(value) => setDateDraft({ ...dateDraft, price: value })} />
              </div>
              <button
                className="admin-button"
                type="button"
                disabled={!dateDraft.date}
                onClick={() => {
                  const next = {
                    date: dateDraft.date,
                    isAvailable: dateDraft.isAvailable,
                    priceEur: dateDraft.price ? Number(dateDraft.price) : null,
                  };
                  setTour({
                    ...tour,
                    dateOverrides: [
                      ...tour.dateOverrides.filter((item) => item.date !== next.date),
                      next,
                    ].sort((left, right) => left.date.localeCompare(right.date)),
                  });
                  setDateDraft({ date: "", isAvailable: true, price: "" });
                }}
              >
                <CalendarPlus size={15} /> Add or update exception
              </button>
              {tour.dateOverrides.length > 0 && (
                <div className="admin-table-shell" style={{ marginTop: 18 }}>
                  <table className="admin-table">
                    <thead><tr><th>Date</th><th>Availability</th><th>Price</th><th /></tr></thead>
                    <tbody>
                      {tour.dateOverrides.map((item) => (
                        <tr key={item.date}>
                          <td>{item.date}</td>
                          <td>{item.isAvailable ? "Available" : "Unavailable"}</td>
                          <td>{item.priceEur == null ? "Base price" : `€${item.priceEur.toFixed(2)}`}</td>
                          <td><button className="admin-icon-button" type="button" onClick={() => setTour({ ...tour, dateOverrides: tour.dateOverrides.filter((entry) => entry.date !== item.date) })}><Trash2 size={15} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {section === "reviews" && (
            <div className="admin-form-card">
              <h2>Assign traveller reviews</h2>
              <p>Select reviews by name. Date and nation disambiguate matching names.</p>
              {referenceData.reviews.length === 0 ? (
                <div className="admin-notice">Create reviews in the Reviews section first.</div>
              ) : (
                <div className="admin-check-grid">
                  {referenceData.reviews.map((review) => (
                    <label className="admin-check" key={review.id}>
                      <input
                        type="checkbox"
                        checked={selectedReviews.has(review.id)}
                        onChange={(event) =>
                          setTour((current) => ({
                            ...current,
                            reviewIds: event.target.checked
                              ? [...current.reviewIds, review.id]
                              : current.reviewIds.filter((id) => id !== review.id),
                          }))
                        }
                      />
                      <span>{review.name} · {review.reviewDate} · {review.nationCode}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "seo" && (
            <>
              {(["en", "fr"] as const).map((locale) => (
                <div className="admin-form-card" key={locale}>
                  <h2>{locale === "en" ? "English" : "French"} search preview</h2>
                  <div className="admin-form-grid">
                    <TextField label="SEO title" value={tour.translations[locale].seoTitle} onChange={(value) => setTranslation(locale, "seoTitle", value)} />
                    <TextField label="Hero image alt text" value={tour.translations[locale].heroAlt} onChange={(value) => setTranslation(locale, "heroAlt", value)} />
                    <TextAreaField label="SEO description" value={tour.translations[locale].seoDescription} onChange={(value) => setTranslation(locale, "seoDescription", value)} />
                  </div>
                </div>
              ))}
              <div className="admin-form-card">
                <h2>Publish</h2>
                <p>Publishing validates both languages, media, classifications, weather, included items and geocoded itinerary stops.</p>
                <div className="admin-page-actions">
                  <button className="admin-button is-primary" type="button" onClick={() => void publish()} disabled={saving}>
                    <Send size={16} /> Publish both languages
                  </button>
                  {tour.status === "published" && tour.id && (
                    <button
                      className="admin-button is-danger"
                      type="button"
                      onClick={async () => {
                        await unpublishTourFn({ data: { id: tour.id! } });
                        setTour({ ...tour, status: "draft", featured: false });
                        setPublishResult(null);
                        setMessage("Tour unpublished and removed from public pages.");
                      }}
                    >
                      Unpublish
                    </button>
                  )}
                </div>
                {publishResult && (
                  <div className="admin-publish-result">
                    <strong>Live links</strong>
                    {[publishResult.englishUrl, publishResult.frenchUrl].map((url) => (
                      <div key={url} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <a href={url} target="_blank" rel="noreferrer">{url}</a>
                        <button className="admin-icon-button" type="button" aria-label="Copy link" onClick={() => void navigator.clipboard.writeText(url)}><Copy size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {(error || message) && (
            <div className={error ? "admin-form-error" : "admin-form-success"} role={error ? "alert" : "status"}>
              {error || message}
            </div>
          )}

          <div className="admin-editor-footer">
            <span className={`admin-status is-${tour.status}`}>{tour.status}</span>
            <div>
              <button className="admin-button" type="button" onClick={() => void save()} disabled={saving}>
                {saving ? <LoaderCircle size={15} /> : <Save size={15} />} Save
              </button>
              <button className="admin-button is-primary" type="button" onClick={() => void publish()} disabled={saving}>
                <Check size={15} /> Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

