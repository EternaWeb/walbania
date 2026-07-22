-- Upgrade the existing Berat destination and Berat Castle attraction with the
-- current SEO title format, descriptions, and dedicated social/search thumbnails.
-- Run after: migrations/202607220003_place_seo_and_thumbnails.sql
-- Safe to run more than once. This script does not create or replace either page.

begin;

do $$
declare
  berat_id uuid;
  castle_id uuid;
  berat_thumbnail_id uuid;
  castle_thumbnail_id uuid;
begin
  select pt.place_id
    into berat_id
  from public.place_translations pt
  join public.places p on p.id = pt.place_id
  where pt.locale = 'en'
    and pt.slug = 'berat'
    and p.kind = 'destination';

  if berat_id is null then
    raise exception 'Berat destination was not found. Run berat-places-example.sql first.';
  end if;

  select pt.place_id
    into castle_id
  from public.place_translations pt
  join public.places p on p.id = pt.place_id
  where pt.locale = 'en'
    and pt.slug = 'berat-castle'
    and p.kind = 'attraction';

  if castle_id is null then
    raise exception 'Berat Castle attraction was not found. Run berat-places-example.sql first.';
  end if;

  update public.place_translations
  set seo_title = 'Berat — The City of 1000 Windows | Wonder Albania',
      seo_description = 'Explore Berat’s Ottoman neighbourhoods, living hilltop castle, local flavours and tours through central Albania.'
  where place_id = berat_id and locale = 'en';

  update public.place_translations
  set seo_title = 'Berat — La ville aux mille fenêtres | Wonder Albania',
      seo_description = 'Explorez les quartiers ottomans de Berat, sa citadelle habitée, ses saveurs locales et les circuits en Albanie centrale.'
  where place_id = berat_id and locale = 'fr';

  update public.place_translations
  set seo_title = 'Berat Castle — Albania’s Living Citadel | Wonder Albania',
      seo_description = 'Visit Berat Castle for Byzantine churches, the Onufri Museum, sweeping Osum views and tours of Albania’s living citadel.'
  where place_id = castle_id and locale = 'en';

  update public.place_translations
  set seo_title = 'Citadelle de Berat — La forteresse habitée | Wonder Albania',
      seo_description = 'Visitez la citadelle de Berat, ses églises byzantines, le musée Onufri, ses vues sur l’Osum et les circuits associés.'
  where place_id = castle_id and locale = 'fr';

  -- Reuse each page's hero for the first SEO thumbnail. Editors can later assign
  -- a different uploaded image, URL asset, or library asset from the SEO tab.
  select pm.asset_id
    into berat_thumbnail_id
  from public.place_media pm
  where pm.place_id = berat_id and pm.role = 'hero'
  order by pm.sort_order
  limit 1;

  select pm.asset_id
    into castle_thumbnail_id
  from public.place_media pm
  where pm.place_id = castle_id and pm.role = 'hero'
  order by pm.sort_order
  limit 1;

  if berat_thumbnail_id is null or castle_thumbnail_id is null then
    raise exception 'Both pages need a hero image before SEO thumbnails can be assigned.';
  end if;

  insert into public.place_media (place_id, asset_id, role, alt_en, alt_fr, sort_order)
  values
    (berat_id, berat_thumbnail_id, 'thumbnail', 'Mangalem’s white Ottoman houses in Berat', 'Les maisons ottomanes blanches de Mangalem à Berat', 0),
    (castle_id, castle_thumbnail_id, 'thumbnail', 'Berat Castle on its hill above the city', 'La citadelle de Berat sur sa colline au-dessus de la ville', 0)
  on conflict (place_id, role, sort_order) do update
    set asset_id = excluded.asset_id,
        alt_en = excluded.alt_en,
        alt_fr = excluded.alt_fr;
end
$$;

commit;
