-- WonderAlbania taxonomy seed
-- Safe to run more than once. Existing rows are updated by their stable key.
-- Run this after supabase/wonderalbania.sql.

begin;

insert into public.categories (key, name_en, name_fr, active)
values
  ('adventure', 'Adventure', 'Aventure', true),
  ('nature', 'Nature', 'Nature', true),
  ('cultural-heritage', 'Cultural Heritage', 'Patrimoine culturel', true),
  ('history', 'History', 'Histoire', true),
  ('archaeology', 'Archaeology', 'Archéologie', true),
  ('beaches', 'Beaches', 'Plages', true),
  ('mountains', 'Mountains', 'Montagnes', true),
  ('food-wine', 'Food & Wine', 'Gastronomie et vin', true),
  ('luxury', 'Luxury', 'Luxe', true),
  ('family', 'Family', 'Famille', true),
  ('photography', 'Photography', 'Photographie', true),
  ('wildlife', 'Wildlife', 'Faune sauvage', true),
  ('wellness', 'Wellness', 'Bien-être', true),
  ('road-trips', 'Road Trips', 'Circuits en voiture', true),
  ('city-breaks', 'City Breaks', 'Escapades urbaines', true),
  ('unesco-sites', 'UNESCO Sites', 'Sites UNESCO', true),
  ('hidden-gems', 'Hidden Gems', 'Trésors cachés', true),
  ('festivals', 'Festivals', 'Festivals', true),
  ('winter', 'Winter', 'Hiver', true),
  ('sailing-coast', 'Sailing & Coast', 'Voile et littoral', true),
  ('hiking', 'Hiking', 'Randonnée', true),
  ('cycling', 'Cycling', 'Cyclisme', true),
  ('jeep-safari', 'Jeep Safari', 'Safari en jeep', true),
  ('kayaking', 'Kayaking', 'Kayak', true),
  ('rafting', 'Rafting', 'Rafting', true),
  ('camping', 'Camping', 'Camping', true)
on conflict (key) do update set
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  active = excluded.active;

insert into public.tour_types (key, name_en, name_fr, active)
values
  ('day-tour', 'Day Tour', 'Excursion à la journée', true),
  ('half-day-tour', 'Half-Day Tour', 'Excursion d''une demi-journée', true),
  ('multi-day-tour', 'Multi-Day Tour', 'Circuit de plusieurs jours', true),
  ('weekend-escape', 'Weekend Escape', 'Escapade de week-end', true),
  ('private-tour', 'Private Tour', 'Circuit privé', true),
  ('group-tour', 'Group Tour', 'Circuit en groupe', true),
  ('self-guided', 'Self-Guided', 'Circuit en autonomie', true),
  ('luxury-package', 'Luxury Package', 'Séjour de luxe', true),
  ('honeymoon', 'Honeymoon', 'Voyage de noces', true),
  ('business-travel', 'Business Travel', 'Voyage d''affaires', true)
on conflict (key) do update set
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  active = excluded.active;

insert into public.difficulties (key, name_en, name_fr, active)
values
  ('easy', 'Easy', 'Facile', true),
  ('moderate', 'Moderate', 'Modérée', true),
  ('challenging', 'Challenging', 'Difficile', true),
  ('expert', 'Expert', 'Expert', true)
on conflict (key) do update set
  name_en = excluded.name_en,
  name_fr = excluded.name_fr,
  active = excluded.active;

commit;
