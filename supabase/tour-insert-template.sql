-- WonderAlbania complete tour creation template
--
-- Before running:
-- 1. Run wonderalbania.sql and seed-tour-taxonomies.sql.
-- 2. Replace every example value below, especially both slugs and all image URLs.
-- 3. Upload the referenced images to the `tour-media` Supabase Storage bucket first.
-- 4. Keep slugs lowercase, using only letters, numbers and hyphens.
--
-- The whole DO block is atomic: if one statement fails, no partial tour is created.

do $tour$
declare
  -- Core settings
  v_publish boolean := true;
  v_featured boolean := false;
  v_tour_type_key text := 'day-tour';
  v_difficulty_key text := 'easy';
  v_category_keys text[] := array['adventure', 'nature', 'hidden-gems'];
  v_slug_en text := 'replace-with-english-slug';
  v_slug_fr text := 'remplacer-par-slug-francais';
  v_supabase_url text := 'https://YOUR_PROJECT.supabase.co';
  v_media_folder text := 'tours/replace-with-unique-folder';

  -- Generated and resolved values; do not edit these.
  v_tour_id uuid := gen_random_uuid();
  v_tour_type_id uuid;
  v_difficulty_id uuid;
  v_review_id uuid;
  v_found_categories integer;
begin
  if v_slug_en like 'replace-%' or v_slug_fr like 'remplacer-%' then
    raise exception 'Replace both example slugs before running this template.';
  end if;

  if v_supabase_url like '%YOUR_PROJECT%' or v_media_folder like '%replace-%' then
    raise exception 'Replace v_supabase_url and v_media_folder before running this template.';
  end if;

  select id
  into v_tour_type_id
  from public.tour_types
  where key = v_tour_type_key and active = true;

  if v_tour_type_id is null then
    raise exception 'Unknown or inactive tour type key: %', v_tour_type_key;
  end if;

  select id
  into v_difficulty_id
  from public.difficulties
  where key = v_difficulty_key and active = true;

  if v_difficulty_id is null then
    raise exception 'Unknown or inactive difficulty key: %', v_difficulty_key;
  end if;

  select count(*)
  into v_found_categories
  from public.categories
  where key = any(v_category_keys) and active = true;

  if v_found_categories <> cardinality(v_category_keys) then
    raise exception 'One or more category keys do not exist or are inactive: %', v_category_keys;
  end if;

  -- Create as a draft and publish only after every related record is inserted.
  insert into public.tours (
    id,
    status,
    featured,
    base_price_eur,
    discount_percent,
    default_available,
    duration_minutes,
    max_group_size,
    language_codes,
    start_place,
    end_place,
    accessibility_en,
    accessibility_fr,
    region_en,
    region_fr,
    route_distance_km,
    tour_type_id,
    difficulty_id
  )
  values (
    v_tour_id,
    'draft',
    v_featured,
    129.00,                         -- Main price per person
    null,                           -- Discount percent, for example 15, or null
    true,                           -- All future dates available unless overridden below
    480,                            -- Total duration in minutes
    8,                              -- Maximum group size
    array['EN', 'FR', 'SQ']::text[],
    'Tirana',
    'Tirana',
    'Ask our team about accessibility requirements.',
    'Contactez notre équipe pour vos besoins d''accessibilité.',
    'Central Albania',
    'Albanie centrale',
    145.00,                         -- Approximate route distance in kilometres
    v_tour_type_id,
    v_difficulty_id
  );

  -- Both language records are required before publishing.
  insert into public.tour_translations (
    tour_id,
    locale,
    slug,
    title,
    seo_title,
    seo_description,
    hero_badge,
    location_label,
    hero_intro,
    overview_title,
    overview_summary,
    overview_body,
    best_season_title,
    best_season_body,
    route_title,
    route_description,
    cancellation_summary,
    hero_alt
  )
  values
    (
      v_tour_id,
      'en',
      v_slug_en,
      'Replace with the English tour title',
      'English SEO title | WonderAlbania',
      'Write an English meta description of approximately 140 to 160 characters describing the destination, experience and main benefit.',
      'Local favourite',
      'Tirana and Central Albania',
      'Write a short English introduction that explains what makes this tour special.',
      'A memorable way to discover Albania',
      'Add a concise English overview summary.',
      'Add the complete English overview. Explain the pace, atmosphere, important stops and what guests will experience during the tour.',
      'Best season',
      'May through October offers warm weather and long days. Spring and autumn are quieter.',
      'The route',
      'Describe the route and explain that the map is an overview rather than turn-by-turn navigation.',
      'Free cancellation according to the published cancellation terms.',
      'Describe the hero image clearly in English'
    ),
    (
      v_tour_id,
      'fr',
      v_slug_fr,
      'Remplacer par le titre français du circuit',
      'Titre SEO français | WonderAlbania',
      'Rédigez une méta-description française de 140 à 160 caractères présentant la destination, l''expérience et son principal intérêt.',
      'Coup de cœur local',
      'Tirana et Albanie centrale',
      'Rédigez une courte introduction en français présentant ce qui rend ce circuit unique.',
      'Une manière inoubliable de découvrir l''Albanie',
      'Ajoutez un résumé concis en français.',
      'Ajoutez la présentation complète en français : rythme, ambiance, étapes principales et expériences proposées pendant le circuit.',
      'Meilleure saison',
      'De mai à octobre, le temps est chaud et les journées sont longues. Le printemps et l''automne sont plus calmes.',
      'Le parcours',
      'Décrivez le parcours et précisez que la carte donne un aperçu général, sans guidage étape par étape.',
      'Annulation gratuite selon les conditions d''annulation publiées.',
      'Décrivez clairement l''image principale en français'
    );

  -- Assign categories using the keys declared at the top.
  insert into public.tour_categories (tour_id, category_id)
  select v_tour_id, id
  from public.categories
  where key = any(v_category_keys);

  -- Highlights. Duplicate a row and increase sort_order to add more.
  insert into public.tour_highlights (
    tour_id, icon_key, label_en, label_fr, text_en, text_fr, sort_order
  )
  values
    (
      v_tour_id, 'mountain', 'Scenic landscapes', 'Paysages spectaculaires',
      'Discover panoramic views shaped by local knowledge.',
      'Découvrez des panoramas sélectionnés grâce à l''expertise locale.', 0
    ),
    (
      v_tour_id, 'camera', 'Hidden places', 'Lieux secrets',
      'Visit meaningful places away from the busiest routes.',
      'Visitez des lieux authentiques à l''écart des itinéraires les plus fréquentés.', 1
    ),
    (
      v_tour_id, 'food', 'Local flavours', 'Saveurs locales',
      'Taste seasonal Albanian food at a trusted local address.',
      'Dégustez une cuisine albanaise de saison dans une adresse locale de confiance.', 2
    );

  -- Media metadata. Upload these exact storage paths before running this script.
  -- Only one hero image is allowed; add as many gallery rows as needed.
  insert into public.tour_media (
    tour_id, role, storage_path, public_url, alt_en, alt_fr, sort_order
  )
  values
    (
      v_tour_id,
      'hero',
      v_media_folder || '/hero.webp',
      v_supabase_url || '/storage/v1/object/public/tour-media/' || v_media_folder || '/hero.webp',
      'English description of the main tour image',
      'Description française de l''image principale',
      0
    ),
    (
      v_tour_id,
      'gallery',
      v_media_folder || '/gallery-1.webp',
      v_supabase_url || '/storage/v1/object/public/tour-media/' || v_media_folder || '/gallery-1.webp',
      'English description of gallery image one',
      'Description française de la première image de la galerie',
      0
    ),
    (
      v_tour_id,
      'gallery',
      v_media_folder || '/gallery-2.webp',
      v_supabase_url || '/storage/v1/object/public/tour-media/' || v_media_folder || '/gallery-2.webp',
      'English description of gallery image two',
      'Description française de la deuxième image de la galerie',
      1
    );

  -- Included, excluded and packing-list items.
  insert into public.tour_list_items (
    tour_id, kind, text_en, text_fr, sort_order
  )
  values
    (v_tour_id, 'included', 'Private air-conditioned transport', 'Transport privé climatisé', 0),
    (v_tour_id, 'included', 'Licensed local guide', 'Guide local agréé', 1),
    (v_tour_id, 'included', 'Bottled water', 'Eau en bouteille', 2),
    (v_tour_id, 'excluded', 'Personal purchases', 'Achats personnels', 0),
    (v_tour_id, 'excluded', 'Guide gratuities', 'Pourboires du guide', 1),
    (v_tour_id, 'bring', 'Comfortable walking shoes', 'Chaussures de marche confortables', 0),
    (v_tour_id, 'bring', 'Sunscreen and a hat', 'Crème solaire et chapeau', 1);

  -- Weather and best-season statistics.
  insert into public.tour_weather_stats (
    tour_id, icon_key, value, label_en, label_fr, sort_order
  )
  values
    (v_tour_id, 'temperature', '24–29°C', 'Typical summer high', 'Maximum estival habituel', 0),
    (v_tour_id, 'sun', 'May–Oct', 'Recommended season', 'Période recommandée', 1);

  -- Frequently asked questions.
  insert into public.tour_faqs (
    tour_id, question_en, question_fr, answer_en, answer_fr, sort_order
  )
  values
    (
      v_tour_id,
      'Can children join this tour?',
      'Les enfants peuvent-ils participer à ce circuit ?',
      'Yes. Tell us the children''s ages in advance so we can prepare the correct seating.',
      'Oui. Indiquez-nous leur âge à l''avance afin que nous préparions les sièges adaptés.',
      0
    ),
    (
      v_tour_id,
      'What happens in bad weather?',
      'Que se passe-t-il en cas de mauvais temps ?',
      'The route may be adjusted for safety while preserving the main experience.',
      'Le parcours peut être adapté pour des raisons de sécurité tout en préservant l''expérience principale.',
      1
    );

  -- Itinerary coordinates are longitude first, then latitude.
  -- Use OpenStreetMap/Nominatim-compatible place names in location_query.
  insert into public.tour_itinerary_stops (
    tour_id,
    start_time,
    duration_minutes,
    type_en,
    type_fr,
    place_en,
    place_fr,
    description_en,
    description_fr,
    location_query,
    location_label,
    longitude,
    latitude,
    osm_reference,
    sort_order
  )
  values
    (
      v_tour_id, time '08:00', 30, 'Pickup', 'Prise en charge', 'Tirana', 'Tirana',
      'Meet your guide at the agreed pickup point.',
      'Retrouvez votre guide au point de prise en charge convenu.',
      'Skanderbeg Square, Tirana, Albania', 'Skanderbeg Square, Tirana',
      19.8187, 41.3275, '', 0
    ),
    (
      v_tour_id, time '10:00', 90, 'Visit', 'Visite', 'First destination', 'Première destination',
      'Describe the first main stop in English.',
      'Décrivez la première étape principale en français.',
      'REPLACE WITH AN OPENSTREETMAP PLACE QUERY', 'Replace with the confirmed map label',
      20.0000, 41.0000, '', 1
    ),
    (
      v_tour_id, time '13:00', 75, 'Lunch', 'Déjeuner', 'Local restaurant', 'Restaurant local',
      'Enjoy a relaxed lunch featuring regional dishes.',
      'Profitez d''un déjeuner tranquille composé de spécialités régionales.',
      'REPLACE WITH AN OPENSTREETMAP PLACE QUERY', 'Replace with the confirmed map label',
      20.1000, 40.9000, '', 2
    );

  -- Specific-date exceptions.
  -- A null price uses the main price. Set is_available=false to close a date.
  insert into public.tour_date_overrides (tour_id, date, is_available, price_eur)
  values
    (v_tour_id, date '2030-06-15', true, 149.00),  -- Available at a special price
    (v_tour_id, date '2030-06-16', false, null),   -- Unavailable
    (v_tour_id, date '2030-06-17', true, null);    -- Available at the main price

  -- Optional reusable review. Delete this section when no review should be created.
  insert into public.reviews (
    name,
    review_date,
    nation_code,
    rating,
    travel_type,
    original_language,
    body_original,
    body_en,
    body_fr
  )
  values (
    'Replace with traveller name',
    date '2030-05-20',
    'GB',
    5,
    'couple',
    'en',
    'Replace with the original review text.',
    'Replace with the English review text.',
    'Remplacez par la traduction française de l''avis.'
  )
  returning id into v_review_id;

  insert into public.tour_reviews (tour_id, review_id, sort_order)
  values (v_tour_id, v_review_id, 0);

  if v_publish then
    -- Only one published tour may be featured.
    if v_featured then
      update public.tours
      set featured = false
      where featured = true and status = 'published';
    end if;

    update public.tours
    set
      status = 'published',
      published_at = now()
    where id = v_tour_id;
  end if;

  raise notice 'Created tour id: %', v_tour_id;
  raise notice 'English path: /%', v_slug_en;
  raise notice 'French path: /fr/%', v_slug_fr;
end;
$tour$;
