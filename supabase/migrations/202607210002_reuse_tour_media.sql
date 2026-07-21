begin;

alter table public.tour_media
  drop constraint if exists tour_media_storage_path_key;

create index if not exists tour_media_storage_path_idx
  on public.tour_media (storage_path);

create table if not exists public.tour_media_assets (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  alt_en text not null default '',
  alt_fr text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tour_media_assets_tour_idx
  on public.tour_media_assets (tour_id, created_at desc);

insert into public.tour_media_assets (
  tour_id,
  storage_path,
  public_url,
  alt_en,
  alt_fr
)
select distinct on (storage_path)
  tour_id,
  storage_path,
  public_url,
  alt_en,
  alt_fr
from public.tour_media
order by storage_path, (alt_en <> '' or alt_fr <> '') desc
on conflict (storage_path) do update set
  public_url = excluded.public_url,
  alt_en = case
    when excluded.alt_en <> '' then excluded.alt_en
    else public.tour_media_assets.alt_en
  end,
  alt_fr = case
    when excluded.alt_fr <> '' then excluded.alt_fr
    else public.tour_media_assets.alt_fr
  end,
  updated_at = now();

alter table public.tour_media_assets enable row level security;

commit;
