import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminSession } from "../admin/auth";
import { createAdminSupabaseClient, createPublicSupabaseClient } from "../supabase";
import { getPublishedTourListingFn } from "../tours/server";
import type {
  CollectionAdminData,
  CollectionAdminItem,
  CollectionDetail,
  CollectionLocale,
  CollectionSummary,
} from "./types";

const FALLBACK_COLLECTIONS: Record<string, Omit<CollectionSummary, "href">> = {
  "couples-holidays": {
    id: "fallback-couples-holidays",
    key: "couples-holidays",
    name: "Couples Holidays",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1800&q=84",
    imageAlt: "A couple enjoying a coastal holiday",
    description:
      "Private journeys made for two, balancing slow coastal days, characterful stays and thoughtful experiences with the freedom to travel at your own pace.",
    sortOrder: 10,
  },
  "family-holiday": {
    id: "fallback-family-holiday",
    key: "family-holiday",
    name: "Family Holidays",
    image:
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1800&q=84",
    imageAlt: "A family exploring together on holiday",
    description:
      "Flexible Albania holidays for every generation, with comfortable transfers, family-friendly stays and days that leave room for both discovery and rest.",
    sortOrder: 20,
  },
  "summer-holidays": {
    id: "fallback-summer-holidays",
    key: "summer-holidays",
    name: "Summer Holidays",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=84",
    imageAlt: "Clear water on the Albanian coast in summer",
    description:
      "Warm days shaped around Albania’s coast, quiet coves and lively seaside towns, with local access that takes the experience beyond the obvious beaches.",
    sortOrder: 30,
  },
  "hiking-tours": {
    id: "fallback-hiking-tours",
    key: "hiking-tours",
    name: "Hiking Tours",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=84",
    imageAlt: "Hikers crossing the Albanian mountains",
    description:
      "Guided routes through Albania’s wildest landscapes, supported by experienced local guides, carefully chosen guesthouses and practical on-the-ground planning.",
    sortOrder: 40,
  },
};

const localeSchema = z.object({ locale: z.enum(["en", "fr"]) });
const collectionLookupSchema = localeSchema.extend({
  key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});
const collectionInputSchema = z.object({
  id: z.string().uuid(),
  nameEn: z.string().trim().min(1).max(120),
  nameFr: z.string().trim().min(1).max(120),
  descriptionEn: z.string().trim().min(1).max(3000),
  descriptionFr: z.string().trim().min(1).max(3000),
  heroAssetId: z.string().uuid().nullable(),
  heroAltEn: z.string().trim().min(1).max(240),
  heroAltFr: z.string().trim().min(1).max(240),
  enabled: z.boolean(),
  active: z.boolean(),
  sortOrder: z.number().int().min(0).max(999),
});

function fallbackCollections(locale: CollectionLocale): CollectionSummary[] {
  const frenchNames: Record<string, string> = {
    "couples-holidays": "Séjours en couple",
    "family-holiday": "Vacances en famille",
    "summer-holidays": "Vacances d’été",
    "hiking-tours": "Circuits de randonnée",
  };
  return Object.values(FALLBACK_COLLECTIONS).map((item) => ({
    ...item,
    name: locale === "fr" ? frenchNames[item.key] : item.name,
    href: `/collection/${item.key}`,
  }));
}

async function loadPublicCollections(locale: CollectionLocale): Promise<CollectionSummary[]> {
  try {
    const client = createPublicSupabaseClient();
    const { data: categories, error } = await client
      .from("categories")
      .select(
        "id,key,name_en,name_fr,description_en,description_fr,hero_asset_id,hero_alt_en,hero_alt_fr,collection_sort_order",
      )
      .eq("active", true)
      .eq("collection_enabled", true)
      .order("collection_sort_order")
      .order("name_en");
    if (error) return fallbackCollections(locale);
    if (!categories?.length) return [];

    const assetIds = categories
      .map((category) => category.hero_asset_id)
      .filter((id): id is string => Boolean(id));
    const { data: assets } = assetIds.length
      ? await client.from("media_assets").select("id,public_url").in("id", assetIds)
      : { data: [] as Array<{ id: string; public_url: string }> };

    return categories.map((category) => {
      const fallback = FALLBACK_COLLECTIONS[category.key];
      const image =
        assets?.find((asset) => asset.id === category.hero_asset_id)?.public_url ??
        fallback?.image ??
        "";
      return {
        id: category.id,
        key: category.key,
        name: locale === "fr" ? category.name_fr : category.name_en,
        href: `/collection/${category.key}`,
        image,
        imageAlt:
          (locale === "fr" ? category.hero_alt_fr : category.hero_alt_en) ||
          fallback?.imageAlt ||
          category.name_en,
        description:
          (locale === "fr" ? category.description_fr : category.description_en) ||
          fallback?.description ||
          "",
        sortOrder: Number(category.collection_sort_order),
      };
    });
  } catch {
    return fallbackCollections(locale);
  }
}

export const getPublicCollectionsFn = createServerFn({ method: "GET" })
  .validator(localeSchema)
  .handler(({ data }) => loadPublicCollections(data.locale));

export async function listPublicCollectionEntries() {
  return loadPublicCollections("en");
}

export const getPublicCollectionFn = createServerFn({ method: "GET" })
  .validator(collectionLookupSchema)
  .handler(async ({ data }): Promise<CollectionDetail | null> => {
    const collections = await loadPublicCollections(data.locale);
    const collection = collections.find((item) => item.key === data.key);
    if (!collection) return null;

    try {
      const listing = await getPublishedTourListingFn({ data: { locale: data.locale } });
      return {
        ...collection,
        tours: listing.tours.filter((tour) => tour.categoryIds.includes(collection.id)),
      };
    } catch {
      return { ...collection, tours: [] };
    }
  });

export const listAdminCollectionsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CollectionAdminData> => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const [{ data: categories, error }, { data: mediaAssets, error: mediaError }] =
      await Promise.all([
        client
          .from("categories")
          .select(
            "id,key,name_en,name_fr,description_en,description_fr,hero_asset_id,hero_alt_en,hero_alt_fr,collection_enabled,collection_sort_order,active",
          )
          .in("key", Object.keys(FALLBACK_COLLECTIONS))
          .order("collection_sort_order"),
        client.from("media_assets").select("id,public_url,credit_name").order("created_at", {
          ascending: false,
        }),
      ]);
    if (error) throw new Error(`${error.message} Apply the holiday collections SQL migration.`);
    if (mediaError) throw new Error(mediaError.message);

    const collections: CollectionAdminItem[] = (categories ?? []).map((category) => ({
      id: category.id,
      key: category.key,
      nameEn: category.name_en,
      nameFr: category.name_fr,
      descriptionEn: category.description_en,
      descriptionFr: category.description_fr,
      heroAssetId: category.hero_asset_id,
      heroAltEn: category.hero_alt_en,
      heroAltFr: category.hero_alt_fr,
      enabled: category.collection_enabled,
      active: category.active,
      sortOrder: Number(category.collection_sort_order),
      image: mediaAssets?.find((asset) => asset.id === category.hero_asset_id)?.public_url ?? "",
    }));

    return {
      collections,
      mediaAssets: (mediaAssets ?? []).map((asset) => ({
        id: asset.id,
        publicUrl: asset.public_url,
        creditName: asset.credit_name,
      })),
    };
  },
);

export const saveCollectionFn = createServerFn({ method: "POST" })
  .validator(collectionInputSchema)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const client = createAdminSupabaseClient();
    const { error } = await client
      .from("categories")
      .update({
        name_en: data.nameEn,
        name_fr: data.nameFr,
        description_en: data.descriptionEn,
        description_fr: data.descriptionFr,
        hero_asset_id: data.heroAssetId,
        hero_alt_en: data.heroAltEn,
        hero_alt_fr: data.heroAltFr,
        collection_enabled: data.enabled,
        collection_sort_order: data.sortOrder,
        active: data.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
