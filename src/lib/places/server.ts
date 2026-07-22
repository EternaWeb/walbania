import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminSession } from "../admin/auth";
import {
  createAdminSupabaseClient,
  createPublicSupabaseClient,
  getSiteUrl,
  readPublicSupabaseConfig,
} from "../supabase";
import type { TourListingCard } from "../tours/types";
import { placeEditorSchema, publicPlaceLookupSchema, validatePlaceForPublish } from "./schemas";
import type {
  GlobalMediaAsset,
  PlaceAdminListRow,
  PlaceCard,
  PlaceEditorPayload,
  PlaceKind,
  PlaceLocale,
  PlaceMapPoint,
  PlaceTourReference,
  PlaceViewModel,
} from "./types";

function throwOnError(error: { message?: string } | null) {
  if (error) throw new Error(error.message || "The database request failed.");
}

function local(locale: PlaceLocale, en: string, fr: string) {
  return locale === "fr" ? fr : en;
}

export function placePath(kind: PlaceKind, locale: PlaceLocale, slug: string, parentSlug?: string) {
  const prefix = locale === "fr" ? "/fr" : "";
  return kind === "destination"
    ? `${prefix}/destinations/${slug}`
    : `${prefix}/attractions/${parentSlug}/${slug}`;
}

function durationLabel(value: number, unit: "hours" | "days", locale: PlaceLocale) {
  const shown = Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, "");
  if (locale === "fr") {
    return unit === "days"
      ? `${shown} ${value === 1 ? "jour" : "jours"}`
      : `${shown} ${value === 1 ? "heure" : "heures"}`;
  }
  return unit === "days"
    ? `${shown} ${value === 1 ? "day" : "days"}`
    : `${shown} ${value === 1 ? "hour" : "hours"}`;
}

function distanceKm(first: readonly [number, number], second: readonly [number, number]) {
  const radians = (value: number) => (value * Math.PI) / 180;
  const [firstLng, firstLat] = first;
  const [secondLng, secondLat] = second;
  const latDelta = radians(secondLat - firstLat);
  const lngDelta = radians(secondLng - firstLng);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(radians(firstLat)) * Math.cos(radians(secondLat)) * Math.sin(lngDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function loadAssets(client: ReturnType<typeof createPublicSupabaseClient>, ids: string[]) {
  if (!ids.length) return new Map<string, { public_url: string }>();
  const { data, error } = await client.from("media_assets").select("*").in("id", ids);
  throwOnError(error);
  return new Map<string, { public_url: string }>(
    (data ?? []).map((asset) => [asset.id, { public_url: asset.public_url }]),
  );
}

async function loadPlaceCards(
  client: ReturnType<typeof createPublicSupabaseClient>,
  locale: PlaceLocale,
  kind?: PlaceKind,
): Promise<PlaceCard[]> {
  let query = client
    .from("places")
    .select("id,kind,parent_destination_id,longitude,latitude,featured,published_at")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  const { data: places, error } = await query;
  throwOnError(error);
  if (!places?.length) return [];
  const ids = places.map((place) => place.id);
  const parentIds = [
    ...new Set(places.map((place) => place.parent_destination_id).filter(Boolean)),
  ];
  const [{ data: translations, error: translationError }, { data: media, error: mediaError }] =
    await Promise.all([
      client
        .from("place_translations")
        .select("place_id,slug,title,hero_alt")
        .eq("locale", locale)
        .in("place_id", [...new Set([...ids, ...parentIds])]),
      client
        .from("place_media")
        .select("place_id,asset_id,role,alt_en,alt_fr")
        .in("place_id", ids)
        .in("role", ["card", "hero"]),
    ]);
  throwOnError(translationError);
  throwOnError(mediaError);
  const assets = await loadAssets(client, [...new Set((media ?? []).map((item) => item.asset_id))]);
  return places.flatMap((place): PlaceCard[] => {
    const translation = translations?.find((item) => item.place_id === place.id);
    if (!translation?.slug || !translation.title) return [];
    const parent = translations?.find((item) => item.place_id === place.parent_destination_id);
    const assigned =
      media?.find((item) => item.place_id === place.id && item.role === "card") ??
      media?.find((item) => item.place_id === place.id && item.role === "hero");
    const asset = assigned ? assets.get(assigned.asset_id) : null;
    return [
      {
        id: place.id,
        slug: translation.slug,
        kind: place.kind,
        title: translation.title,
        href: placePath(place.kind, locale, translation.slug, parent?.slug),
        image: asset?.public_url ?? "",
        imageAlt:
          (assigned ? local(locale, assigned.alt_en, assigned.alt_fr) : "") ||
          translation.hero_alt ||
          translation.title,
        parentTitle: parent?.title ?? "",
        coordinates:
          place.longitude == null || place.latitude == null
            ? null
            : ([place.longitude, place.latitude] as const),
      },
    ];
  });
}

async function loadTourCards(
  client: ReturnType<typeof createPublicSupabaseClient>,
  tourIds: string[],
  locale: PlaceLocale,
) {
  if (!tourIds.length) return [] as TourListingCard[];
  const [tourResult, translationResult, mediaResult, typeResult, categoryResult, dateResult] =
    await Promise.all([
      client
        .from("tours")
        .select(
          "id,featured,base_price_eur,duration_value,duration_unit,tour_type_id,difficulty_id,max_group_size,default_available",
        )
        .eq("status", "published")
        .in("id", tourIds),
      client
        .from("tour_translations")
        .select("tour_id,slug,title,hero_alt")
        .eq("locale", locale)
        .in("tour_id", tourIds),
      client
        .from("tour_media")
        .select("tour_id,public_url,alt_en,alt_fr")
        .eq("role", "hero")
        .in("tour_id", tourIds),
      client.from("tour_types").select("id,key,name_en,name_fr"),
      client.from("tour_categories").select("tour_id,category_id").in("tour_id", tourIds),
      client.from("tour_date_overrides").select("tour_id,date,is_available").in("tour_id", tourIds),
    ]);
  for (const result of [
    tourResult,
    translationResult,
    mediaResult,
    typeResult,
    categoryResult,
    dateResult,
  ]) {
    throwOnError(result.error);
  }
  const byId = new Map(tourResult.data?.map((tour) => [tour.id, tour]));
  const cards = tourIds.flatMap((id): TourListingCard[] => {
    const tour = byId.get(id);
    const translation = translationResult.data?.find((item) => item.tour_id === id);
    if (!tour || !translation?.slug || !translation.title) return [];
    const media = mediaResult.data?.find((item) => item.tour_id === id);
    const type = typeResult.data?.find((item) => item.id === tour.tour_type_id);
    return [
      {
        id,
        title: translation.title,
        href: locale === "fr" ? `/fr/${translation.slug}` : `/${translation.slug}`,
        image: media?.public_url ?? "",
        imageAlt: translation.hero_alt || local(locale, media?.alt_en ?? "", media?.alt_fr ?? ""),
        duration: durationLabel(Number(tour.duration_value), tour.duration_unit, locale),
        typeId: tour.tour_type_id,
        typeName: local(locale, type?.name_en ?? "Tour", type?.name_fr ?? "Circuit"),
        difficultyId: tour.difficulty_id,
        priceEur: Number(tour.base_price_eur),
        maxGroupSize: tour.max_group_size,
        categoryIds:
          categoryResult.data
            ?.filter((item) => item.tour_id === id)
            .map((item) => item.category_id) ?? [],
        defaultAvailable: tour.default_available,
        dateOverrides:
          dateResult.data
            ?.filter((item) => item.tour_id === id)
            .map((item) => ({ date: item.date, isAvailable: item.is_available })) ?? [],
        featured: tour.featured,
      },
    ];
  });
  const dayTourPriority = (id: string) => {
    const tour = byId.get(id);
    return tour?.duration_unit === "hours" ||
      (tour?.duration_unit === "days" && Number(tour.duration_value) <= 1)
      ? 0
      : 1;
  };
  return cards.sort(
    (left, right) =>
      dayTourPriority(left.id) - dayTourPriority(right.id) ||
      tourIds.indexOf(left.id) - tourIds.indexOf(right.id),
  );
}

async function loadPlaceView(
  client: ReturnType<typeof createPublicSupabaseClient>,
  placeId: string,
  locale: PlaceLocale,
): Promise<PlaceViewModel | null> {
  const [
    placeResult,
    translationResult,
    sectionResult,
    factResult,
    highlightResult,
    mediaResult,
    linkResult,
  ] = await Promise.all([
    client.from("places").select("*").eq("id", placeId).maybeSingle(),
    client.from("place_translations").select("*").eq("place_id", placeId),
    client.from("place_sections").select("*").eq("place_id", placeId).order("sort_order"),
    client.from("place_facts").select("*").eq("place_id", placeId).order("sort_order"),
    client.from("place_highlights").select("*").eq("place_id", placeId).order("sort_order"),
    client.from("place_media").select("*").eq("place_id", placeId).order("sort_order"),
    client
      .from("place_tours")
      .select("tour_id,sort_order")
      .eq("place_id", placeId)
      .eq("visible", true)
      .order("sort_order"),
  ]);
  for (const result of [
    placeResult,
    translationResult,
    sectionResult,
    factResult,
    highlightResult,
    mediaResult,
    linkResult,
  ]) {
    throwOnError(result.error);
  }
  const place = placeResult.data;
  if (!place) return null;
  const translation = translationResult.data?.find((item) => item.locale === locale);
  const alternate = translationResult.data?.find((item) => item.locale !== locale);
  if (!translation || !alternate || place.longitude == null || place.latitude == null) return null;
  const parentCards = place.parent_destination_id
    ? await loadPlaceCards(client, locale, "destination")
    : [];
  const parent = parentCards.find((item) => item.id === place.parent_destination_id) ?? null;
  const alternateParentCards = place.parent_destination_id
    ? await loadPlaceCards(client, locale === "en" ? "fr" : "en", "destination")
    : [];
  const alternateParent =
    alternateParentCards.find((item) => item.id === place.parent_destination_id) ?? null;
  const assetIds = [
    ...(mediaResult.data ?? []).map((item) => item.asset_id),
    ...(sectionResult.data ?? []).map((item) => item.media_asset_id).filter(Boolean),
  ];
  const assets = await loadAssets(client, [...new Set(assetIds)]);
  const heroMedia = mediaResult.data?.find((item) => item.role === "hero");
  const heroAsset = heroMedia ? assets.get(heroMedia.asset_id) : null;
  const mapCards = await loadPlaceCards(client, locale);
  const allTranslations = await client
    .from("place_translations")
    .select("place_id,seo_description")
    .eq("locale", locale);
  throwOnError(allTranslations.error);
  const mapPoints: PlaceMapPoint[] = mapCards.map((card) => ({
    ...card,
    summary: allTranslations.data?.find((item) => item.place_id === card.id)?.seo_description ?? "",
  }));
  const linkedTours = await loadTourCards(
    client,
    (linkResult.data ?? []).map((item) => item.tour_id),
    locale,
  );
  const relatedPlaces = mapCards.filter((item) => item.id !== placeId && item.kind === place.kind);
  return {
    id: place.id,
    siteUrl: getSiteUrl(),
    kind: place.kind,
    locale,
    status: place.status,
    title: translation.title,
    slug: translation.slug,
    href: placePath(place.kind, locale, translation.slug, parent?.slug),
    alternateHref: placePath(
      place.kind,
      locale === "en" ? "fr" : "en",
      alternate.slug,
      alternateParent?.slug,
    ),
    parent,
    seoTitle: translation.seo_title,
    seoDescription: translation.seo_description,
    heroIntro: translation.hero_intro,
    heroImage: heroAsset?.public_url ?? "",
    heroAlt:
      translation.hero_alt ||
      (heroMedia ? local(locale, heroMedia.alt_en, heroMedia.alt_fr) : translation.title),
    storyTitle: translation.story_title ?? "",
    storyIntro: translation.story_intro ?? "",
    coordinates: [place.longitude, place.latitude],
    mapZoom: Number(place.map_zoom),
    sections: (sectionResult.data ?? []).map((section) => ({
      title: local(locale, section.title_en, section.title_fr),
      body: local(locale, section.body_en, section.body_fr),
      secondaryBody: local(locale, section.secondary_body_en, section.secondary_body_fr),
      image: assets.get(section.media_asset_id)?.public_url ?? "",
      imageAlt:
        local(locale, section.image_alt_en, section.image_alt_fr) ||
        local(locale, section.title_en, section.title_fr),
    })),
    quickFacts: (factResult.data ?? [])
      .filter((item) => item.group_key === "quick")
      .map((item) => ({
        iconKey: item.icon_key,
        value: item.value,
        label: local(locale, item.label_en, item.label_fr),
      })),
    weatherFacts: (factResult.data ?? [])
      .filter((item) => item.group_key === "weather")
      .map((item) => ({
        iconKey: item.icon_key,
        value: item.value,
        label: local(locale, item.label_en, item.label_fr),
      })),
    highlights: (highlightResult.data ?? []).map((item) => ({
      iconKey: item.icon_key,
      label: local(locale, item.label_en, item.label_fr),
      text: local(locale, item.text_en, item.text_fr),
    })),
    tours: linkedTours,
    relatedPlaces,
    mapPoints,
    updatedAt: place.updated_at,
  };
}

export const getPublicPlaceFn = createServerFn({ method: "GET" })
  .validator(publicPlaceLookupSchema)
  .handler(async ({ data }) => {
    const client = createPublicSupabaseClient();
    const { data: translation, error } = await client
      .from("place_translations")
      .select("place_id")
      .eq("locale", data.locale)
      .eq("slug", data.slug)
      .maybeSingle();
    throwOnError(error);
    if (!translation) return { kind: "not-found" as const };
    const view = await loadPlaceView(client, translation.place_id, data.locale);
    if (!view || view.kind !== data.kind) return { kind: "not-found" as const };
    if (view.kind === "attraction" && view.parent?.href.split("/").pop() !== data.parentSlug) {
      return { kind: "redirect" as const, location: view.href };
    }
    return { kind: "place" as const, place: view };
  });

export const getPublicPlaceCollectionFn = createServerFn({ method: "GET" })
  .validator(
    z.object({ kind: z.enum(["destination", "attraction"]), locale: z.enum(["en", "fr"]) }),
  )
  .handler(async ({ data }) => {
    const client = createPublicSupabaseClient();
    const cards = await loadPlaceCards(client, data.locale, data.kind);
    const all = await loadPlaceCards(client, data.locale);
    const { data: translations, error } = all.length
      ? await client
          .from("place_translations")
          .select("place_id,seo_description")
          .eq("locale", data.locale)
          .in(
            "place_id",
            all.map((item) => item.id),
          )
      : { data: [], error: null };
    throwOnError(error);
    return {
      cards,
      mapPoints: all.map((item) => ({
        ...item,
        summary:
          translations?.find((translation) => translation.place_id === item.id)?.seo_description ??
          "",
      })) satisfies PlaceMapPoint[],
    };
  });

async function fetchEditorGraph(placeId: string): Promise<PlaceEditorPayload | null> {
  const client = createAdminSupabaseClient();
  const [place, translations, sections, facts, highlights, media, tourLinks] = await Promise.all([
    client.from("places").select("*").eq("id", placeId).maybeSingle(),
    client.from("place_translations").select("*").eq("place_id", placeId),
    client.from("place_sections").select("*").eq("place_id", placeId).order("sort_order"),
    client.from("place_facts").select("*").eq("place_id", placeId).order("sort_order"),
    client.from("place_highlights").select("*").eq("place_id", placeId).order("sort_order"),
    client.from("place_media").select("*").eq("place_id", placeId).order("sort_order"),
    client.from("place_tours").select("*").eq("place_id", placeId).order("sort_order"),
  ]);
  for (const result of [place, translations, sections, facts, highlights, media, tourLinks]) {
    throwOnError(result.error);
  }
  if (!place.data) return null;
  const translation = (locale: PlaceLocale) => {
    const item = translations.data?.find((row) => row.locale === locale);
    return {
      locale,
      slug: item?.slug ?? "",
      title: item?.title ?? "",
      seoTitle: item?.seo_title ?? "",
      seoDescription: item?.seo_description ?? "",
      heroIntro: item?.hero_intro ?? "",
      heroAlt: item?.hero_alt ?? "",
      storyTitle: item?.story_title ?? "",
      storyIntro: item?.story_intro ?? "",
    };
  };
  return {
    id: place.data.id,
    kind: place.data.kind,
    parentDestinationId: place.data.parent_destination_id,
    status: place.data.status,
    featured: place.data.featured,
    longitude: place.data.longitude,
    latitude: place.data.latitude,
    mapZoom: Number(place.data.map_zoom),
    translations: { en: translation("en"), fr: translation("fr") },
    sections: (sections.data ?? []).map((item) => ({
      id: item.id,
      titleEn: item.title_en,
      titleFr: item.title_fr,
      bodyEn: item.body_en,
      bodyFr: item.body_fr,
      secondaryBodyEn: item.secondary_body_en,
      secondaryBodyFr: item.secondary_body_fr,
      imageAltEn: item.image_alt_en ?? "",
      imageAltFr: item.image_alt_fr ?? "",
      mediaAssetId: item.media_asset_id,
      sortOrder: item.sort_order,
    })),
    facts: (facts.data ?? []).map((item) => ({
      id: item.id,
      groupKey: item.group_key,
      iconKey: item.icon_key,
      value: item.value,
      labelEn: item.label_en,
      labelFr: item.label_fr,
      sortOrder: item.sort_order,
    })),
    highlights: (highlights.data ?? []).map((item) => ({
      id: item.id,
      iconKey: item.icon_key,
      labelEn: item.label_en,
      labelFr: item.label_fr,
      textEn: item.text_en,
      textFr: item.text_fr,
      sortOrder: item.sort_order,
    })),
    media: (media.data ?? []).map((item) => ({
      id: item.id,
      assetId: item.asset_id,
      role: item.role,
      altEn: item.alt_en,
      altFr: item.alt_fr,
      sortOrder: item.sort_order,
    })),
    tourLinks: (tourLinks.data ?? []).map((item) => ({
      tourId: item.tour_id,
      relationship: item.relationship,
      source: item.source,
      visible: item.visible,
      sortOrder: item.sort_order,
    })),
  };
}

export const listAdminPlacesFn = createServerFn({ method: "GET" })
  .validator(z.object({ kind: z.enum(["destination", "attraction"]) }))
  .handler(async ({ data }): Promise<PlaceAdminListRow[]> => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const { data: places, error } = await client
      .from("places")
      .select("id,kind,status,parent_destination_id,updated_at")
      .eq("kind", data.kind)
      .order("updated_at", { ascending: false });
    throwOnError(error);
    if (!places?.length) return [];
    const ids = places.map((item) => item.id);
    const parentIds = places.map((item) => item.parent_destination_id).filter(Boolean);
    const [translations, links] = await Promise.all([
      client
        .from("place_translations")
        .select("place_id,locale,title,slug")
        .in("place_id", [...new Set([...ids, ...parentIds])]),
      client.from("place_tours").select("place_id").in("place_id", ids).eq("visible", true),
    ]);
    throwOnError(translations.error);
    throwOnError(links.error);
    return places.map((place) => ({
      id: place.id,
      kind: place.kind,
      status: place.status,
      titleEn:
        translations.data?.find((item) => item.place_id === place.id && item.locale === "en")
          ?.title ?? "",
      titleFr:
        translations.data?.find((item) => item.place_id === place.id && item.locale === "fr")
          ?.title ?? "",
      slugEn:
        translations.data?.find((item) => item.place_id === place.id && item.locale === "en")
          ?.slug ?? "",
      parentTitle:
        translations.data?.find(
          (item) => item.place_id === place.parent_destination_id && item.locale === "en",
        )?.title ?? "",
      parentSlug:
        translations.data?.find(
          (item) => item.place_id === place.parent_destination_id && item.locale === "en",
        )?.slug ?? "",
      linkedTourCount: links.data?.filter((item) => item.place_id === place.id).length ?? 0,
      updatedAt: place.updated_at,
    }));
  });

export const getPlaceEditorFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const place = await fetchEditorGraph(data.id);
    if (!place) throw new Error("Place not found.");
    return place;
  });

async function adminTourReferences(place?: PlaceEditorPayload): Promise<PlaceTourReference[]> {
  const client = createAdminSupabaseClient();
  const { data: tours, error } = await client
    .from("tours")
    .select(
      "id,status,featured,base_price_eur,duration_value,duration_unit,tour_type_id,difficulty_id,max_group_size,default_available",
    )
    .neq("status", "archived");
  throwOnError(error);
  if (!tours?.length) return [];
  const ids = tours.map((item) => item.id);
  const [translations, media, types, stops] = await Promise.all([
    client
      .from("tour_translations")
      .select("tour_id,title,slug,hero_alt")
      .eq("locale", "en")
      .in("tour_id", ids),
    client.from("tour_media").select("tour_id,public_url").eq("role", "hero").in("tour_id", ids),
    client.from("tour_types").select("id,key,name_en"),
    client
      .from("tour_itinerary_stops")
      .select("id,tour_id,place_en,location_label,longitude,latitude")
      .in("tour_id", ids),
  ]);
  for (const result of [translations, media, types, stops]) throwOnError(result.error);
  const coordinates =
    place?.longitude == null || place.latitude == null
      ? null
      : ([place.longitude, place.latitude] as const);
  return tours
    .flatMap((tour): PlaceTourReference[] => {
      const translation = translations.data?.find((item) => item.tour_id === tour.id);
      if (!translation) return [];
      const type = types.data?.find((item) => item.id === tour.tour_type_id);
      const matches = coordinates
        ? (stops.data ?? [])
            .filter(
              (stop) => stop.tour_id === tour.id && stop.longitude != null && stop.latitude != null,
            )
            .map((stop) => ({
              stopId: stop.id,
              label: stop.location_label || stop.place_en,
              distanceKm: distanceKm(coordinates, [stop.longitude, stop.latitude]),
            }))
            .filter((match) => match.distanceKm <= (place?.kind === "attraction" ? 2 : 12))
            .sort((left, right) => left.distanceKm - right.distanceKm)
        : [];
      return [
        {
          id: tour.id,
          title: translation.title,
          href: `/${translation.slug}`,
          image: media.data?.find((item) => item.tour_id === tour.id)?.public_url ?? "",
          imageAlt: translation.hero_alt || translation.title,
          duration: durationLabel(Number(tour.duration_value), tour.duration_unit, "en"),
          typeId: tour.tour_type_id,
          typeName: type?.name_en ?? "Tour",
          difficultyId: tour.difficulty_id,
          priceEur: Number(tour.base_price_eur),
          maxGroupSize: tour.max_group_size,
          categoryIds: [],
          defaultAvailable: tour.default_available,
          dateOverrides: [],
          featured: tour.featured,
          status: tour.status,
          itineraryMatches: matches,
        },
      ];
    })
    .sort((left, right) => {
      const leftTour = tours.find((tour) => tour.id === left.id);
      const rightTour = tours.find((tour) => tour.id === right.id);
      const priority = (tour: (typeof tours)[number] | undefined) =>
        tour?.duration_unit === "hours" ||
        (tour?.duration_unit === "days" && Number(tour.duration_value) <= 1)
          ? 0
          : 1;
      return priority(leftTour) - priority(rightTour) || left.title.localeCompare(right.title);
    });
}

export const getPlaceReferenceDataFn = createServerFn({ method: "GET" })
  .validator(z.object({ placeId: z.string().uuid().optional() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const place = data.placeId ? await fetchEditorGraph(data.placeId) : null;
    const client = createAdminSupabaseClient();
    const [{ data: destinations, error }, tours, assets] = await Promise.all([
      client
        .from("places")
        .select("id,place_translations(locale,title,slug)")
        .eq("kind", "destination")
        .neq("status", "archived"),
      adminTourReferences(place ?? undefined),
      listMediaAssets(),
    ]);
    throwOnError(error);
    return {
      destinations: (destinations ?? []).map((destination) => {
        const translation = (
          destination.place_translations as Array<{
            locale: string;
            title: string;
            slug: string;
          }> | null
        )?.find((item) => item.locale === "en");
        return {
          id: destination.id,
          title: translation?.title ?? "Untitled destination",
          slug: translation?.slug ?? "",
        };
      }),
      tours,
      assets,
    };
  });

async function savePlace(input: PlaceEditorPayload) {
  const client = createAdminSupabaseClient();
  const row = {
    kind: input.kind,
    parent_destination_id: input.kind === "attraction" ? input.parentDestinationId : null,
    status: input.status,
    featured: input.featured,
    longitude: input.longitude,
    latitude: input.latitude,
    map_zoom: input.mapZoom,
  };
  const placeResult = input.id
    ? await client.from("places").update(row).eq("id", input.id).select("id").single()
    : await client.from("places").insert(row).select("id").single();
  throwOnError(placeResult.error);
  const placeId = placeResult.data!.id;
  const translations = (["en", "fr"] as const).map((locale) => ({
    place_id: placeId,
    locale,
    slug: input.translations[locale].slug,
    title: input.translations[locale].title,
    seo_title: input.translations[locale].seoTitle,
    seo_description: input.translations[locale].seoDescription,
    hero_intro: input.translations[locale].heroIntro,
    hero_alt: input.translations[locale].heroAlt,
    story_title: input.translations[locale].storyTitle,
    story_intro: input.translations[locale].storyIntro,
  }));
  const translationResult = await client
    .from("place_translations")
    .upsert(translations, { onConflict: "place_id,locale" });
  throwOnError(translationResult.error);

  for (const table of [
    "place_sections",
    "place_facts",
    "place_highlights",
    "place_media",
    "place_tours",
  ] as const) {
    const result = await client.from(table).delete().eq("place_id", placeId);
    throwOnError(result.error);
  }
  const inserts = [
    input.sections.length
      ? client.from("place_sections").insert(
          input.sections.map((item, index) => ({
            place_id: placeId,
            title_en: item.titleEn,
            title_fr: item.titleFr,
            body_en: item.bodyEn,
            body_fr: item.bodyFr,
            secondary_body_en: item.secondaryBodyEn,
            secondary_body_fr: item.secondaryBodyFr,
            image_alt_en: item.imageAltEn,
            image_alt_fr: item.imageAltFr,
            media_asset_id: item.mediaAssetId,
            sort_order: index,
          })),
        )
      : null,
    input.facts.length
      ? client.from("place_facts").insert(
          input.facts.map((item, index) => ({
            place_id: placeId,
            group_key: item.groupKey,
            icon_key: item.iconKey,
            value: item.value,
            label_en: item.labelEn,
            label_fr: item.labelFr,
            sort_order: index,
          })),
        )
      : null,
    input.highlights.length
      ? client.from("place_highlights").insert(
          input.highlights.map((item, index) => ({
            place_id: placeId,
            icon_key: item.iconKey,
            label_en: item.labelEn,
            label_fr: item.labelFr,
            text_en: item.textEn,
            text_fr: item.textFr,
            sort_order: index,
          })),
        )
      : null,
    input.media.length
      ? client.from("place_media").insert(
          input.media.map((item, index) => ({
            place_id: placeId,
            asset_id: item.assetId,
            role: item.role,
            alt_en: item.altEn,
            alt_fr: item.altFr,
            sort_order: item.role === "gallery" ? index : 0,
          })),
        )
      : null,
    input.tourLinks.length
      ? client.from("place_tours").insert(
          input.tourLinks.map((item, index) => ({
            place_id: placeId,
            tour_id: item.tourId,
            relationship: item.relationship,
            source: item.source,
            visible: item.visible,
            sort_order: index,
          })),
        )
      : null,
  ].filter(Boolean);
  for (const request of inserts) {
    const result = await request!;
    throwOnError(result.error);
  }
  return (await fetchEditorGraph(placeId))!;
}

export const savePlaceFn = createServerFn({ method: "POST" })
  .validator(placeEditorSchema)
  .handler(async ({ data }) => {
    await requireAdminSession();
    return savePlace(data);
  });

export const publishPlaceFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const place = await fetchEditorGraph(data.id);
    if (!place) return { ok: false as const, problems: ["Place not found."] };
    const problems = validatePlaceForPublish(place);
    if (place.kind === "attraction" && place.parentDestinationId) {
      const client = createAdminSupabaseClient();
      const [parent, translations] = await Promise.all([
        client
          .from("places")
          .select("status")
          .eq("id", place.parentDestinationId)
          .eq("kind", "destination")
          .maybeSingle(),
        client
          .from("place_translations")
          .select("locale,slug")
          .eq("place_id", place.parentDestinationId),
      ]);
      throwOnError(parent.error);
      throwOnError(translations.error);
      if (parent.data?.status !== "published") {
        problems.push("Publish the parent destination before publishing this attraction.");
      }
      if (
        !(["en", "fr"] as const).every((locale) =>
          translations.data?.some(
            (translation) => translation.locale === locale && translation.slug,
          ),
        )
      ) {
        problems.push("The parent destination needs English and French slugs.");
      }
    }
    if (problems.length) return { ok: false as const, problems };
    const { error } = await createAdminSupabaseClient()
      .from("places")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", data.id);
    throwOnError(error);
    return { ok: true as const };
  });

export const unpublishPlaceFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await createAdminSupabaseClient()
      .from("places")
      .update({ status: "draft" })
      .eq("id", data.id);
    throwOnError(error);
    return { ok: true };
  });

async function listMediaAssets(): Promise<GlobalMediaAsset[]> {
  const client = createAdminSupabaseClient();
  const { data, error } = await client
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  throwOnError(error);
  return (data ?? []).map((item) => ({
    id: item.id,
    sourceKind: item.source_kind,
    bucketId: item.bucket_id,
    storagePath: item.storage_path,
    publicUrl: item.public_url,
    mimeType: item.mime_type,
    creditName: item.credit_name,
    creditUrl: item.credit_url,
  }));
}

export const listMediaAssetsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  return listMediaAssets();
});

export const addMediaUrlFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      publicUrl: z
        .string()
        .url()
        .max(1500)
        .refine((value) => /^https?:\/\//i.test(value)),
      creditName: z.string().trim().max(180).default(""),
      creditUrl: z.string().trim().max(1500).default(""),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const { data: asset, error } = await client
      .from("media_assets")
      .upsert(
        {
          source_kind: "url",
          bucket_id: null,
          storage_path: null,
          public_url: data.publicUrl,
          credit_name: data.creditName,
          credit_url: data.creditUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "public_url" },
      )
      .select("*")
      .single();
    throwOnError(error);
    return {
      id: asset!.id,
      sourceKind: asset!.source_kind,
      bucketId: asset!.bucket_id,
      storagePath: asset!.storage_path,
      publicUrl: asset!.public_url,
      mimeType: asset!.mime_type,
      creditName: asset!.credit_name,
      creditUrl: asset!.credit_url,
    } satisfies GlobalMediaAsset;
  });

export const requestMediaUploadFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
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
    const extension = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
    }[data.contentType];
    const path = `library/${new Date().getUTCFullYear()}/${crypto.randomUUID()}.${extension}`;
    const client = createAdminSupabaseClient();
    const { data: signed, error } = await client.storage
      .from("site-media")
      .createSignedUploadUrl(path);
    throwOnError(error);
    return {
      path,
      token: signed!.token,
      publicUrl: client.storage.from("site-media").getPublicUrl(path).data.publicUrl,
      ...readPublicSupabaseConfig(),
    };
  });

export const confirmMediaUploadFn = createServerFn({ method: "POST" })
  .validator(z.object({ path: z.string().startsWith("library/").max(500) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const publicUrl = client.storage.from("site-media").getPublicUrl(data.path).data.publicUrl;
    const { data: asset, error } = await client
      .from("media_assets")
      .upsert(
        {
          source_kind: "upload",
          bucket_id: "site-media",
          storage_path: data.path,
          public_url: publicUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "public_url" },
      )
      .select("*")
      .single();
    throwOnError(error);
    return {
      id: asset!.id,
      sourceKind: asset!.source_kind,
      bucketId: asset!.bucket_id,
      storagePath: asset!.storage_path,
      publicUrl: asset!.public_url,
      mimeType: asset!.mime_type,
      creditName: asset!.credit_name,
      creditUrl: asset!.credit_url,
    } satisfies GlobalMediaAsset;
  });

export async function listPublishedPlaceEntries() {
  const client = createPublicSupabaseClient();
  const { data, error } = await client
    .from("place_translations")
    .select(
      "place_id,locale,slug,title,seo_description,places(kind,parent_destination_id,updated_at)",
    )
    .neq("slug", "");
  throwOnError(error);
  const rows = data ?? [];
  return rows.flatMap((entry) => {
    const place = Array.isArray(entry.places) ? entry.places[0] : entry.places;
    if (!place) return [];
    const parentSlug = place.parent_destination_id
      ? rows.find(
          (candidate) =>
            candidate.place_id === place.parent_destination_id && candidate.locale === entry.locale,
        )?.slug
      : undefined;
    if (place.kind === "attraction" && !parentSlug) return [];
    return [
      {
        id: entry.place_id,
        locale: entry.locale as PlaceLocale,
        title: entry.title,
        seoDescription: entry.seo_description,
        href: placePath(place.kind, entry.locale as PlaceLocale, entry.slug, parentSlug),
        updatedAt: place.updated_at,
      },
    ];
  });
}

export function placeJsonLd(place: PlaceViewModel) {
  const canonical = `${place.siteUrl}${place.href}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": place.kind === "destination" ? "City" : "TouristAttraction",
    name: place.title,
    description: place.seoDescription,
    image: place.heroImage,
    url: canonical,
    geo: {
      "@type": "GeoCoordinates",
      longitude: place.coordinates[0],
      latitude: place.coordinates[1],
    },
  }).replace(/</g, "\\u003c");
}
