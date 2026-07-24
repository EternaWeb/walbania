-- Public holiday collection pages backed by the existing tour categories.
-- Safe to run after 202607220001_places_and_global_media.sql.

begin;

alter table public.categories
  add column if not exists description_en text not null default '',
  add column if not exists description_fr text not null default '',
  add column if not exists hero_asset_id uuid references public.media_assets(id) on delete set null,
  add column if not exists hero_alt_en text not null default '',
  add column if not exists hero_alt_fr text not null default '',
  add column if not exists collection_enabled boolean not null default false,
  add column if not exists collection_sort_order smallint not null default 0;

create index if not exists categories_collection_public_idx
  on public.categories (collection_enabled, active, collection_sort_order, name_en);
create index if not exists categories_hero_asset_idx
  on public.categories (hero_asset_id)
  where hero_asset_id is not null;

insert into public.media_assets (source_kind, public_url, mime_type, credit_name, credit_url)
values
  (
    'url',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1800&q=84',
    'image/jpeg',
    'Unsplash',
    'https://unsplash.com'
  ),
  (
    'url',
    'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1800&q=84',
    'image/jpeg',
    'Unsplash',
    'https://unsplash.com'
  ),
  (
    'url',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=84',
    'image/jpeg',
    'Unsplash',
    'https://unsplash.com'
  ),
  (
    'url',
    'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=84',
    'image/jpeg',
    'Unsplash',
    'https://unsplash.com'
  )
on conflict (public_url) do nothing;

insert into public.categories (
  key,
  name_en,
  name_fr,
  description_en,
  description_fr,
  hero_alt_en,
  hero_alt_fr,
  collection_enabled,
  collection_sort_order,
  active
)
values
  (
    'couples-holidays',
    'Couples Holidays',
    'Séjours en couple',
    'Private journeys made for two, balancing slow coastal days, characterful stays and thoughtful experiences with the freedom to travel at your own pace.',
    'Des voyages privés conçus pour deux, entre journées paisibles sur la côte, hébergements de caractère et expériences choisies avec soin.',
    'A couple enjoying a coastal holiday',
    'Un couple profitant de vacances sur la côte',
    true,
    10,
    true
  ),
  (
    'family-holiday',
    'Family Holidays',
    'Vacances en famille',
    'Flexible Albania holidays for every generation, with comfortable transfers, family-friendly stays and days that leave room for both discovery and rest.',
    'Des vacances flexibles en Albanie pour toutes les générations, avec des transferts confortables, des hébergements adaptés et un rythme équilibré.',
    'A family exploring together on holiday',
    'Une famille voyageant ensemble',
    true,
    20,
    true
  ),
  (
    'summer-holidays',
    'Summer Holidays',
    'Vacances d’été',
    'Warm days shaped around Albania’s coast, quiet coves and lively seaside towns, with local access that takes the experience beyond the obvious beaches.',
    'Des journées d’été entre littoral albanais, criques tranquilles et villes balnéaires vivantes, avec un accès local au-delà des plages les plus connues.',
    'Clear water on the Albanian coast in summer',
    'Eaux claires de la côte albanaise en été',
    true,
    30,
    true
  ),
  (
    'hiking-tours',
    'Hiking Tours',
    'Circuits de randonnée',
    'Guided routes through Albania’s wildest landscapes, supported by experienced local guides, carefully chosen guesthouses and practical on-the-ground planning.',
    'Des itinéraires guidés dans les paysages les plus sauvages d’Albanie, accompagnés par des guides locaux expérimentés et une organisation attentive.',
    'Hikers crossing the Albanian mountains',
    'Randonneurs dans les montagnes albanaises',
    true,
    40,
    true
  )
on conflict (key) do update set
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  description_en = excluded.description_en,
  description_fr = excluded.description_fr,
  hero_alt_en = excluded.hero_alt_en,
  hero_alt_fr = excluded.hero_alt_fr,
  collection_enabled = excluded.collection_enabled,
  collection_sort_order = excluded.collection_sort_order,
  active = excluded.active,
  updated_at = now();

update public.categories category
set hero_asset_id = asset.id
from public.media_assets asset
where
  (category.key = 'couples-holidays' and asset.public_url like '%photo-1502680390469-be75c86b636f%')
  or (category.key = 'family-holiday' and asset.public_url like '%photo-1602002418082-a4443e081dd1%')
  or (category.key = 'summer-holidays' and asset.public_url like '%photo-1507525428034-b723cf961d3e%')
  or (category.key = 'hiking-tours' and asset.public_url like '%photo-1551632811-561732d1e306%');

commit;
