import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminSession, setAdminNoIndexHeaders } from "../admin/auth";
import {
  createAdminSupabaseClient,
  createPublicSupabaseClient,
  getSiteUrl,
  readPublicSupabaseConfig,
} from "../supabase";
import {
  publicTourLookupSchema,
  reviewInputSchema,
  taxonomyInputSchema,
  tourEditorSchema,
  validateForPublish,
} from "./schemas";
import type {
  GeocodeCandidate,
  PublishResult,
  RelatedTour,
  ReviewRecord,
  TaxonomyItem,
  TaxonomyKind,
  TourDateOverride,
  TourEditorPayload,
  TourListingCard,
  TourListingData,
  TourListRow,
  TourLocale,
  TourStatus,
  TourViewModel,
} from "./types";

const setPublicNoCacheHeader = createServerOnlyFn(async () => {
  const { setResponseHeader } = await import("@tanstack/react-start/server");
  setResponseHeader("Cache-Control", "public, max-age=0, must-revalidate");
});

type SupabaseClientLike =
  | ReturnType<typeof createAdminSupabaseClient>
  | ReturnType<typeof createPublicSupabaseClient>;

function throwOnError(error: { message?: string } | null) {
  if (error) throw new Error(error.message || "Supabase request failed.");
}

function minutesDurationLabel(minutes: number, locale: TourLocale) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours === 0) return locale === "fr" ? `${remaining} min` : `${remaining} min`;
  if (remaining === 0) {
    return locale === "fr"
      ? `${hours} ${hours === 1 ? "heure" : "heures"}`
      : `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  return `${hours} h ${remaining} min`;
}

function tourDurationLabel(value: number, unit: "hours" | "days", locale: TourLocale) {
  const formatted = Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, "");
  if (locale === "fr") {
    if (unit === "days") return `${formatted} ${value === 1 ? "jour" : "jours"}`;
    return `${formatted} ${value === 1 ? "heure" : "heures"}`;
  }
  if (unit === "days") return `${formatted} ${value === 1 ? "day" : "days"}`;
  return `${formatted} ${value === 1 ? "hour" : "hours"}`;
}

function localizedPath(locale: TourLocale, slug: string) {
  return locale === "fr" ? `/fr/${slug}` : `/${slug}`;
}

async function loadTaxonomy(client: SupabaseClientLike, kind: TaxonomyKind) {
  const { data, error } = await client
    .from(kind)
    .select("id,key,name_en,name_fr,active")
    .order("name_en");
  throwOnError(error);
  return (data ?? []).map(
    (row): TaxonomyItem => ({
      id: row.id,
      key: row.key,
      nameEn: row.name_en,
      nameFr: row.name_fr,
      active: row.active,
    }),
  );
}

async function loadReviews(client: SupabaseClientLike) {
  const { data, error } = await client.from("reviews").select("*").order("review_date", {
    ascending: false,
  });
  throwOnError(error);
  return (data ?? []).map(
    (row): ReviewRecord => ({
      id: row.id,
      name: row.name,
      reviewDate: row.review_date,
      nationCode: row.nation_code,
      rating: row.rating,
      travelType: row.travel_type,
      originalLanguage: row.original_language,
      bodyOriginal: row.body_original,
      bodyEn: row.body_en,
      bodyFr: row.body_fr,
      createdAt: row.created_at,
    }),
  );
}

async function fetchTourGraph(client: SupabaseClientLike, tourId: string) {
  const [
    tourResult,
    translationsResult,
    categoriesResult,
    highlightsResult,
    mediaResult,
    listItemsResult,
    weatherResult,
    faqsResult,
    itineraryResult,
    dateOverridesResult,
    reviewsResult,
  ] = await Promise.all([
    client.from("tours").select("*").eq("id", tourId).maybeSingle(),
    client.from("tour_translations").select("*").eq("tour_id", tourId).order("locale"),
    client.from("tour_categories").select("category_id").eq("tour_id", tourId),
    client.from("tour_highlights").select("*").eq("tour_id", tourId).order("sort_order"),
    client.from("tour_media").select("*").eq("tour_id", tourId).order("sort_order"),
    client.from("tour_list_items").select("*").eq("tour_id", tourId).order("sort_order"),
    client.from("tour_weather_stats").select("*").eq("tour_id", tourId).order("sort_order"),
    client.from("tour_faqs").select("*").eq("tour_id", tourId).order("sort_order"),
    client.from("tour_itinerary_stops").select("*").eq("tour_id", tourId).order("sort_order"),
    client.from("tour_date_overrides").select("*").eq("tour_id", tourId).order("date"),
    client
      .from("tour_reviews")
      .select("review_id,sort_order,reviews(*)")
      .eq("tour_id", tourId)
      .order("sort_order"),
  ]);

  for (const result of [
    tourResult,
    translationsResult,
    categoriesResult,
    highlightsResult,
    mediaResult,
    listItemsResult,
    weatherResult,
    faqsResult,
    itineraryResult,
    dateOverridesResult,
    reviewsResult,
  ]) {
    throwOnError(result.error);
  }
  if (!tourResult.data) return null;

  return {
    tour: tourResult.data,
    translations: translationsResult.data ?? [],
    categoryIds: (categoriesResult.data ?? []).map((row) => row.category_id),
    highlights: highlightsResult.data ?? [],
    media: mediaResult.data ?? [],
    listItems: listItemsResult.data ?? [],
    weatherStats: weatherResult.data ?? [],
    faqs: faqsResult.data ?? [],
    itinerary: itineraryResult.data ?? [],
    dateOverrides: dateOverridesResult.data ?? [],
    reviews: reviewsResult.data ?? [],
  };
}

function graphToEditor(graph: NonNullable<Awaited<ReturnType<typeof fetchTourGraph>>>) {
  const translation = (locale: TourLocale) => {
    const row = graph.translations.find((item) => item.locale === locale);
    return {
      locale,
      slug: row?.slug ?? "",
      title: row?.title ?? "",
      seoTitle: row?.seo_title ?? "",
      seoDescription: row?.seo_description ?? "",
      heroBadge: row?.hero_badge ?? "",
      locationLabel: row?.location_label ?? "",
      heroIntro: row?.hero_intro ?? "",
      overviewTitle: row?.overview_title ?? "",
      overviewSummary: row?.overview_summary ?? "",
      overviewBody: row?.overview_body ?? "",
      bestSeasonTitle: row?.best_season_title ?? "",
      bestSeasonBody: row?.best_season_body ?? "",
      routeTitle: row?.route_title ?? "",
      routeDescription: row?.route_description ?? "",
      cancellationSummary: row?.cancellation_summary ?? "",
      heroAlt: row?.hero_alt ?? "",
    };
  };
  const tour = graph.tour;
  return {
    id: tour.id,
    status: tour.status,
    featured: tour.featured,
    basePriceEur: Number(tour.base_price_eur),
    discountPercent: tour.discount_percent,
    defaultAvailable: tour.default_available,
    durationValue: Number(tour.duration_value),
    durationUnit: tour.duration_unit,
    maxGroupSize: tour.max_group_size,
    languageCodes: tour.language_codes ?? [],
    startPlace: tour.start_place,
    endPlace: tour.end_place,
    accessibilityEn: tour.accessibility_en,
    accessibilityFr: tour.accessibility_fr,
    regionEn: tour.region_en,
    regionFr: tour.region_fr,
    routeDistanceKm: tour.route_distance_km === null ? null : Number(tour.route_distance_km),
    tourTypeId: tour.tour_type_id,
    difficultyId: tour.difficulty_id,
    categoryIds: graph.categoryIds,
    translations: { en: translation("en"), fr: translation("fr") },
    highlights: graph.highlights.map((row) => ({
      id: row.id,
      iconKey: row.icon_key,
      labelEn: row.label_en,
      labelFr: row.label_fr,
      textEn: row.text_en,
      textFr: row.text_fr,
      sortOrder: row.sort_order,
    })),
    media: graph.media.map((row) => ({
      id: row.id,
      role: row.role,
      storagePath: row.storage_path,
      publicUrl: row.public_url,
      altEn: row.alt_en,
      altFr: row.alt_fr,
      sortOrder: row.sort_order,
    })),
    listItems: graph.listItems.map((row) => ({
      id: row.id,
      kind: row.kind,
      textEn: row.text_en,
      textFr: row.text_fr,
      sortOrder: row.sort_order,
    })),
    weatherStats: graph.weatherStats.map((row) => ({
      id: row.id,
      iconKey: row.icon_key,
      value: row.value,
      labelEn: row.label_en,
      labelFr: row.label_fr,
      sortOrder: row.sort_order,
    })),
    faqs: graph.faqs.map((row) => ({
      id: row.id,
      questionEn: row.question_en,
      questionFr: row.question_fr,
      answerEn: row.answer_en,
      answerFr: row.answer_fr,
      sortOrder: row.sort_order,
    })),
    itinerary: graph.itinerary.map((row) => ({
      id: row.id,
      time: String(row.start_time).slice(0, 5),
      durationMinutes: row.duration_minutes,
      typeEn: row.type_en,
      typeFr: row.type_fr,
      placeEn: row.place_en,
      placeFr: row.place_fr,
      descriptionEn: row.description_en,
      descriptionFr: row.description_fr,
      locationQuery: row.location_query,
      locationLabel: row.location_label,
      longitude: row.longitude,
      latitude: row.latitude,
      osmReference: row.osm_reference,
      sortOrder: row.sort_order,
    })),
    dateOverrides: graph.dateOverrides.map(
      (row): TourDateOverride => ({
        date: row.date,
        isAvailable: row.is_available,
        priceEur: row.price_eur === null ? null : Number(row.price_eur),
      }),
    ),
    reviewIds: graph.reviews.map((row) => row.review_id),
  } satisfies TourEditorPayload;
}

async function replaceRows(
  client: ReturnType<typeof createAdminSupabaseClient>,
  table: string,
  tourId: string,
  rows: Array<Record<string, unknown>>,
) {
  const { error: deleteError } = await client.from(table).delete().eq("tour_id", tourId);
  throwOnError(deleteError);
  if (rows.length === 0) return;
  const { error: insertError } = await client.from(table).insert(rows);
  throwOnError(insertError);
}

async function saveTour(input: TourEditorPayload) {
  const client = createAdminSupabaseClient();
  const existingGraph = input.id ? await fetchTourGraph(client, input.id) : null;
  const existingStatus: TourStatus = existingGraph?.tour.status ?? "draft";

  if (input.featured) {
    const { error } = await client
      .from("tours")
      .update({ featured: false })
      .neq("id", input.id ?? "00000000-0000-0000-0000-000000000000");
    throwOnError(error);
  }

  const tourRow = {
    status: existingStatus,
    featured: input.featured,
    base_price_eur: input.basePriceEur,
    discount_percent: input.discountPercent,
    default_available: input.defaultAvailable,
    duration_value: input.durationValue,
    duration_unit: input.durationUnit,
    max_group_size: input.maxGroupSize,
    language_codes: input.languageCodes,
    start_place: input.startPlace,
    end_place: input.endPlace,
    accessibility_en: input.accessibilityEn,
    accessibility_fr: input.accessibilityFr,
    region_en: input.regionEn,
    region_fr: input.regionFr,
    route_distance_km: input.routeDistanceKm,
    tour_type_id: input.tourTypeId,
    difficulty_id: input.difficultyId,
  };

  let tourId = input.id;
  if (tourId) {
    const { error } = await client.from("tours").update(tourRow).eq("id", tourId);
    throwOnError(error);
  } else {
    const { data, error } = await client.from("tours").insert(tourRow).select("id").single();
    throwOnError(error);
    tourId = data!.id;
  }
  if (!tourId) throw new Error("Tour id was not returned after saving.");

  for (const locale of ["en", "fr"] as const) {
    const current = existingGraph?.translations.find((item) => item.locale === locale);
    const next = input.translations[locale];
    if (
      existingStatus === "published" &&
      current?.slug &&
      next.slug &&
      current.slug !== next.slug
    ) {
      const { error } = await client
        .from("tour_slug_redirects")
        .upsert(
          { tour_id: tourId, locale, old_slug: current.slug },
          { onConflict: "locale,old_slug" },
        );
      throwOnError(error);
    }
    const { error } = await client.from("tour_translations").upsert(
      {
        tour_id: tourId,
        locale,
        slug: next.slug,
        title: next.title,
        seo_title: next.seoTitle,
        seo_description: next.seoDescription,
        hero_badge: next.heroBadge,
        location_label: next.locationLabel,
        hero_intro: next.heroIntro,
        overview_title: next.overviewTitle,
        overview_summary: next.overviewSummary,
        overview_body: next.overviewBody,
        best_season_title: next.bestSeasonTitle,
        best_season_body: next.bestSeasonBody,
        route_title: next.routeTitle,
        route_description: next.routeDescription,
        cancellation_summary: next.cancellationSummary,
        hero_alt: next.heroAlt,
      },
      { onConflict: "tour_id,locale" },
    );
    throwOnError(error);
  }

  await replaceRows(
    client,
    "tour_categories",
    tourId,
    input.categoryIds.map((categoryId) => ({ tour_id: tourId, category_id: categoryId })),
  );
  await replaceRows(
    client,
    "tour_highlights",
    tourId,
    input.highlights.map((item, index) => ({
      tour_id: tourId,
      icon_key: item.iconKey,
      label_en: item.labelEn,
      label_fr: item.labelFr,
      text_en: item.textEn,
      text_fr: item.textFr,
      sort_order: index,
    })),
  );
  await replaceRows(
    client,
    "tour_media",
    tourId,
    input.media.map((item, index) => ({
      tour_id: tourId,
      role: item.role,
      storage_path: item.storagePath,
      public_url: item.publicUrl,
      alt_en: item.altEn,
      alt_fr: item.altFr,
      sort_order: item.role === "hero" ? 0 : index,
    })),
  );
  await replaceRows(
    client,
    "tour_list_items",
    tourId,
    input.listItems.map((item, index) => ({
      tour_id: tourId,
      kind: item.kind,
      text_en: item.textEn,
      text_fr: item.textFr,
      sort_order: index,
    })),
  );
  await replaceRows(
    client,
    "tour_weather_stats",
    tourId,
    input.weatherStats.map((item, index) => ({
      tour_id: tourId,
      icon_key: item.iconKey,
      value: item.value,
      label_en: item.labelEn,
      label_fr: item.labelFr,
      sort_order: index,
    })),
  );
  await replaceRows(
    client,
    "tour_faqs",
    tourId,
    input.faqs.map((item, index) => ({
      tour_id: tourId,
      question_en: item.questionEn,
      question_fr: item.questionFr,
      answer_en: item.answerEn,
      answer_fr: item.answerFr,
      sort_order: index,
    })),
  );
  await replaceRows(
    client,
    "tour_itinerary_stops",
    tourId,
    input.itinerary.map((item, index) => ({
      tour_id: tourId,
      start_time: item.time,
      duration_minutes: item.durationMinutes,
      type_en: item.typeEn,
      type_fr: item.typeFr,
      place_en: item.placeEn,
      place_fr: item.placeFr,
      description_en: item.descriptionEn,
      description_fr: item.descriptionFr,
      location_query: item.locationQuery,
      location_label: item.locationLabel,
      longitude: item.longitude,
      latitude: item.latitude,
      osm_reference: item.osmReference,
      sort_order: index,
    })),
  );
  await replaceRows(
    client,
    "tour_date_overrides",
    tourId,
    input.dateOverrides.map((item) => ({
      tour_id: tourId,
      date: item.date,
      is_available: item.isAvailable,
      price_eur: item.priceEur,
    })),
  );
  await replaceRows(
    client,
    "tour_reviews",
    tourId,
    input.reviewIds.map((reviewId, index) => ({
      tour_id: tourId,
      review_id: reviewId,
      sort_order: index,
    })),
  );

  const graph = await fetchTourGraph(client, tourId);
  if (!graph) throw new Error("Tour could not be reloaded after saving.");
  return graphToEditor(graph);
}

async function loadRelatedTours(
  client: SupabaseClientLike,
  currentId: string,
  currentCategoryIds: string[],
  locale: TourLocale,
) {
  const { data: links, error: linkError } = await client.from("tour_categories").select("*");
  throwOnError(linkError);
  const sharedCounts = new Map<string, number>();
  for (const link of links ?? []) {
    if (link.tour_id === currentId || !currentCategoryIds.includes(link.category_id)) continue;
    sharedCounts.set(link.tour_id, (sharedCounts.get(link.tour_id) ?? 0) + 1);
  }

  const { data: tours, error: tourError } = await client
    .from("tours")
    .select("id,featured,base_price_eur,duration_value,duration_unit,published_at")
    .neq("id", currentId)
    .order("published_at", { ascending: false });
  throwOnError(tourError);
  const ranked = [...(tours ?? [])].sort((left, right) => {
    const shared = (sharedCounts.get(right.id) ?? 0) - (sharedCounts.get(left.id) ?? 0);
    if (shared !== 0) return shared;
    if (left.featured !== right.featured) return right.featured ? 1 : -1;
    return String(right.published_at).localeCompare(String(left.published_at));
  });
  const chosen = ranked.slice(0, 3);
  if (chosen.length === 0) return [];
  const ids = chosen.map((tour) => tour.id);
  const [{ data: translations, error: translationError }, { data: media, error: mediaError }] =
    await Promise.all([
      client
        .from("tour_translations")
        .select("tour_id,slug,title,hero_badge")
        .eq("locale", locale)
        .in("tour_id", ids),
      client.from("tour_media").select("tour_id,public_url").eq("role", "hero").in("tour_id", ids),
    ]);
  throwOnError(translationError);
  throwOnError(mediaError);
  return chosen
    .map((tour): RelatedTour | null => {
      const translation = translations?.find((item) => item.tour_id === tour.id);
      if (!translation) return null;
      return {
        id: tour.id,
        title: translation.title,
        href: localizedPath(locale, translation.slug),
        image: media?.find((item) => item.tour_id === tour.id)?.public_url ?? "",
        meta: tourDurationLabel(Number(tour.duration_value), tour.duration_unit, locale),
        priceEur: Number(tour.base_price_eur),
        badge: translation.hero_badge,
      };
    })
    .filter((tour): tour is RelatedTour => tour !== null);
}

async function graphToView(
  client: SupabaseClientLike,
  graph: NonNullable<Awaited<ReturnType<typeof fetchTourGraph>>>,
  locale: TourLocale,
) {
  const alternateLocale: TourLocale = locale === "en" ? "fr" : "en";
  const translation = graph.translations.find((item) => item.locale === locale);
  const alternate = graph.translations.find((item) => item.locale === alternateLocale);
  if (!translation || !alternate) return null;

  const [types, difficulties, categories, relatedTours] = await Promise.all([
    loadTaxonomy(client, "tour_types"),
    loadTaxonomy(client, "difficulties"),
    loadTaxonomy(client, "categories"),
    loadRelatedTours(client, graph.tour.id, graph.categoryIds, locale),
  ]);
  const local = (english: string, french: string) => (locale === "fr" ? french : english);
  const hero = graph.media.find((item) => item.role === "hero");
  const reviews = graph.reviews.flatMap((assignment) => {
    const review = Array.isArray(assignment.reviews) ? assignment.reviews[0] : assignment.reviews;
    if (!review) return [];
    return [
      {
        id: review.id,
        name: review.name,
        reviewDate: review.review_date,
        nationCode: review.nation_code,
        rating: review.rating,
        travelType: review.travel_type,
        body:
          (locale === "fr" ? review.body_fr : review.body_en) ||
          review.body_original ||
          (locale === "fr" ? review.body_en : review.body_fr),
      },
    ];
  });
  const ratingAverage =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10,
        ) / 10
      : null;

  return {
    id: graph.tour.id,
    locale,
    status: graph.tour.status,
    featured: graph.tour.featured,
    title: translation.title,
    slug: translation.slug,
    siteUrl: getSiteUrl(),
    href: localizedPath(locale, translation.slug),
    alternateHref: localizedPath(alternateLocale, alternate.slug),
    alternateLocale,
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
    heroBadge: translation.hero_badge,
    heroImage: hero?.public_url ?? "",
    heroAlt: translation.hero_alt || local(hero?.alt_en ?? "", hero?.alt_fr ?? ""),
    locationLabel: translation.location_label,
    heroIntro: translation.hero_intro,
    overviewTitle: translation.overview_title,
    overviewSummary: translation.overview_summary,
    overviewBody: translation.overview_body,
    bestSeasonTitle: translation.best_season_title,
    bestSeasonBody: translation.best_season_body,
    routeTitle: translation.route_title,
    routeDescription: translation.route_description,
    cancellationSummary: translation.cancellation_summary,
    basePriceEur: Number(graph.tour.base_price_eur),
    discountPercent: graph.tour.discount_percent,
    defaultAvailable: graph.tour.default_available,
    durationValue: Number(graph.tour.duration_value),
    durationUnit: graph.tour.duration_unit,
    maxGroupSize: graph.tour.max_group_size,
    languageCodes: graph.tour.language_codes ?? [],
    startPlace: graph.tour.start_place,
    endPlace: graph.tour.end_place,
    accessibility: local(graph.tour.accessibility_en, graph.tour.accessibility_fr),
    region: local(graph.tour.region_en, graph.tour.region_fr),
    routeDistanceKm:
      graph.tour.route_distance_km === null ? null : Number(graph.tour.route_distance_km),
    typeName:
      types.find((item) => item.id === graph.tour.tour_type_id)?.[
        locale === "fr" ? "nameFr" : "nameEn"
      ] ?? "",
    difficultyName:
      difficulties.find((item) => item.id === graph.tour.difficulty_id)?.[
        locale === "fr" ? "nameFr" : "nameEn"
      ] ?? "",
    categoryNames: graph.categoryIds
      .map((id) => categories.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => (locale === "fr" ? item!.nameFr : item!.nameEn)),
    categoryIds: graph.categoryIds,
    gallery: graph.media
      .filter((item) => item.role === "gallery")
      .map((item) => ({ src: item.public_url, alt: local(item.alt_en, item.alt_fr) })),
    highlights: graph.highlights.map((item) => ({
      iconKey: item.icon_key,
      label: local(item.label_en, item.label_fr),
      text: local(item.text_en, item.text_fr),
    })),
    listItems: graph.listItems.map((item) => ({
      kind: item.kind,
      text: local(item.text_en, item.text_fr),
    })),
    weatherStats: graph.weatherStats.map((item) => ({
      iconKey: item.icon_key,
      value: item.value,
      label: local(item.label_en, item.label_fr),
    })),
    faqs: graph.faqs.map((item) => ({
      question: local(item.question_en, item.question_fr),
      answer: local(item.answer_en, item.answer_fr),
    })),
    itinerary: graph.itinerary.map((item, index) => ({
      id: item.id,
      sequence: index + 1,
      time: String(item.start_time).slice(0, 5),
      place: local(item.place_en, item.place_fr),
      duration: minutesDurationLabel(item.duration_minutes, locale),
      text: local(item.description_en, item.description_fr),
      tag: local(item.type_en, item.type_fr),
      location:
        item.longitude === null || item.latitude === null
          ? undefined
          : {
              id: item.id,
              label: item.location_label || local(item.place_en, item.place_fr),
              coordinates: [item.longitude, item.latitude] as const,
              osmReference: item.osm_reference || undefined,
            },
    })),
    dateOverrides: graph.dateOverrides.map((item) => ({
      date: item.date,
      isAvailable: item.is_available,
      priceEur: item.price_eur === null ? null : Number(item.price_eur),
    })),
    reviews,
    ratingAverage,
    ratingCount: reviews.length,
    relatedTours,
    publishedAt: graph.tour.published_at,
    updatedAt: graph.tour.updated_at,
  } satisfies TourViewModel;
}

export async function fetchPublicTour(slug: string, locale: TourLocale) {
  const client = createPublicSupabaseClient();
  const { data: translation, error } = await client
    .from("tour_translations")
    .select("tour_id")
    .eq("locale", locale)
    .eq("slug", slug)
    .maybeSingle();
  throwOnError(error);
  if (!translation) {
    const { data: redirectRow, error: redirectError } = await client
      .from("tour_slug_redirects")
      .select("tour_id")
      .eq("locale", locale)
      .eq("old_slug", slug)
      .maybeSingle();
    throwOnError(redirectError);
    if (!redirectRow) return { kind: "not-found" as const };
    const { data: current, error: currentError } = await client
      .from("tour_translations")
      .select("slug")
      .eq("tour_id", redirectRow.tour_id)
      .eq("locale", locale)
      .single();
    throwOnError(currentError);
    return { kind: "redirect" as const, location: localizedPath(locale, current!.slug) };
  }
  const graph = await fetchTourGraph(client, translation.tour_id);
  if (!graph) return { kind: "not-found" as const };
  const tour = await graphToView(client, graph, locale);
  return tour ? { kind: "tour" as const, tour } : { kind: "not-found" as const };
}

export const getPublicTourFn = createServerFn({ method: "GET" })
  .validator(publicTourLookupSchema)
  .handler(async ({ data }) => {
    await setPublicNoCacheHeader();
    return fetchPublicTour(data.slug, data.locale);
  });

export async function getFeaturedTourPath(locale: TourLocale) {
  const client = createPublicSupabaseClient();
  let { data: tour, error } = await client
    .from("tours")
    .select("id")
    .eq("featured", true)
    .maybeSingle();
  throwOnError(error);
  if (!tour) {
    const result = await client
      .from("tours")
      .select("id")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    throwOnError(result.error);
    tour = result.data;
  }
  if (!tour) return locale === "fr" ? "/fr/" : "/";
  const { data: translation, error: translationError } = await client
    .from("tour_translations")
    .select("slug")
    .eq("tour_id", tour.id)
    .eq("locale", locale)
    .single();
  throwOnError(translationError);
  return localizedPath(locale, translation!.slug);
}

export const getFeaturedTourPathFn = createServerFn({ method: "GET" })
  .validator(z.object({ locale: z.enum(["en", "fr"]) }))
  .handler(async ({ data }) => getFeaturedTourPath(data.locale));

export const getPublishedTourListingFn = createServerFn({ method: "GET" })
  .validator(z.object({ locale: z.enum(["en", "fr"]) }))
  .handler(async ({ data }): Promise<TourListingData> => {
    await setPublicNoCacheHeader();
    const client = createPublicSupabaseClient();
    const { data: tours, error: tourError } = await client
      .from("tours")
      .select(
        "id,featured,base_price_eur,duration_value,duration_unit,tour_type_id,difficulty_id,max_group_size,default_available,published_at",
      )
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false });
    throwOnError(tourError);

    if (!tours?.length) return { categories: [], tourTypes: [], difficulties: [], tours: [] };

    const ids = tours.map((tour) => tour.id);
    const [
      translationResult,
      mediaResult,
      categoryLinkResult,
      typeResult,
      difficultyResult,
      categoryResult,
      dateOverrideResult,
    ] = await Promise.all([
      client
        .from("tour_translations")
        .select("tour_id,slug,title,hero_alt")
        .eq("locale", data.locale)
        .in("tour_id", ids),
      client
        .from("tour_media")
        .select("tour_id,public_url,alt_en,alt_fr")
        .eq("role", "hero")
        .in("tour_id", ids),
      client.from("tour_categories").select("tour_id,category_id").in("tour_id", ids),
      client.from("tour_types").select("id,key,name_en,name_fr").eq("active", true),
      client.from("difficulties").select("id,key,name_en,name_fr").eq("active", true),
      client.from("categories").select("id,key,name_en,name_fr").eq("active", true),
      client.from("tour_date_overrides").select("tour_id,date,is_available").in("tour_id", ids),
    ]);

    for (const result of [
      translationResult,
      mediaResult,
      categoryLinkResult,
      typeResult,
      difficultyResult,
      categoryResult,
      dateOverrideResult,
    ]) {
      throwOnError(result.error);
    }

    const cards = tours.flatMap((tour): TourListingCard[] => {
      const translation = translationResult.data?.find((item) => item.tour_id === tour.id);
      if (!translation?.slug || !translation.title) return [];
      const hero = mediaResult.data?.find((item) => item.tour_id === tour.id);
      const type = typeResult.data?.find((item) => item.id === tour.tour_type_id);
      return [
        {
          id: tour.id,
          title: translation.title,
          href: localizedPath(data.locale, translation.slug),
          image: hero?.public_url ?? "",
          imageAlt:
            translation.hero_alt ||
            (data.locale === "fr" ? hero?.alt_fr : hero?.alt_en) ||
            translation.title,
          duration: tourDurationLabel(Number(tour.duration_value), tour.duration_unit, data.locale),
          typeId: tour.tour_type_id,
          typeName:
            (data.locale === "fr" ? type?.name_fr : type?.name_en) ||
            (data.locale === "fr" ? "Circuit" : "Tour"),
          difficultyId: tour.difficulty_id,
          priceEur: Number(tour.base_price_eur),
          maxGroupSize: tour.max_group_size,
          categoryIds:
            categoryLinkResult.data
              ?.filter((item) => item.tour_id === tour.id)
              .map((item) => item.category_id) ?? [],
          defaultAvailable: tour.default_available,
          dateOverrides:
            dateOverrideResult.data
              ?.filter((item) => item.tour_id === tour.id)
              .map((item) => ({ date: item.date, isAvailable: item.is_available })) ?? [],
          featured: tour.featured,
        },
      ];
    });

    const categoryCounts = new Map<string, number>();
    for (const card of cards) {
      for (const categoryId of card.categoryIds) {
        categoryCounts.set(categoryId, (categoryCounts.get(categoryId) ?? 0) + 1);
      }
    }

    const categories = (categoryResult.data ?? [])
      .map((category) => ({
        id: category.id,
        key: category.key,
        name: data.locale === "fr" ? category.name_fr : category.name_en,
        count: categoryCounts.get(category.id) ?? 0,
      }))
      .filter((category) => category.count > 0)
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));

    const localizeTaxonomy = (items: typeof typeResult.data) =>
      (items ?? []).map((item) => ({
        id: item.id,
        key: item.key,
        name: data.locale === "fr" ? item.name_fr : item.name_en,
      }));

    return {
      categories,
      tourTypes: localizeTaxonomy(typeResult.data),
      difficulties: localizeTaxonomy(difficultyResult.data),
      tours: cards,
    };
  });

export async function listPublishedTourEntries() {
  const client = createPublicSupabaseClient();
  const { data, error } = await client
    .from("tour_translations")
    .select("tour_id,locale,slug,title,seo_description,tours(updated_at)")
    .neq("slug", "");
  throwOnError(error);
  return data ?? [];
}

export const listAdminToursFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const client = createAdminSupabaseClient();
  const { data: tours, error } = await client
    .from("tours")
    .select("id,status,featured,base_price_eur,updated_at,published_at")
    .order("updated_at", { ascending: false });
  throwOnError(error);
  if (!tours?.length) return [] as TourListRow[];
  const { data: translations, error: translationError } = await client
    .from("tour_translations")
    .select("tour_id,locale,title,slug")
    .in(
      "tour_id",
      tours.map((tour) => tour.id),
    );
  throwOnError(translationError);
  return tours.map(
    (tour): TourListRow => ({
      id: tour.id,
      status: tour.status,
      featured: tour.featured,
      titleEn:
        translations?.find((item) => item.tour_id === tour.id && item.locale === "en")?.title ?? "",
      titleFr:
        translations?.find((item) => item.tour_id === tour.id && item.locale === "fr")?.title ?? "",
      slugEn:
        translations?.find((item) => item.tour_id === tour.id && item.locale === "en")?.slug ?? "",
      slugFr:
        translations?.find((item) => item.tour_id === tour.id && item.locale === "fr")?.slug ?? "",
      basePriceEur: Number(tour.base_price_eur),
      updatedAt: tour.updated_at,
      publishedAt: tour.published_at,
    }),
  );
});

export const getTourEditorFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const graph = await fetchTourGraph(createAdminSupabaseClient(), data.id);
    if (!graph) throw new Error("Tour not found.");
    return graphToEditor(graph);
  });

export const getTourPreviewFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid(), locale: z.enum(["en", "fr"]) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const graph = await fetchTourGraph(client, data.id);
    if (!graph) throw new Error("Tour not found.");
    const tour = await graphToView(client, graph, data.locale);
    if (!tour) throw new Error("Both translation records are required for preview.");
    return tour;
  });

export const getAdminReferenceDataFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const client = createAdminSupabaseClient();
  const [categories, tourTypes, difficulties, reviews] = await Promise.all([
    loadTaxonomy(client, "categories"),
    loadTaxonomy(client, "tour_types"),
    loadTaxonomy(client, "difficulties"),
    loadReviews(client),
  ]);
  return { categories, tourTypes, difficulties, reviews };
});

export const saveTourFn = createServerFn({ method: "POST" })
  .validator(tourEditorSchema)
  .handler(async ({ data }) => {
    await requireAdminSession();
    return saveTour(data);
  });

export const publishTourFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    try {
      const client = createAdminSupabaseClient();
      const graph = await fetchTourGraph(client, data.id);
      if (!graph) throw new Error("Tour not found.");
      const editor = graphToEditor(graph);
      const problems = validateForPublish(editor);

      for (const media of graph.media) {
        const separator = media.storage_path.lastIndexOf("/");
        if (separator < 1) {
          problems.push(`${media.role === "hero" ? "Hero" : "Gallery"} image path is invalid.`);
          continue;
        }
        const folder = media.storage_path.slice(0, separator);
        const name = media.storage_path.slice(separator + 1);
        const { data: objects, error: storageError } = await client.storage
          .from("tour-media")
          .list(folder, { limit: 10, search: name });
        if (storageError || !objects?.some((object) => object.name === name)) {
          problems.push(
            `${media.role === "hero" ? "Hero" : "Gallery"} image is missing from storage. Re-upload it before publishing.`,
          );
          continue;
        }
        const canonicalUrl = client.storage.from("tour-media").getPublicUrl(media.storage_path)
          .data.publicUrl;
        if (media.public_url !== canonicalUrl) {
          const { error: mediaUpdateError } = await client
            .from("tour_media")
            .update({ public_url: canonicalUrl })
            .eq("id", media.id);
          throwOnError(mediaUpdateError);
        }
      }

      if (problems.length) return { ok: false as const, problems: [...new Set(problems)] };

      if (editor.featured) {
        const { error: clearError } = await client
          .from("tours")
          .update({ featured: false })
          .neq("id", editor.id!);
        throwOnError(clearError);
      }
      const { error } = await client
        .from("tours")
        .update({
          status: "published",
          published_at: graph.tour.published_at ?? new Date().toISOString(),
        })
        .eq("id", data.id);
      throwOnError(error);
      const siteUrl = getSiteUrl();
      const result: PublishResult = {
        id: data.id,
        status: "published",
        englishUrl: `${siteUrl}/${editor.translations.en.slug}`,
        frenchUrl: `${siteUrl}/fr/${editor.translations.fr.slug}`,
      };
      return { ok: true as const, result };
    } catch (error) {
      return {
        ok: false as const,
        problems: [
          error instanceof Error
            ? `Publishing failed: ${error.message}`
            : "Publishing failed because of an unexpected server error.",
        ],
      };
    }
  });

export const unpublishTourFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await createAdminSupabaseClient()
      .from("tours")
      .update({ status: "draft", featured: false })
      .eq("id", data.id);
    throwOnError(error);
    return { ok: true };
  });

export const saveTaxonomyFn = createServerFn({ method: "POST" })
  .validator(taxonomyInputSchema)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const row = {
      key: data.key,
      name_en: data.nameEn,
      name_fr: data.nameFr,
      active: data.active,
    };
    const result = data.id
      ? await client.from(data.kind).update(row).eq("id", data.id).select().single()
      : await client.from(data.kind).insert(row).select().single();
    throwOnError(result.error);
    return { ok: true };
  });

export const saveReviewFn = createServerFn({ method: "POST" })
  .validator(reviewInputSchema)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const row = {
      name: data.name,
      review_date: data.reviewDate,
      nation_code: data.nationCode,
      rating: data.rating,
      travel_type: data.travelType,
      original_language: data.originalLanguage,
      body_original: data.bodyOriginal,
      body_en: data.bodyEn,
      body_fr: data.bodyFr,
    };
    const result = data.id
      ? await client.from("reviews").update(row).eq("id", data.id).select("id").single()
      : await client.from("reviews").insert(row).select("id").single();
    throwOnError(result.error);
    return { ok: true, id: result.data!.id };
  });

export const geocodePlaceFn = createServerFn({ method: "POST" })
  .validator(z.object({ query: z.string().trim().min(2).max(300) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const normalized = data.query.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
    const queryKey = await crypto.subtle
      .digest("SHA-256", new TextEncoder().encode(normalized))
      .then((digest) =>
        [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join(""),
      );
    const { data: cached, error: cacheError } = await client
      .from("geocoding_cache")
      .select("results,expires_at")
      .eq("query_key", queryKey)
      .maybeSingle();
    throwOnError(cacheError);
    if (cached && Date.parse(cached.expires_at) > Date.now()) {
      return { cached: true, candidates: cached.results as GeocodeCandidate[] };
    }

    const threshold = new Date(Date.now() - 1100).toISOString();
    const { data: slot, error: slotError } = await client
      .from("geocoder_state")
      .update({ last_request_at: new Date().toISOString() })
      .eq("id", true)
      .lte("last_request_at", threshold)
      .select("id")
      .maybeSingle();
    throwOnError(slotError);
    if (!slot) throw new Error("Place search is busy. Please try again in a moment.");

    const userAgent =
      process.env.GEOCODER_USER_AGENT ||
      "WonderAlbaniaAdmin/1.0 (https://wonderalbania.com; hello@wonderalbania.com)";
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", data.query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "5");
    url.searchParams.set("countrycodes", "al");
    url.searchParams.set("addressdetails", "1");
    const response = await fetch(url, {
      headers: { "User-Agent": userAgent, Accept: "application/json" },
    });
    if (!response.ok) throw new Error("The place lookup service is unavailable.");
    const payload = (await response.json()) as Array<{
      display_name: string;
      lon: string;
      lat: string;
      osm_type: string;
      osm_id: number;
      type: string;
    }>;
    const candidates: GeocodeCandidate[] = payload.map((item) => ({
      displayName: item.display_name,
      longitude: Number(item.lon),
      latitude: Number(item.lat),
      osmReference: `${item.osm_type}/${item.osm_id}`,
      type: item.type,
    }));
    const { error: saveError } = await client.from("geocoding_cache").upsert({
      query_key: queryKey,
      normalized_query: normalized,
      results: candidates,
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    });
    throwOnError(saveError);
    return { cached: false, candidates };
  });

export const requestTourUploadFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      tourId: z.string().uuid(),
      fileName: z.string().trim().min(1).max(180),
      contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]),
      size: z
        .number()
        .int()
        .positive()
        .max(10 * 1024 * 1024),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
    };
    const path = `tours/${data.tourId}/${crypto.randomUUID()}.${extensionByType[data.contentType]}`;
    const client = createAdminSupabaseClient();
    const { data: signed, error } = await client.storage
      .from("tour-media")
      .createSignedUploadUrl(path);
    throwOnError(error);
    const publicUrl = client.storage.from("tour-media").getPublicUrl(path).data.publicUrl;
    return {
      path,
      token: signed!.token,
      publicUrl,
      ...readPublicSupabaseConfig(),
    };
  });

export const confirmTourUploadFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      tourId: z.string().uuid(),
      path: z.string().trim().min(1).max(500),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const prefix = `tours/${data.tourId}/`;
    if (!data.path.startsWith(prefix)) throw new Error("The uploaded image path is invalid.");

    const name = data.path.slice(prefix.length);
    if (!name || name.includes("/")) throw new Error("The uploaded image path is invalid.");

    const client = createAdminSupabaseClient();
    const { data: objects, error } = await client.storage
      .from("tour-media")
      .list(`tours/${data.tourId}`, {
        limit: 10,
        search: name,
      });
    throwOnError(error);
    if (!objects?.some((object) => object.name === name)) {
      throw new Error("The image upload did not finish. Please try uploading it again.");
    }

    return {
      path: data.path,
      publicUrl: client.storage.from("tour-media").getPublicUrl(data.path).data.publicUrl,
    };
  });

export const deleteTourMediaFn = createServerFn({ method: "POST" })
  .validator(z.object({ path: z.string().min(1).max(500) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await createAdminSupabaseClient()
      .storage.from("tour-media")
      .remove([data.path]);
    throwOnError(error);
    return { ok: true };
  });
