-- Reusable destination / attraction insert template.
-- Edit the values in this file, then run it after the places migration.

begin;

do $$
declare
  new_place_id uuid := gen_random_uuid();
  parent_destination_id uuid := null; -- Required when place_kind = 'attraction'.
  hero_asset_id uuid;
  card_asset_id uuid;
  section_asset_ids uuid[] := array[]::uuid[];
  place_kind text := 'destination'; -- destination | attraction
begin
  insert into public.media_assets (
    source_kind, public_url, mime_type, credit_name, credit_url
  ) values
    ('url', 'https://example.com/hero.jpg', 'image/jpeg', 'Photographer', 'https://example.com/source')
  on conflict (public_url) do update set credit_name = excluded.credit_name
  returning id into hero_asset_id;

  insert into public.media_assets (
    source_kind, public_url, mime_type, credit_name, credit_url
  ) values
    ('url', 'https://example.com/card.jpg', 'image/jpeg', 'Photographer', 'https://example.com/source')
  on conflict (public_url) do update set credit_name = excluded.credit_name
  returning id into card_asset_id;

  insert into public.places (
    id, kind, parent_destination_id, status, featured,
    longitude, latitude, map_zoom, published_at
  ) values (
    new_place_id, place_kind, parent_destination_id, 'draft', false,
    19.9522, 40.7058, 11, null
  );

  insert into public.place_translations (
    place_id, locale, slug, title, seo_title, seo_description, hero_intro, hero_alt,
    story_title, story_intro
  ) values
    (new_place_id, 'en', 'place-slug', 'Place name', 'Place name | Wonder Albania',
      'English search description.', 'Short English hero introduction.', 'English hero image description.',
      'Three ways to understand Place name', 'Short introduction for the three stacked story cards.'),
    (new_place_id, 'fr', 'lieu-slug', 'Nom du lieu', 'Nom du lieu | Wonder Albania',
      'Description française pour les moteurs de recherche.', 'Courte introduction française.', 'Description française de l’image principale.',
      'Trois façons de comprendre Nom du lieu', 'Courte introduction pour les trois cartes superposées.');

  -- A published page must have exactly three ordered story sections.
  insert into public.place_sections (
    place_id, title_en, title_fr, body_en, body_fr,
    secondary_body_en, secondary_body_fr, image_alt_en, image_alt_fr,
    media_asset_id, sort_order
  ) values
    (new_place_id, 'First story', 'Premier récit', 'English copy.', 'Texte français.', '', '', 'English image description.', 'Description française de l’image.', hero_asset_id, 0),
    (new_place_id, 'Second story', 'Deuxième récit', 'English copy.', 'Texte français.', '', '', 'English image description.', 'Description française de l’image.', hero_asset_id, 1),
    (new_place_id, 'Third story', 'Troisième récit', 'English copy.', 'Texte français.', '', '', 'English image description.', 'Description française de l’image.', hero_asset_id, 2);

  insert into public.place_media (place_id, asset_id, role, alt_en, alt_fr, sort_order)
  values
    (new_place_id, hero_asset_id, 'hero', 'English hero alt text', 'Texte alternatif français', 0),
    (new_place_id, card_asset_id, 'card', 'English card alt text', 'Texte alternatif français', 0);

  insert into public.place_facts (
    place_id, group_key, icon_key, value, label_en, label_fr, sort_order
  ) values
    (new_place_id, 'quick', 'clock', '2–3 days', 'Recommended stay', 'Séjour conseillé', 0),
    (new_place_id, 'weather', 'sun', '26°C', 'Summer average', 'Moyenne estivale', 0);

  insert into public.place_highlights (
    place_id, icon_key, label_en, label_fr, text_en, text_fr, sort_order
  ) values
    (new_place_id, 'landmark', 'Known for', 'Réputé pour', 'A memorable local experience.', 'Une expérience locale mémorable.', 0);

  -- Explicit tour links are authoritative. Change the slug and order as needed.
  insert into public.place_tours (place_id, tour_id, relationship, source, visible, sort_order)
  select new_place_id, tt.tour_id, 'visit', 'manual', true, row_number() over (order by tt.title)::int - 1
  from public.tour_translations tt
  where tt.locale = 'en' and tt.slug in ('example-tour-slug')
  on conflict (place_id, tour_id) do update set
    relationship = excluded.relationship,
    source = 'manual',
    visible = excluded.visible,
    sort_order = excluded.sort_order;
end
$$;

commit;
