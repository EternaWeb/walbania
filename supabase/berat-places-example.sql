-- Complete sample content for /destinations/berat and
-- /attractions/berat/berat-castle. Run after the places migration.
-- Images are Wikimedia Commons files with their source credits preserved.

begin;

do $$
declare
  berat_id uuid;
  castle_id uuid;
  mangalem_id uuid;
  gorica_id uuid;
  castle_church_id uuid;
  castle_panorama_id uuid;
  berat_panorama_id uuid;
begin
  insert into public.media_assets (source_kind, public_url, mime_type, credit_name, credit_url)
  values ('url', 'https://commons.wikimedia.org/wiki/Special:FilePath/Mangalem%20Berat%20Albania%202018.2.jpg?width=2400', 'image/jpeg', 'Pasztilla aka Attila Terbócs / Wikimedia Commons (CC BY-SA 4.0)', 'https://commons.wikimedia.org/wiki/File:Mangalem_Berat_Albania_2018.2.jpg')
  on conflict (public_url) do update set credit_name = excluded.credit_name, credit_url = excluded.credit_url
  returning id into mangalem_id;

  insert into public.media_assets (source_kind, public_url, mime_type, credit_name, credit_url)
  values ('url', 'https://commons.wikimedia.org/wiki/Special:FilePath/Gorica%20Berat%20Albania%202018.1.jpg?width=2400', 'image/jpeg', 'Pasztilla aka Attila Terbócs / Wikimedia Commons (CC BY-SA 4.0)', 'https://commons.wikimedia.org/wiki/File:Gorica_Berat_Albania_2018.1.jpg')
  on conflict (public_url) do update set credit_name = excluded.credit_name, credit_url = excluded.credit_url
  returning id into gorica_id;

  insert into public.media_assets (source_kind, public_url, mime_type, credit_name, credit_url)
  values ('url', 'https://commons.wikimedia.org/wiki/Special:FilePath/Berat%20Castle%20Church.jpg?width=2400', 'image/jpeg', 'Karelj / Wikimedia Commons (CC BY-SA 4.0)', 'https://commons.wikimedia.org/wiki/File:Berat_Castle_Church.jpg')
  on conflict (public_url) do update set credit_name = excluded.credit_name, credit_url = excluded.credit_url
  returning id into castle_church_id;

  insert into public.media_assets (source_kind, public_url, mime_type, credit_name, credit_url)
  values ('url', 'https://commons.wikimedia.org/wiki/Special:FilePath/Berat%20Castle%2C%20Albania.JPG?width=2400', 'image/jpeg', 'Arben Llapashtica / Wikimedia Commons (Public domain)', 'https://commons.wikimedia.org/wiki/File:Berat_Castle,_Albania.JPG')
  on conflict (public_url) do update set credit_name = excluded.credit_name, credit_url = excluded.credit_url
  returning id into castle_panorama_id;

  insert into public.media_assets (source_kind, public_url, mime_type, credit_name, credit_url)
  values ('url', 'https://commons.wikimedia.org/wiki/Special:FilePath/Panorama%20Berat%2C%20Albania.JPG?width=2400', 'image/jpeg', 'Arben Llapashtica / Wikimedia Commons (Public domain)', 'https://commons.wikimedia.org/wiki/File:Panorama_Berat,_Albania.JPG')
  on conflict (public_url) do update set credit_name = excluded.credit_name, credit_url = excluded.credit_url
  returning id into berat_panorama_id;

  select place_id into berat_id from public.place_translations where locale = 'en' and slug = 'berat';
  if berat_id is null then berat_id := gen_random_uuid(); end if;
  insert into public.places (id, kind, status, featured, longitude, latitude, map_zoom, published_at)
  values (berat_id, 'destination', 'published', true, 19.9522, 40.7058, 11.5, now())
  on conflict (id) do update set status = 'published', featured = true, longitude = excluded.longitude,
    latitude = excluded.latitude, map_zoom = excluded.map_zoom, published_at = coalesce(public.places.published_at, now());

  insert into public.place_translations (place_id, locale, slug, title, seo_title, seo_description, hero_intro, hero_alt)
  values
    (berat_id, 'en', 'berat', 'Berat', 'Berat, Albania — city of a thousand windows | Wonder Albania', 'Discover Berat’s Ottoman neighbourhoods, living hilltop castle and linked small-group tours.', 'A river city of white Ottoman houses, stone lanes and a castle that is still alive.', 'The Mangalem quarter climbing the hillside above Berat'),
    (berat_id, 'fr', 'berat', 'Berat', 'Berat, Albanie — la ville aux mille fenêtres | Wonder Albania', 'Découvrez les quartiers ottomans de Berat, sa citadelle habitée et les circuits associés.', 'Une ville fluviale de maisons ottomanes blanches, de ruelles de pierre et d’une citadelle toujours habitée.', 'Le quartier de Mangalem sur les pentes de Berat')
  on conflict (place_id, locale) do update set slug = excluded.slug, title = excluded.title,
    seo_title = excluded.seo_title, seo_description = excluded.seo_description,
    hero_intro = excluded.hero_intro, hero_alt = excluded.hero_alt;

  delete from public.place_sections where place_id = berat_id;
  insert into public.place_sections (place_id, title_en, title_fr, body_en, body_fr, secondary_body_en, secondary_body_fr, media_asset_id, sort_order)
  values
    (berat_id, 'The city on two hills', 'La ville sur deux collines', 'Mangalem and Gorica face one another across the Osum River, their pale façades and rows of windows giving Berat its best-known silhouette.', 'Mangalem et Gorica se font face de part et d’autre de l’Osum. Leurs façades claires et leurs rangées de fenêtres dessinent la silhouette emblématique de Berat.', 'Cross the old stone bridge at an unhurried pace, then climb through lanes where homes, guesthouses and small workshops still shape daily life.', 'Traversez le vieux pont de pierre sans vous presser, puis montez dans des ruelles où maisons, pensions et ateliers rythment toujours la vie quotidienne.', mangalem_id, 0),
    (berat_id, 'A castle that still lives', 'Une citadelle toujours habitée', 'Berat Castle is more than a viewpoint. Families live inside its walls among churches, mosques, gardens and cobbled passages layered across centuries.', 'La citadelle de Berat est bien plus qu’un belvédère. Des familles vivent encore entre églises, mosquées, jardins et passages pavés façonnés au fil des siècles.', 'Arrive early or near sunset to hear the place settle into its local rhythm beyond the main monuments.', 'Venez tôt ou au coucher du soleil pour sentir le rythme local qui dépasse les seuls monuments.', castle_panorama_id, 1),
    (berat_id, 'Food, wine and the Osum valley', 'Cuisine, vin et vallée de l’Osum', 'The city opens onto vineyards, villages and the wider Osum valley. Local tables bring together seasonal produce, slow-cooked dishes and wines from the hills around Berat.', 'La ville s’ouvre sur les vignobles, les villages et la vallée de l’Osum. Les tables locales mêlent produits de saison, plats mijotés et vins des collines alentour.', 'Use Berat as a slow base: explore on foot, share a home-cooked meal, and connect the city with nearby countryside.', 'Faites de Berat une base paisible : explorez à pied, partagez un repas maison et reliez la ville à sa campagne.', gorica_id, 2);

  delete from public.place_media where place_id = berat_id;
  insert into public.place_media (place_id, asset_id, role, alt_en, alt_fr, sort_order)
  values
    (berat_id, mangalem_id, 'hero', 'Mangalem’s white houses above the Osum River in Berat', 'Les maisons blanches de Mangalem au-dessus de l’Osum à Berat', 0),
    (berat_id, berat_panorama_id, 'card', 'Panoramic view across Berat', 'Vue panoramique sur Berat', 0),
    (berat_id, gorica_id, 'gallery', 'Gorica neighbourhood in Berat', 'Le quartier de Gorica à Berat', 0);

  delete from public.place_facts where place_id = berat_id;
  insert into public.place_facts (place_id, group_key, icon_key, value, label_en, label_fr, sort_order)
  values
    (berat_id, 'quick', 'clock', '2–3 days', 'Recommended stay', 'Séjour conseillé', 0),
    (berat_id, 'quick', 'route', '120 km', 'From Tirana', 'Depuis Tirana', 1),
    (berat_id, 'quick', 'footprints', 'Walkable', 'Best way around', 'Meilleur moyen de visiter', 2),
    (berat_id, 'weather', 'sun', '30°C', 'Typical July high', 'Maximum typique en juillet', 0),
    (berat_id, 'weather', 'cloud-sun', '15°C', 'Typical April high', 'Maximum typique en avril', 1);

  delete from public.place_highlights where place_id = berat_id;
  insert into public.place_highlights (place_id, icon_key, label_en, label_fr, text_en, text_fr, sort_order)
  values
    (berat_id, 'landmark', 'Living heritage', 'Patrimoine vivant', 'Ottoman quarters and a still-inhabited castle.', 'Quartiers ottomans et citadelle toujours habitée.', 0),
    (berat_id, 'wine', 'Local flavour', 'Saveurs locales', 'Family kitchens, vineyards and regional dishes.', 'Cuisines familiales, vignobles et plats régionaux.', 1),
    (berat_id, 'camera', 'Golden light', 'Lumière dorée', 'Hilltop views over the Osum at sunset.', 'Vues sur l’Osum depuis les hauteurs au coucher du soleil.', 2);

  select place_id into castle_id from public.place_translations where locale = 'en' and slug = 'berat-castle';
  if castle_id is null then castle_id := gen_random_uuid(); end if;
  insert into public.places (id, kind, parent_destination_id, status, featured, longitude, latitude, map_zoom, published_at)
  values (castle_id, 'attraction', berat_id, 'published', true, 19.9458, 40.7109, 15, now())
  on conflict (id) do update set parent_destination_id = berat_id, status = 'published', featured = true,
    longitude = excluded.longitude, latitude = excluded.latitude, map_zoom = excluded.map_zoom,
    published_at = coalesce(public.places.published_at, now());

  insert into public.place_translations (place_id, locale, slug, title, seo_title, seo_description, hero_intro, hero_alt)
  values
    (castle_id, 'en', 'berat-castle', 'Berat Castle', 'Berat Castle — a living citadel | Wonder Albania', 'Plan a visit to Berat Castle and find tours that include the hilltop citadel.', 'Climb into a hilltop neighbourhood where Byzantine churches, Ottoman traces and everyday life share the same walls.', 'Stone walls and rooftops inside Berat Castle'),
    (castle_id, 'fr', 'chateau-de-berat', 'Citadelle de Berat', 'Citadelle de Berat — une forteresse habitée | Wonder Albania', 'Préparez votre visite de la citadelle de Berat et trouvez les circuits qui l’incluent.', 'Montez vers un quartier perché où églises byzantines, traces ottomanes et vie quotidienne partagent les mêmes remparts.', 'Remparts et toits à l’intérieur de la citadelle de Berat')
  on conflict (place_id, locale) do update set slug = excluded.slug, title = excluded.title,
    seo_title = excluded.seo_title, seo_description = excluded.seo_description,
    hero_intro = excluded.hero_intro, hero_alt = excluded.hero_alt;

  delete from public.place_sections where place_id = castle_id;
  insert into public.place_sections (place_id, title_en, title_fr, body_en, body_fr, secondary_body_en, secondary_body_fr, media_asset_id, sort_order)
  values
    (castle_id, 'Within the walls', 'À l’intérieur des remparts', 'The broad enclosure contains lanes, homes and quiet corners rather than a single monument. The climb reveals how the fortress grew into a neighbourhood.', 'La vaste enceinte abrite des ruelles, des maisons et des coins tranquilles plutôt qu’un monument unique. La montée révèle comment la forteresse est devenue un quartier.', 'Wear shoes with grip: polished stone and steep passages are part of the experience.', 'Prévoyez des chaussures adhérentes : pierres polies et passages raides font partie de l’expérience.', castle_panorama_id, 0),
    (castle_id, 'Churches and icons', 'Églises et icônes', 'Small Byzantine churches sit throughout the citadel. The Onufri Museum, housed in the Cathedral of the Dormition, introduces Albania’s celebrated icon-painting tradition.', 'De petites églises byzantines ponctuent la citadelle. Installé dans la cathédrale de la Dormition, le musée Onufri présente la grande tradition albanaise des icônes.', 'Allow time between landmarks; the details in doorways, masonry and gardens are as rewarding as the headline sights.', 'Prenez du temps entre les monuments : portes, maçonneries et jardins sont aussi précieux que les sites majeurs.', castle_church_id, 1),
    (castle_id, 'Above the Osum', 'Au-dessus de l’Osum', 'From the outer walls, the Osum River threads between Mangalem and Gorica while Mount Tomorr rises beyond the city.', 'Depuis les remparts, l’Osum serpente entre Mangalem et Gorica, tandis que le mont Tomorr se dresse au-delà de la ville.', 'Late afternoon brings softer light and a cooler descent back toward the old quarters.', 'La fin d’après-midi offre une lumière plus douce et une descente plus fraîche vers les vieux quartiers.', berat_panorama_id, 2);

  delete from public.place_media where place_id = castle_id;
  insert into public.place_media (place_id, asset_id, role, alt_en, alt_fr, sort_order)
  values
    (castle_id, castle_panorama_id, 'hero', 'The stone walls and hillside setting of Berat Castle', 'Les remparts de pierre et la colline de la citadelle de Berat', 0),
    (castle_id, castle_church_id, 'card', 'Historic church inside Berat Castle', 'Église historique dans la citadelle de Berat', 0),
    (castle_id, berat_panorama_id, 'gallery', 'Berat seen from the castle hill', 'Berat vue depuis la colline de la citadelle', 0);

  delete from public.place_facts where place_id = castle_id;
  insert into public.place_facts (place_id, group_key, icon_key, value, label_en, label_fr, sort_order)
  values
    (castle_id, 'quick', 'clock', '2–3 hours', 'Suggested visit', 'Durée conseillée', 0),
    (castle_id, 'quick', 'mountain', 'Steep', 'Approach', 'Accès', 1),
    (castle_id, 'quick', 'sunset', 'Late afternoon', 'Best light', 'Meilleure lumière', 2),
    (castle_id, 'weather', 'sun', 'Exposed', 'Summer conditions', 'Conditions estivales', 0);

  delete from public.place_highlights where place_id = castle_id;
  insert into public.place_highlights (place_id, icon_key, label_en, label_fr, text_en, text_fr, sort_order)
  values
    (castle_id, 'home', 'Still inhabited', 'Toujours habitée', 'Homes and daily life continue inside the fortress.', 'Maisons et vie quotidienne continuent dans la forteresse.', 0),
    (castle_id, 'church', 'Sacred art', 'Art sacré', 'Byzantine churches and the Onufri Museum.', 'Églises byzantines et musée Onufri.', 1),
    (castle_id, 'binoculars', 'City views', 'Vues sur la ville', 'Wide views over Mangalem, Gorica and the Osum.', 'Vastes vues sur Mangalem, Gorica et l’Osum.', 2);

  -- Example automatic suggestions become explicit links only in this sample seed.
  -- The admin UI still presents coordinate/name matches for confirmation on new content.
  insert into public.place_tours (place_id, tour_id, relationship, source, visible, sort_order)
  select castle_id, candidate.tour_id, 'visit', 'itinerary', true,
    row_number() over (order by candidate.duration_rank, candidate.title)::int - 1
  from (
    select distinct tis.tour_id, coalesce(tt.title, tis.place_en) as title,
      case when t.duration_unit = 'hours' or (t.duration_unit = 'days' and t.duration_value <= 1)
        then 0 else 1 end as duration_rank
    from public.tour_itinerary_stops tis
    join public.tours t on t.id = tis.tour_id
    left join public.tour_translations tt on tt.tour_id = tis.tour_id and tt.locale = 'en'
    where lower(coalesce(tis.location_label, '') || ' ' || coalesce(tis.place_en, '')) like '%berat%'
       or (tis.longitude between 19.92 and 19.98 and tis.latitude between 40.68 and 40.73)
  ) candidate
  on conflict (place_id, tour_id) do update set source = 'itinerary', visible = true,
    sort_order = excluded.sort_order;

  insert into public.place_tours (place_id, tour_id, relationship, source, visible, sort_order)
  select berat_id, candidate.tour_id, 'area', 'itinerary', true,
    row_number() over (order by candidate.duration_rank, candidate.title)::int - 1
  from (
    select distinct tis.tour_id, coalesce(tt.title, tis.place_en) as title,
      case when t.duration_unit = 'hours' or (t.duration_unit = 'days' and t.duration_value <= 1)
        then 0 else 1 end as duration_rank
    from public.tour_itinerary_stops tis
    join public.tours t on t.id = tis.tour_id
    left join public.tour_translations tt on tt.tour_id = tis.tour_id and tt.locale = 'en'
    where lower(coalesce(tis.location_label, '') || ' ' || coalesce(tis.place_en, '')) like '%berat%'
       or (tis.longitude between 19.88 and 20.04 and tis.latitude between 40.62 and 40.78)
  ) candidate
  on conflict (place_id, tour_id) do update set visible = true, sort_order = excluded.sort_order;
end
$$;

commit;
