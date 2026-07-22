-- Keeps the approved three-card destination design fully editable.
-- Safe for projects that already ran 202607220001_places_and_global_media.sql.

begin;

alter table public.place_translations
  add column if not exists story_title text not null default '',
  add column if not exists story_intro text not null default '';

alter table public.place_sections
  add column if not exists image_alt_en text not null default '',
  add column if not exists image_alt_fr text not null default '';

update public.place_translations translation
set
  story_title = case
    when translation.story_title <> '' then translation.story_title
    when translation.locale = 'fr' then 'Trois façons de comprendre ' || translation.title
    else 'Three ways to understand ' || translation.title
  end,
  story_intro = case
    when translation.story_intro <> '' then translation.story_intro
    when translation.locale = 'fr' then
      'Parcourez son histoire, les expériences qui le définissent et les détails utiles pour préparer votre visite.'
    else
      'Scroll through its story, the experiences that define it and the practical details for planning your visit.'
  end
where translation.story_title = '' or translation.story_intro = '';

update public.place_sections
set
  image_alt_en = case when image_alt_en = '' then title_en else image_alt_en end,
  image_alt_fr = case when image_alt_fr = '' then title_fr else image_alt_fr end
where image_alt_en = '' or image_alt_fr = '';

commit;
