-- WonderAlbania tour CMS
-- Run once in a fresh Supabase project from the SQL Editor.

begin;

create extension if not exists pgcrypto;

create table public.tour_types (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_en text not null,
  name_fr text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.difficulties (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_en text not null,
  name_fr text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_en text not null,
  name_fr text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tours (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  base_price_eur numeric(10,2) not null default 0 check (base_price_eur >= 0),
  discount_percent smallint check (discount_percent between 1 and 99),
  default_available boolean not null default true,
  duration_value numeric(6,1) not null default 8 check (duration_value > 0),
  duration_unit text not null default 'hours' check (duration_unit in ('hours', 'days')),
  max_group_size integer not null default 8 check (max_group_size > 0),
  language_codes text[] not null default array['EN','FR','SQ']::text[],
  start_place text not null default '',
  end_place text not null default '',
  accessibility_en text not null default '',
  accessibility_fr text not null default '',
  region_en text not null default '',
  region_fr text not null default '',
  route_distance_km numeric(10,2) check (route_distance_km >= 0),
  tour_type_id uuid references public.tour_types(id) on delete restrict,
  difficulty_id uuid references public.difficulties(id) on delete restrict,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_has_timestamp check (status <> 'published' or published_at is not null)
);

create unique index tours_single_featured_idx
  on public.tours (featured)
  where featured = true and status = 'published';
create index tours_status_published_idx on public.tours (status, published_at desc);

create table public.tour_translations (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  locale text not null check (locale in ('en', 'fr')),
  slug text not null check (slug = '' or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  hero_badge text not null default '',
  location_label text not null default '',
  hero_intro text not null default '',
  overview_title text not null default '',
  overview_summary text not null default '',
  overview_body text not null default '',
  best_season_title text not null default '',
  best_season_body text not null default '',
  route_title text not null default '',
  route_description text not null default '',
  cancellation_summary text not null default '',
  hero_alt text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tour_id, locale)
);
create unique index tour_translations_slug_idx
  on public.tour_translations (locale, slug)
  where slug <> '';

create table public.tour_slug_redirects (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  locale text not null check (locale in ('en', 'fr')),
  old_slug text not null check (old_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  unique (locale, old_slug)
);

create table public.tour_categories (
  tour_id uuid not null references public.tours(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  primary key (tour_id, category_id)
);
create index tour_categories_category_idx on public.tour_categories (category_id, tour_id);

create table public.tour_highlights (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  icon_key text not null default 'sparkles',
  label_en text not null default '',
  label_fr text not null default '',
  text_en text not null default '',
  text_fr text not null default '',
  sort_order integer not null default 0,
  unique (tour_id, sort_order)
);

create table public.tour_media (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  role text not null check (role in ('hero', 'gallery')),
  storage_path text not null,
  public_url text not null,
  alt_en text not null default '',
  alt_fr text not null default '',
  sort_order integer not null default 0,
  unique (tour_id, role, sort_order)
);
create unique index tour_media_single_hero_idx on public.tour_media (tour_id) where role = 'hero';
create index tour_media_storage_path_idx on public.tour_media (storage_path);

create table public.tour_media_assets (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  alt_en text not null default '',
  alt_fr text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tour_media_assets_tour_idx on public.tour_media_assets (tour_id, created_at desc);

create table public.tour_list_items (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  kind text not null check (kind in ('included', 'excluded', 'bring')),
  text_en text not null default '',
  text_fr text not null default '',
  sort_order integer not null default 0,
  unique (tour_id, kind, sort_order)
);

create table public.tour_weather_stats (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  icon_key text not null default 'sun',
  value text not null default '',
  label_en text not null default '',
  label_fr text not null default '',
  sort_order integer not null default 0,
  unique (tour_id, sort_order)
);

create table public.tour_faqs (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  question_en text not null default '',
  question_fr text not null default '',
  answer_en text not null default '',
  answer_fr text not null default '',
  sort_order integer not null default 0,
  unique (tour_id, sort_order)
);

create table public.tour_itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  start_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  type_en text not null default '',
  type_fr text not null default '',
  place_en text not null default '',
  place_fr text not null default '',
  description_en text not null default '',
  description_fr text not null default '',
  location_query text not null default '',
  location_label text not null default '',
  longitude double precision check (longitude between -180 and 180),
  latitude double precision check (latitude between -90 and 90),
  osm_reference text not null default '',
  sort_order integer not null default 0,
  unique (tour_id, sort_order)
);

create table public.tour_date_overrides (
  tour_id uuid not null references public.tours(id) on delete cascade,
  date date not null,
  is_available boolean not null default true,
  price_eur numeric(10,2) check (price_eur >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tour_id, date)
);
create index tour_date_overrides_date_idx on public.tour_date_overrides (tour_id, date);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  review_date date not null,
  nation_code text not null check (nation_code ~ '^[A-Z]{2}$'),
  rating smallint not null check (rating between 1 and 5),
  travel_type text not null check (
    travel_type in ('solo', 'couple', 'family', 'friends', 'group', 'business', 'other')
  ),
  original_language text not null,
  body_original text not null,
  body_en text not null default '',
  body_fr text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tour_reviews (
  tour_id uuid not null references public.tours(id) on delete cascade,
  review_id uuid not null references public.reviews(id) on delete restrict,
  sort_order integer not null default 0,
  primary key (tour_id, review_id),
  unique (tour_id, sort_order)
);

create table public.admin_login_attempts (
  id bigint generated by default as identity primary key,
  fingerprint_hash text not null,
  attempted_at timestamptz not null default now()
);
create index admin_login_attempts_lookup_idx
  on public.admin_login_attempts (fingerprint_hash, attempted_at desc);

create table public.geocoding_cache (
  query_key text primary key,
  normalized_query text not null,
  results jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '180 days')
);

create table public.geocoder_state (
  id boolean primary key default true check (id = true),
  last_request_at timestamptz not null default to_timestamp(0)
);
insert into public.geocoder_state (id) values (true) on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'tour_types', 'difficulties', 'categories', 'tours', 'tour_translations',
    'tour_date_overrides', 'reviews'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name
    );
  end loop;
end;
$$;

create or replace function public.is_published_tour(target_tour_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.tours where id = target_tour_id and status = 'published'
  );
$$;

revoke all on function public.is_published_tour(uuid) from public;
grant execute on function public.is_published_tour(uuid) to anon, authenticated, service_role;

alter table public.tour_types enable row level security;
alter table public.difficulties enable row level security;
alter table public.categories enable row level security;
alter table public.tours enable row level security;
alter table public.tour_translations enable row level security;
alter table public.tour_slug_redirects enable row level security;
alter table public.tour_categories enable row level security;
alter table public.tour_highlights enable row level security;
alter table public.tour_media enable row level security;
alter table public.tour_media_assets enable row level security;
alter table public.tour_list_items enable row level security;
alter table public.tour_weather_stats enable row level security;
alter table public.tour_faqs enable row level security;
alter table public.tour_itinerary_stops enable row level security;
alter table public.tour_date_overrides enable row level security;
alter table public.reviews enable row level security;
alter table public.tour_reviews enable row level security;
alter table public.admin_login_attempts enable row level security;
alter table public.geocoding_cache enable row level security;
alter table public.geocoder_state enable row level security;

create policy "public reads active tour types" on public.tour_types
  for select to anon, authenticated using (
    active = true or exists (
      select 1 from public.tours
      where tours.tour_type_id = tour_types.id and tours.status = 'published'
    )
  );
create policy "public reads active difficulties" on public.difficulties
  for select to anon, authenticated using (
    active = true or exists (
      select 1 from public.tours
      where tours.difficulty_id = difficulties.id and tours.status = 'published'
    )
  );
create policy "public reads active categories" on public.categories
  for select to anon, authenticated using (
    active = true or exists (
      select 1 from public.tour_categories
      where tour_categories.category_id = categories.id
        and public.is_published_tour(tour_categories.tour_id)
    )
  );
create policy "public reads published tours" on public.tours
  for select to anon, authenticated using (status = 'published');
create policy "public reads published translations" on public.tour_translations
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published slug redirects" on public.tour_slug_redirects
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published tour categories" on public.tour_categories
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published highlights" on public.tour_highlights
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published media" on public.tour_media
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published list items" on public.tour_list_items
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published weather" on public.tour_weather_stats
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published faqs" on public.tour_faqs
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published itinerary" on public.tour_itinerary_stops
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads published date overrides" on public.tour_date_overrides
  for select to anon, authenticated using (public.is_published_tour(tour_id));
create policy "public reads assigned reviews" on public.reviews
  for select to anon, authenticated using (
    exists (
      select 1 from public.tour_reviews tr
      where tr.review_id = reviews.id and public.is_published_tour(tr.tour_id)
    )
  );
create policy "public reads published review links" on public.tour_reviews
  for select to anon, authenticated using (public.is_published_tour(tour_id));

grant usage on schema public to anon, authenticated;
grant select on public.tour_types, public.difficulties, public.categories, public.tours,
  public.tour_translations, public.tour_slug_redirects, public.tour_categories,
  public.tour_highlights, public.tour_media, public.tour_list_items,
  public.tour_weather_stats, public.tour_faqs, public.tour_itinerary_stops,
  public.tour_date_overrides, public.reviews, public.tour_reviews
to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tour-media',
  'tour-media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/avif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

commit;

-- Existing projects and fresh installs should next run:
--   migrations/202607210001_tour_duration_units.sql
--   migrations/202607210002_reuse_tour_media.sql
--   migrations/202607220001_places_and_global_media.sql
-- The last migration adds the dynamic destinations/attractions CMS and shared media library.
