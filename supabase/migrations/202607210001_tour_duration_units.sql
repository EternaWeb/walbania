begin;

alter table public.tours
  add column if not exists duration_value numeric(6,1),
  add column if not exists duration_unit text;

update public.tours
set
  duration_value = case
    when duration_minutes >= 1440 then round(duration_minutes / 1440.0, 1)
    else round(duration_minutes / 60.0, 1)
  end,
  duration_unit = case
    when duration_minutes >= 1440 then 'days'
    else 'hours'
  end
where duration_value is null or duration_unit is null;

alter table public.tours
  alter column duration_value set default 8,
  alter column duration_value set not null,
  alter column duration_unit set default 'hours',
  alter column duration_unit set not null;

alter table public.tours
  add constraint tours_duration_value_positive check (duration_value > 0),
  add constraint tours_duration_unit_valid check (duration_unit in ('hours', 'days'));

alter table public.tours drop column duration_minutes;

commit;
