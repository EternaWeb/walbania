-- Dynamic destinations, attractions, global media library, and ordered tour links.
-- Safe to run after the existing WonderAlbania tour schema.

begin;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  source_kind text not null check (source_kind in ('upload', 'url')),
  bucket_id text,
  storage_path text,
  public_url text not null unique,
  mime_type text not null default 'image/jpeg',
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  credit_name text not null default '',
  credit_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_asset_source_check check (
    (source_kind = 'upload' and bucket_id is not null and storage_path is not null)
    or (source_kind = 'url' and bucket_id is null and storage_path is null)
  )
);
create unique index if not exists media_assets_storage_idx
  on public.media_assets (bucket_id, storage_path)
  where storage_path is not null;

insert into public.media_assets (
  source_kind, bucket_id, storage_path, public_url, credit_name, credit_url
)
select distinct on (public_url)
  'upload', 'tour-media', storage_path, public_url, '', ''
from public.tour_media_assets
where public_url <> '' and storage_path <> ''
order by public_url, updated_at desc
on conflict (public_url) do nothing;

insert into public.media_assets (
  source_kind, bucket_id, storage_path, public_url, credit_name, credit_url
)
select distinct on (public_url)
  'upload', 'tour-media', storage_path, public_url, '', ''
from public.tour_media
where public_url <> '' and storage_path <> ''
order by public_url, sort_order
on conflict (public_url) do nothing;

alter table public.tour_media add column if not exists asset_id uuid;
update public.tour_media tm
set asset_id = ma.id
from public.media_assets ma
where tm.asset_id is null and ma.public_url = tm.public_url;
alter table public.tour_media
  drop constraint if exists tour_media_asset_id_fkey;
alter table public.tour_media
  add constraint tour_media_asset_id_fkey
  foreign key (asset_id) references public.media_assets(id) on delete restrict;
create index if not exists tour_media_asset_idx on public.tour_media (asset_id);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('destination', 'attraction')),
  parent_destination_id uuid references public.places(id) on delete restrict,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  longitude double precision check (longitude between -180 and 180),
  latitude double precision check (latitude between -90 and 90),
  map_zoom numeric(4,1) not null default 10 check (map_zoom between 5 and 18),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint place_parent_shape check (
    (kind = 'destination' and parent_destination_id is null)
    or (kind = 'attraction' and parent_destination_id is not null)
  ),
  constraint published_place_has_timestamp check (status <> 'published' or published_at is not null)
);
create index if not exists places_public_idx on public.places (kind, status, featured, published_at desc);
create index if not exists places_parent_idx on public.places (parent_destination_id, status);

create table if not exists public.place_translations (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  locale text not null check (locale in ('en', 'fr')),
  slug text not null default '' check (slug = '' or slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  hero_intro text not null default '',
  hero_alt text not null default '',
  story_title text not null default '',
  story_intro text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (place_id, locale)
);
create unique index if not exists place_translations_slug_idx
  on public.place_translations (locale, slug)
  where slug <> '';
create unique index if not exists place_translations_seo_title_idx
  on public.place_translations (locale, lower(seo_title))
  where seo_title <> '';

create table if not exists public.place_slug_redirects (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  locale text not null check (locale in ('en', 'fr')),
  old_path text not null check (old_path like '/%'),
  created_at timestamptz not null default now(),
  unique (locale, old_path)
);

create table if not exists public.place_sections (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  title_en text not null default '',
  title_fr text not null default '',
  body_en text not null default '',
  body_fr text not null default '',
  secondary_body_en text not null default '',
  secondary_body_fr text not null default '',
  image_alt_en text not null default '',
  image_alt_fr text not null default '',
  media_asset_id uuid references public.media_assets(id) on delete restrict,
  sort_order smallint not null check (sort_order between 0 and 2),
  unique (place_id, sort_order)
);

create table if not exists public.place_facts (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  group_key text not null check (group_key in ('quick', 'weather')),
  icon_key text not null default 'map',
  value text not null default '',
  label_en text not null default '',
  label_fr text not null default '',
  sort_order integer not null default 0,
  unique (place_id, group_key, sort_order)
);

create table if not exists public.place_highlights (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  icon_key text not null default 'sparkles',
  label_en text not null default '',
  label_fr text not null default '',
  text_en text not null default '',
  text_fr text not null default '',
  sort_order integer not null default 0,
  unique (place_id, sort_order)
);

create table if not exists public.place_media (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  asset_id uuid not null references public.media_assets(id) on delete restrict,
  role text not null check (role in ('hero', 'card', 'gallery', 'thumbnail')),
  alt_en text not null default '',
  alt_fr text not null default '',
  sort_order integer not null default 0,
  unique (place_id, role, sort_order)
);
create unique index if not exists place_media_single_hero_idx
  on public.place_media (place_id) where role = 'hero';
create unique index if not exists place_media_single_card_idx
  on public.place_media (place_id) where role = 'card';
create unique index if not exists place_media_single_thumbnail_idx
  on public.place_media (place_id) where role = 'thumbnail';
create index if not exists place_media_asset_idx on public.place_media (asset_id);

create table if not exists public.place_tours (
  place_id uuid not null references public.places(id) on delete cascade,
  tour_id uuid not null references public.tours(id) on delete cascade,
  relationship text not null default 'visit' check (relationship in ('start', 'visit', 'end', 'area')),
  source text not null default 'manual' check (source in ('manual', 'itinerary', 'inherited')),
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (place_id, tour_id)
);
create index if not exists place_tours_tour_idx on public.place_tours (tour_id, visible, sort_order);

create or replace function public.validate_place_parent()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  parent_kind text;
begin
  if new.kind = 'destination' then
    new.parent_destination_id := null;
    return new;
  end if;
  select kind into parent_kind from public.places where id = new.parent_destination_id;
  if parent_kind is distinct from 'destination' then
    raise exception 'An attraction parent must be a destination.';
  end if;
  if new.parent_destination_id = new.id then
    raise exception 'A place cannot be its own parent.';
  end if;
  return new;
end;
$$;
drop trigger if exists validate_place_parent on public.places;
create trigger validate_place_parent
  before insert or update of kind, parent_destination_id on public.places
  for each row execute function public.validate_place_parent();

create or replace function public.sync_inherited_place_tour()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  parent_id uuid;
  affected_tour_id uuid;
  child_place_id uuid;
begin
  if tg_op = 'DELETE' then
    affected_tour_id := old.tour_id;
    child_place_id := old.place_id;
  else
    affected_tour_id := new.tour_id;
    child_place_id := new.place_id;
  end if;
  select parent_destination_id into parent_id
  from public.places
  where id = child_place_id and kind = 'attraction';

  if parent_id is null then
    if tg_op = 'DELETE' then return old; else return new; end if;
  end if;

  if tg_op <> 'DELETE' then
    insert into public.place_tours (
      place_id, tour_id, relationship, source, visible, sort_order
    ) values (
      parent_id, affected_tour_id, 'area', 'inherited', new.visible, new.sort_order
    )
    on conflict (place_id, tour_id) do nothing;
  else
    delete from public.place_tours parent_link
    where parent_link.place_id = parent_id
      and parent_link.tour_id = affected_tour_id
      and parent_link.source = 'inherited'
      and not exists (
        select 1
        from public.place_tours child_link
        join public.places child on child.id = child_link.place_id
        where child.parent_destination_id = parent_id
          and child_link.tour_id = affected_tour_id
      );
  end if;
  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;
drop trigger if exists sync_inherited_place_tour on public.place_tours;
create trigger sync_inherited_place_tour
  after insert or delete on public.place_tours
  for each row execute function public.sync_inherited_place_tour();

create or replace function public.is_published_place(target_place_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.places where id = target_place_id and status = 'published'
  );
$$;
revoke all on function public.is_published_place(uuid) from public;
grant execute on function public.is_published_place(uuid) to anon, authenticated, service_role;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['media_assets', 'places', 'place_translations', 'place_tours']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name
    );
  end loop;
end;
$$;

alter table public.media_assets enable row level security;
alter table public.places enable row level security;
alter table public.place_translations enable row level security;
alter table public.place_slug_redirects enable row level security;
alter table public.place_sections enable row level security;
alter table public.place_facts enable row level security;
alter table public.place_highlights enable row level security;
alter table public.place_media enable row level security;
alter table public.place_tours enable row level security;

drop policy if exists "public reads published places" on public.places;
create policy "public reads published places" on public.places
  for select to anon, authenticated using (status = 'published');
drop policy if exists "public reads published place translations" on public.place_translations;
create policy "public reads published place translations" on public.place_translations
  for select to anon, authenticated using (public.is_published_place(place_id));
drop policy if exists "public reads published place redirects" on public.place_slug_redirects;
create policy "public reads published place redirects" on public.place_slug_redirects
  for select to anon, authenticated using (public.is_published_place(place_id));
drop policy if exists "public reads published place sections" on public.place_sections;
create policy "public reads published place sections" on public.place_sections
  for select to anon, authenticated using (public.is_published_place(place_id));
drop policy if exists "public reads published place facts" on public.place_facts;
create policy "public reads published place facts" on public.place_facts
  for select to anon, authenticated using (public.is_published_place(place_id));
drop policy if exists "public reads published place highlights" on public.place_highlights;
create policy "public reads published place highlights" on public.place_highlights
  for select to anon, authenticated using (public.is_published_place(place_id));
drop policy if exists "public reads published place media" on public.place_media;
create policy "public reads published place media" on public.place_media
  for select to anon, authenticated using (public.is_published_place(place_id));
drop policy if exists "public reads published place tours" on public.place_tours;
create policy "public reads published place tours" on public.place_tours
  for select to anon, authenticated using (
    visible and public.is_published_place(place_id) and public.is_published_tour(tour_id)
  );
drop policy if exists "public reads assigned media assets" on public.media_assets;
create policy "public reads assigned media assets" on public.media_assets
  for select to anon, authenticated using (
    exists (
      select 1 from public.place_media pm
      where pm.asset_id = media_assets.id and public.is_published_place(pm.place_id)
    )
    or exists (
      select 1 from public.place_sections ps
      where ps.media_asset_id = media_assets.id and public.is_published_place(ps.place_id)
    )
    or exists (
      select 1 from public.tour_media tm
      where tm.asset_id = media_assets.id and public.is_published_tour(tm.tour_id)
    )
  );

grant select on public.media_assets, public.places, public.place_translations,
  public.place_slug_redirects, public.place_sections, public.place_facts,
  public.place_highlights, public.place_media, public.place_tours
to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/avif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

commit;
