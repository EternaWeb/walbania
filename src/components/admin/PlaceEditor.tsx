import { createClient } from "@supabase/supabase-js";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CircleAlert,
  ExternalLink,
  ImagePlus,
  Link2,
  LoaderCircle,
  MapPin,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
  GlobalMediaAsset,
  PlaceEditorPayload,
  PlaceFactInput,
  PlaceHighlightInput,
  PlaceMediaRole,
  PlaceTourLinkInput,
  PlaceTourReference,
} from "../../lib/places/types";
import {
  addMediaUrlFn,
  confirmMediaUploadFn,
  publishPlaceFn,
  requestMediaUploadFn,
  savePlaceFn,
  unpublishPlaceFn,
} from "../../lib/places/server";
import { AdminPageHeader } from "./AdminShell";

type ReferenceData = {
  destinations: Array<{ id: string; title: string; slug: string }>;
  tours: PlaceTourReference[];
  assets: GlobalMediaAsset[];
};

const TABS = [
  ["basics", "Basics"],
  ["translations", "English & French"],
  ["seo", "SEO"],
  ["sections", "Three story sections"],
  ["details", "Facts & highlights"],
  ["media", "Media"],
  ["tours", "Linked tours"],
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

function move<T>(items: T[], index: number, direction: number) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function PlaceEditor({
  initialPlace,
  referenceData,
}: {
  initialPlace: PlaceEditorPayload;
  referenceData: ReferenceData;
}) {
  const [place, setPlace] = useState(initialPlace);
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("basics");
  const [assets, setAssets] = useState(referenceData.assets);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [urlDraft, setUrlDraft] = useState("");
  const [creditDraft, setCreditDraft] = useState("");
  const [uploadLabel, setUploadLabel] = useState("");

  const title = place.translations.en.title || `New ${place.kind}`;
  const collection = place.kind === "destination" ? "destinations" : "attractions";
  const linkedIds = useMemo(
    () => new Set(place.tourLinks.map((item) => item.tourId)),
    [place.tourLinks],
  );
  const seoThumbnailAssignment = place.media.find((item) => item.role === "thumbnail");
  const seoThumbnailAsset = assets.find((item) => item.id === seoThumbnailAssignment?.assetId);

  const updateTranslation = (locale: "en" | "fr", key: string, value: string) => {
    setPlace((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], [key]: value },
      },
    }));
  };

  const persist = async (next = place, success = "Draft saved.") => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const saved = await savePlaceFn({ data: next });
      setPlace(saved);
      setMessage(success);
      if (!next.id && saved.id) {
        window.history.replaceState({}, "", `/admin/${collection}/${saved.id}`);
      }
      return saved;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The place could not be saved.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    const saved = await persist(place, "Content saved.");
    if (!saved?.id) return;
    setSaving(true);
    try {
      const result = await publishPlaceFn({ data: { id: saved.id } });
      if (!result.ok) {
        setError(result.problems.join(" "));
        return;
      }
      setPlace((current) => ({ ...current, status: "published" }));
      setMessage("Published in English and French.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Publishing failed.");
    } finally {
      setSaving(false);
    }
  };

  const unpublish = async () => {
    if (!place.id) return;
    setSaving(true);
    try {
      await unpublishPlaceFn({ data: { id: place.id } });
      setPlace((current) => ({ ...current, status: "draft" }));
      setMessage("Returned to draft.");
    } finally {
      setSaving(false);
    }
  };

  const assignMedia = (
    role: Extract<PlaceMediaRole, "hero" | "card" | "thumbnail">,
    assetId: string,
  ) => {
    setPlace((current) => ({
      ...current,
      media: [
        ...current.media.filter((item) => item.role !== role),
        ...(assetId
          ? [
              {
                assetId,
                role,
                altEn: current.translations.en.heroAlt,
                altFr: current.translations.fr.heroAlt,
                sortOrder: 0,
              } as const,
            ]
          : []),
      ],
    }));
  };

  const registerUrl = async () => {
    if (!urlDraft.trim()) return;
    setSaving(true);
    setError("");
    try {
      const asset = await addMediaUrlFn({
        data: { publicUrl: urlDraft.trim(), creditName: creditDraft.trim(), creditUrl: "" },
      });
      setAssets((current) => [asset, ...current.filter((item) => item.id !== asset.id)]);
      setUrlDraft("");
      setCreditDraft("");
      setMessage("Image URL added to the site-wide library.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The URL could not be registered.");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      setError("Use a JPEG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("The image must be 10 MB or smaller.");
      return;
    }
    setSaving(true);
    setError("");
    setUploadLabel("Uploading image…");
    try {
      const ticket = await requestMediaUploadFn({
        data: {
          fileName: file.name,
          contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/avif",
          size: file.size,
        },
      });
      const client = createClient(ticket.url, ticket.publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      });
      const { error: uploadError } = await client.storage
        .from("site-media")
        .uploadToSignedUrl(ticket.path, ticket.token, file, {
          contentType: file.type,
          cacheControl: "31536000",
        });
      if (uploadError) throw uploadError;
      const asset = await confirmMediaUploadFn({ data: { path: ticket.path } });
      setAssets((current) => [asset, ...current.filter((item) => item.id !== asset.id)]);
      setMessage("Upload added to the site-wide media library.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The upload failed.");
    } finally {
      setSaving(false);
      setUploadLabel("");
    }
  };

  const toggleTour = (tourId: string) => {
    setPlace((current) => {
      const exists = current.tourLinks.some((item) => item.tourId === tourId);
      return {
        ...current,
        tourLinks: exists
          ? current.tourLinks.filter((item) => item.tourId !== tourId)
          : [
              ...current.tourLinks,
              {
                tourId,
                relationship: current.kind === "destination" ? "area" : "visit",
                source: referenceData.tours.find((tour) => tour.id === tourId)?.itineraryMatches
                  .length
                  ? "itinerary"
                  : "manual",
                visible: true,
                sortOrder: current.tourLinks.length,
              },
            ],
      };
    });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow={place.kind === "destination" ? "Destinations" : "Attractions"}
        title={title}
        description="Bilingual place content, exactly three story sections, reusable media and explicit tour links."
        actions={
          <>
            {place.status === "published" && place.id ? (
              <button className="admin-button" type="button" onClick={unpublish} disabled={saving}>
                Return to draft
              </button>
            ) : null}
            <button
              className="admin-button"
              type="button"
              onClick={() => void persist()}
              disabled={saving}
            >
              <Save size={16} /> Save
            </button>
            <button
              className="admin-button is-primary"
              type="button"
              onClick={publish}
              disabled={saving}
            >
              <Send size={16} /> Publish
            </button>
          </>
        }
      />

      {error ? (
        <div className="admin-editor-notice is-error">
          <CircleAlert size={19} />
          <div>
            <strong>Needs attention</strong>
            <p>{error}</p>
          </div>
        </div>
      ) : null}
      {message ? (
        <div className="admin-editor-notice">
          <Check size={19} />
          <div>
            <strong>Done</strong>
            <p>{message}</p>
          </div>
        </div>
      ) : null}

      <div className="admin-editor-layout">
        <nav className="admin-editor-nav" aria-label="Place editor sections">
          {TABS.map(([id, label]) => (
            <button
              type="button"
              className={tab === id ? "is-current" : ""}
              onClick={() => setTab(id)}
              key={id}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-editor-content">
          {tab === "basics" ? (
            <section className="admin-form-card">
              <h2>Place and map</h2>
              <div className="admin-form-grid is-three">
                <div className="admin-field">
                  <label>Type</label>
                  <input value={place.kind} disabled />
                </div>
                {place.kind === "attraction" ? (
                  <div className="admin-field">
                    <label>Parent destination</label>
                    <select
                      value={place.parentDestinationId ?? ""}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          parentDestinationId: event.target.value || null,
                        }))
                      }
                    >
                      <option value="">Choose destination</option>
                      {referenceData.destinations.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                <div className="admin-field">
                  <label>Map zoom</label>
                  <input
                    type="number"
                    min="5"
                    max="18"
                    step="0.5"
                    value={place.mapZoom}
                    onChange={(event) =>
                      setPlace((current) => ({ ...current, mapZoom: Number(event.target.value) }))
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={place.longitude ?? ""}
                    onChange={(event) =>
                      setPlace((current) => ({
                        ...current,
                        longitude: event.target.value ? Number(event.target.value) : null,
                      }))
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={place.latitude ?? ""}
                    onChange={(event) =>
                      setPlace((current) => ({
                        ...current,
                        latitude: event.target.value ? Number(event.target.value) : null,
                      }))
                    }
                  />
                </div>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={place.featured}
                    onChange={(event) =>
                      setPlace((current) => ({ ...current, featured: event.target.checked }))
                    }
                  />
                  <span>Featured place</span>
                </label>
              </div>
              <p className="admin-help">
                <MapPin size={14} /> Coordinates power the reusable Albania map and itinerary
                suggestions. Suggestions are never published until you link the tour.
              </p>
            </section>
          ) : null}

          {tab === "translations" ? (
            <div className="admin-translation-grid">
              {(["en", "fr"] as const).map((locale) => {
                const value = place.translations[locale];
                const language = locale === "en" ? "English" : "French";
                return (
                  <section className="admin-form-card" key={locale}>
                    <h2>{language}</h2>
                    <div className="admin-form-grid">
                      <div className="admin-field">
                        <label>Title</label>
                        <input
                          value={value.title}
                          onChange={(event) => {
                            updateTranslation(locale, "title", event.target.value);
                            if (!value.slug)
                              updateTranslation(locale, "slug", slugify(event.target.value));
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Slug</label>
                        <input
                          value={value.slug}
                          onChange={(event) =>
                            updateTranslation(locale, "slug", slugify(event.target.value))
                          }
                        />
                      </div>
                      <div className="admin-field is-full">
                        <label>Hero introduction</label>
                        <textarea
                          rows={4}
                          value={value.heroIntro}
                          onChange={(event) =>
                            updateTranslation(locale, "heroIntro", event.target.value)
                          }
                        />
                      </div>
                      <div className="admin-field is-full">
                        <label>Hero alt text</label>
                        <input
                          value={value.heroAlt}
                          onChange={(event) =>
                            updateTranslation(locale, "heroAlt", event.target.value)
                          }
                        />
                      </div>
                      <div className="admin-field is-full">
                        <label>Three-card story title</label>
                        <input
                          value={value.storyTitle}
                          onChange={(event) =>
                            updateTranslation(locale, "storyTitle", event.target.value)
                          }
                        />
                      </div>
                      <div className="admin-field is-full">
                        <label>Three-card story introduction</label>
                        <textarea
                          rows={3}
                          value={value.storyIntro}
                          onChange={(event) =>
                            updateTranslation(locale, "storyIntro", event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          ) : null}

          {tab === "seo" ? (
            <div className="admin-place-section-list">
              <section className="admin-form-card">
                <h2>Search appearance</h2>
                <p className="admin-help">
                  Give every place a distinct, concise title. Use the format “Place — Unique short
                  descriptor | Wonder Albania”, for example “Berat — The City of 1000 Windows |
                  Wonder Albania”.
                </p>
                <div className="admin-translation-grid">
                  {(["en", "fr"] as const).map((locale) => {
                    const value = place.translations[locale];
                    const language = locale === "en" ? "English" : "French";
                    return (
                      <div className="admin-form-grid" key={locale}>
                        <div className="admin-field is-full">
                          <label>{language} SEO title</label>
                          <input
                            value={value.seoTitle}
                            onChange={(event) =>
                              updateTranslation(locale, "seoTitle", event.target.value)
                            }
                          />
                          <small>
                            {value.seoTitle.length} characters · keep it concise and unique
                          </small>
                        </div>
                        <div className="admin-field is-full">
                          <label>{language} meta description</label>
                          <textarea
                            rows={4}
                            value={value.seoDescription}
                            onChange={(event) =>
                              updateTranslation(locale, "seoDescription", event.target.value)
                            }
                          />
                          <small>{value.seoDescription.length} characters</small>
                        </div>
                        <div className="admin-field is-full">
                          <label>{language} search preview</label>
                          <div className="admin-seo-preview">
                            <strong>{value.seoTitle || value.title || "Untitled place"}</strong>
                            <span>
                              wonderalbania.com/
                              {place.kind === "destination" ? "destinations" : "attractions"}/
                              {value.slug || "place-slug"}
                            </span>
                            <p>{value.seoDescription || "Add a concise page description."}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="admin-form-card">
                <h2>SEO and social thumbnail</h2>
                <p className="admin-help">
                  Choose a relevant landscape image for search previews, social sharing and
                  structured data. Add a URL or upload a new image in Media, then select it here.
                </p>
                <div className="admin-place-media-role">
                  {seoThumbnailAsset ? (
                    <img src={seoThumbnailAsset.publicUrl} alt="" />
                  ) : (
                    <div className="admin-media-fallback">
                      <ImagePlus size={24} />
                    </div>
                  )}
                  <div className="admin-field">
                    <label>Thumbnail asset</label>
                    <select
                      value={seoThumbnailAssignment?.assetId ?? ""}
                      onChange={(event) => assignMedia("thumbnail", event.target.value)}
                    >
                      <option value="">Choose image</option>
                      {assets.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.creditName || item.publicUrl}
                        </option>
                      ))}
                    </select>
                  </div>
                  {seoThumbnailAssignment ? (
                    <div className="admin-form-grid">
                      <div className="admin-field">
                        <label>English thumbnail alt text</label>
                        <input
                          value={seoThumbnailAssignment.altEn}
                          onChange={(event) =>
                            setPlace((current) => ({
                              ...current,
                              media: current.media.map((item) =>
                                item.role === "thumbnail"
                                  ? { ...item, altEn: event.target.value }
                                  : item,
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className="admin-field">
                        <label>French thumbnail alt text</label>
                        <input
                          value={seoThumbnailAssignment.altFr}
                          onChange={(event) =>
                            setPlace((current) => ({
                              ...current,
                              media: current.media.map((item) =>
                                item.role === "thumbnail"
                                  ? { ...item, altFr: event.target.value }
                                  : item,
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ) : null}
                  <button type="button" className="admin-button" onClick={() => setTab("media")}>
                    <ImagePlus size={15} /> Add or upload image
                  </button>
                </div>
              </section>
            </div>
          ) : null}

          {tab === "sections" ? (
            <div className="admin-place-section-list">
              {place.sections.map((section, index) => (
                <section className="admin-form-card" key={index}>
                  <h2>Story section {index + 1}</h2>
                  <div className="admin-form-grid">
                    <div className="admin-field">
                      <label>English title</label>
                      <input
                        value={section.titleEn}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, titleEn: event.target.value } : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label>French title</label>
                      <input
                        value={section.titleFr}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, titleFr: event.target.value } : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label>English body</label>
                      <textarea
                        rows={7}
                        value={section.bodyEn}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, bodyEn: event.target.value } : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label>French body</label>
                      <textarea
                        rows={7}
                        value={section.bodyFr}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, bodyFr: event.target.value } : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label>English supporting text</label>
                      <textarea
                        rows={4}
                        value={section.secondaryBodyEn}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, secondaryBodyEn: event.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label>French supporting text</label>
                      <textarea
                        rows={4}
                        value={section.secondaryBodyFr}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, secondaryBodyFr: event.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field is-full">
                      <label>Section image</label>
                      <select
                        value={section.mediaAssetId ?? ""}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, mediaAssetId: event.target.value || null }
                                : item,
                            ),
                          }))
                        }
                      >
                        <option value="">Choose from media library</option>
                        {assets.map((asset) => (
                          <option value={asset.id} key={asset.id}>
                            {asset.creditName || asset.publicUrl}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-field">
                      <label>English image alt text</label>
                      <input
                        value={section.imageAltEn}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, imageAltEn: event.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="admin-field">
                      <label>French image alt text</label>
                      <input
                        value={section.imageAltFr}
                        onChange={(event) =>
                          setPlace((current) => ({
                            ...current,
                            sections: current.sections.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, imageAltFr: event.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          {tab === "details" ? (
            <section className="admin-form-card">
              <h2>Facts and highlights</h2>
              <div className="admin-repeat-list">
                {place.facts.map((fact, index) => (
                  <div className="admin-repeat-row is-wide" key={`fact-${index}`}>
                    <select
                      value={fact.groupKey}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          facts: current.facts.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  groupKey: event.target.value as PlaceFactInput["groupKey"],
                                }
                              : item,
                          ),
                        }))
                      }
                    >
                      <option value="quick">Quick fact</option>
                      <option value="weather">Weather</option>
                    </select>
                    <input
                      placeholder="Icon key"
                      value={fact.iconKey}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          facts: current.facts.map((item, i) =>
                            i === index ? { ...item, iconKey: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <input
                      placeholder="Value"
                      value={fact.value}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          facts: current.facts.map((item, i) =>
                            i === index ? { ...item, value: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <input
                      placeholder="English label"
                      value={fact.labelEn}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          facts: current.facts.map((item, i) =>
                            i === index ? { ...item, labelEn: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <input
                      placeholder="French label"
                      value={fact.labelFr}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          facts: current.facts.map((item, i) =>
                            i === index ? { ...item, labelFr: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="admin-icon-button"
                      onClick={() =>
                        setPlace((current) => ({
                          ...current,
                          facts: current.facts.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="admin-button"
                onClick={() =>
                  setPlace((current) => ({
                    ...current,
                    facts: [
                      ...current.facts,
                      {
                        groupKey: "quick",
                        iconKey: "map",
                        value: "",
                        labelEn: "",
                        labelFr: "",
                        sortOrder: current.facts.length,
                      },
                    ],
                  }))
                }
              >
                <Plus size={15} /> Add fact
              </button>
              <div className="admin-repeat-list admin-place-highlights">
                {place.highlights.map((highlight, index) => (
                  <div className="admin-repeat-row is-wide" key={`highlight-${index}`}>
                    <input
                      placeholder="Icon key"
                      value={highlight.iconKey}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          highlights: current.highlights.map((item, i) =>
                            i === index ? { ...item, iconKey: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <input
                      placeholder="English label"
                      value={highlight.labelEn}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          highlights: current.highlights.map((item, i) =>
                            i === index ? { ...item, labelEn: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <input
                      placeholder="French label"
                      value={highlight.labelFr}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          highlights: current.highlights.map((item, i) =>
                            i === index ? { ...item, labelFr: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <input
                      placeholder="English text"
                      value={highlight.textEn}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          highlights: current.highlights.map((item, i) =>
                            i === index ? { ...item, textEn: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <input
                      placeholder="French text"
                      value={highlight.textFr}
                      onChange={(event) =>
                        setPlace((current) => ({
                          ...current,
                          highlights: current.highlights.map((item, i) =>
                            i === index ? { ...item, textFr: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="admin-icon-button"
                      onClick={() =>
                        setPlace((current) => ({
                          ...current,
                          highlights: current.highlights.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="admin-button"
                onClick={() =>
                  setPlace((current) => ({
                    ...current,
                    highlights: [
                      ...current.highlights,
                      {
                        iconKey: "sparkles",
                        labelEn: "",
                        labelFr: "",
                        textEn: "",
                        textFr: "",
                        sortOrder: current.highlights.length,
                      } as PlaceHighlightInput,
                    ],
                  }))
                }
              >
                <Plus size={15} /> Add highlight
              </button>
            </section>
          ) : null}

          {tab === "media" ? (
            <section className="admin-form-card">
              <h2>Site-wide media library</h2>
              <p className="admin-help">
                Uploads and external URLs are registered once, then reusable by tours, destinations
                and attractions.
              </p>
              <div className="admin-media-add-row">
                <input
                  type="url"
                  placeholder="https://… image URL"
                  value={urlDraft}
                  onChange={(event) => setUrlDraft(event.target.value)}
                />
                <input
                  placeholder="Credit / source"
                  value={creditDraft}
                  onChange={(event) => setCreditDraft(event.target.value)}
                />
                <button
                  type="button"
                  className="admin-button"
                  onClick={registerUrl}
                  disabled={saving}
                >
                  <Link2 size={15} /> Add URL
                </button>
                <label className="admin-button">
                  <Upload size={15} /> {uploadLabel || "Upload"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void upload(file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>
              <div className="admin-form-grid">
                {(["hero", "card", "thumbnail"] as const).map((role) => {
                  const assigned = place.media.find((item) => item.role === role);
                  const asset = assets.find((item) => item.id === assigned?.assetId);
                  return (
                    <div className="admin-place-media-role" key={role}>
                      <h3>
                        {role === "hero"
                          ? "Hero image"
                          : role === "card"
                            ? "Listing card image"
                            : "SEO thumbnail"}
                      </h3>
                      {asset ? (
                        <img src={asset.publicUrl} alt="" />
                      ) : (
                        <div className="admin-media-fallback">
                          <ImagePlus size={24} />
                        </div>
                      )}
                      <div className="admin-field">
                        <label>Library asset</label>
                        <select
                          value={assigned?.assetId ?? ""}
                          onChange={(event) => assignMedia(role, event.target.value)}
                        >
                          <option value="">Choose image</option>
                          {assets.map((item) => (
                            <option value={item.id} key={item.id}>
                              {item.creditName || item.publicUrl}
                            </option>
                          ))}
                        </select>
                      </div>
                      {assigned ? (
                        <>
                          <div className="admin-field">
                            <label>English alt text</label>
                            <input
                              value={assigned.altEn}
                              onChange={(event) =>
                                setPlace((current) => ({
                                  ...current,
                                  media: current.media.map((item) =>
                                    item.role === role
                                      ? { ...item, altEn: event.target.value }
                                      : item,
                                  ),
                                }))
                              }
                            />
                          </div>
                          <div className="admin-field">
                            <label>French alt text</label>
                            <input
                              value={assigned.altFr}
                              onChange={(event) =>
                                setPlace((current) => ({
                                  ...current,
                                  media: current.media.map((item) =>
                                    item.role === role
                                      ? { ...item, altFr: event.target.value }
                                      : item,
                                  ),
                                }))
                              }
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div className="admin-media-asset-grid admin-place-library-grid">
                {assets.map((asset) => (
                  <button
                    type="button"
                    className="admin-media-asset"
                    key={asset.id}
                    onClick={() =>
                      assignMedia(
                        place.media.some((item) => item.role === "hero") ? "card" : "hero",
                        asset.id,
                      )
                    }
                  >
                    <img src={asset.publicUrl} alt="" />
                    <div>
                      <strong>{asset.creditName || "Reusable image"}</strong>
                      <span>{asset.sourceKind}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {tab === "tours" ? (
            <section className="admin-form-card">
              <h2>Linked tours</h2>
              <p className="admin-help">
                Coordinate and itinerary matches are suggestions. Check a tour to confirm the public
                connection. Attraction links also appear on the parent destination.
              </p>
              <div className="admin-tour-link-list">
                {referenceData.tours.map((tour) => {
                  const link = place.tourLinks.find((item) => item.tourId === tour.id);
                  const linkIndex = place.tourLinks.findIndex((item) => item.tourId === tour.id);
                  return (
                    <article className={linkedIds.has(tour.id) ? "is-linked" : ""} key={tour.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={linkedIds.has(tour.id)}
                          onChange={() => toggleTour(tour.id)}
                        />
                        <span>{tour.image ? <img src={tour.image} alt="" /> : null}</span>
                        <div>
                          <strong>{tour.title}</strong>
                          <small>
                            {tour.duration} · {tour.typeName} · {tour.status}
                          </small>
                          {tour.itineraryMatches.length ? (
                            <em>
                              <MapPin size={12} /> Suggested: {tour.itineraryMatches[0].label} (
                              {tour.itineraryMatches[0].distanceKm.toFixed(1)} km)
                            </em>
                          ) : null}
                        </div>
                      </label>
                      {link ? (
                        <div className="admin-tour-link-actions">
                          <select
                            value={link.relationship}
                            onChange={(event) =>
                              setPlace((current) => ({
                                ...current,
                                tourLinks: current.tourLinks.map((item) =>
                                  item.tourId === tour.id
                                    ? {
                                        ...item,
                                        relationship: event.target
                                          .value as PlaceTourLinkInput["relationship"],
                                      }
                                    : item,
                                ),
                              }))
                            }
                          >
                            <option value="start">Starts here</option>
                            <option value="visit">Visits</option>
                            <option value="end">Ends here</option>
                            <option value="area">In area</option>
                          </select>
                          <label>
                            <input
                              type="checkbox"
                              checked={link.visible}
                              onChange={(event) =>
                                setPlace((current) => ({
                                  ...current,
                                  tourLinks: current.tourLinks.map((item) =>
                                    item.tourId === tour.id
                                      ? { ...item, visible: event.target.checked }
                                      : item,
                                  ),
                                }))
                              }
                            />{" "}
                            Visible
                          </label>
                          <span>{link.source}</span>
                          <button
                            type="button"
                            className="admin-icon-button"
                            disabled={linkIndex <= 0}
                            onClick={() =>
                              setPlace((current) => ({
                                ...current,
                                tourLinks: move(current.tourLinks, linkIndex, -1),
                              }))
                            }
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-button"
                            disabled={linkIndex >= place.tourLinks.length - 1}
                            onClick={() =>
                              setPlace((current) => ({
                                ...current,
                                tourLinks: move(current.tourLinks, linkIndex, 1),
                              }))
                            }
                          >
                            <ArrowDown size={15} />
                          </button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>

      <footer className="admin-editor-footer">
        <div>
          <span className={`admin-status is-${place.status}`}>{place.status}</span>
          {saving ? (
            <span>
              <LoaderCircle className="admin-spin" size={16} /> Saving…
            </span>
          ) : null}
        </div>
        <div>
          {place.status === "published" && place.id ? (
            <a
              className="admin-button"
              href={
                place.kind === "destination"
                  ? `/destinations/${place.translations.en.slug}`
                  : `/attractions/${referenceData.destinations.find((item) => item.id === place.parentDestinationId)?.slug}/${place.translations.en.slug}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={15} /> Open page
            </a>
          ) : null}
          <button
            className="admin-button is-primary"
            type="button"
            onClick={() => void persist()}
            disabled={saving}
          >
            <Save size={16} /> Save changes
          </button>
        </div>
      </footer>
    </>
  );
}
