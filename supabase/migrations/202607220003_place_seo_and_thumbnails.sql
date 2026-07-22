-- Adds a dedicated reusable SEO/social thumbnail to every place and enforces
-- distinct page titles per language. Safe after the earlier place migrations.

begin;

alter table public.place_media
  drop constraint if exists place_media_role_check;
alter table public.place_media
  add constraint place_media_role_check
  check (role in ('hero', 'card', 'gallery', 'thumbnail'));

create unique index if not exists place_media_single_thumbnail_idx
  on public.place_media (place_id) where role = 'thumbnail';

-- Existing places receive a thumbnail automatically. Prefer their card image,
-- then fall back to the hero. Admins can replace it with a purpose-made image.
insert into public.place_media (
  place_id, asset_id, role, alt_en, alt_fr, sort_order
)
select distinct on (media.place_id)
  media.place_id,
  media.asset_id,
  'thumbnail',
  media.alt_en,
  media.alt_fr,
  0
from public.place_media media
where media.role in ('card', 'hero')
order by media.place_id, case when media.role = 'card' then 0 else 1 end
on conflict (place_id, role, sort_order) do nothing;

create unique index if not exists place_translations_seo_title_idx
  on public.place_translations (locale, lower(seo_title))
  where seo_title <> '';

commit;
