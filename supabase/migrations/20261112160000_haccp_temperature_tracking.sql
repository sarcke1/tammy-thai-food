-- HACCP V1 : suivi numérique des températures
create table if not exists public.haccp_equipment (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  equipment_type text not null check (equipment_type in ('refrigerator','freezer','other')),
  min_temperature_c numeric(4,1) not null,
  max_temperature_c numeric(4,1) not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (min_temperature_c < max_temperature_c)
);

create table if not exists public.haccp_temperature_logs (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.haccp_equipment(id) on delete restrict,
  measured_temperature_c numeric(4,1) not null,
  measured_at timestamptz not null default now(),
  recorded_by uuid default auth.uid(),
  is_conforming boolean not null default true,
  corrective_action text,
  notes text,
  created_at timestamptz not null default now()
);

create or replace function public.set_haccp_temperature_conformity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_min numeric(4,1); v_max numeric(4,1);
begin
  select min_temperature_c,max_temperature_c into v_min,v_max
  from public.haccp_equipment where id=new.equipment_id and active=true;
  if not found then raise exception 'Équipement HACCP introuvable ou inactif'; end if;
  new.is_conforming := new.measured_temperature_c between v_min and v_max;
  if new.is_conforming=false and coalesce(btrim(new.corrective_action),'')='' then
    raise exception 'Une action corrective est obligatoire pour une température non conforme';
  end if;
  return new;
end;
$$;

drop trigger if exists haccp_temperature_conformity on public.haccp_temperature_logs;
create trigger haccp_temperature_conformity
before insert on public.haccp_temperature_logs
for each row execute function public.set_haccp_temperature_conformity();

alter table public.haccp_equipment enable row level security;
alter table public.haccp_temperature_logs enable row level security;

drop policy if exists "Admins can manage HACCP equipment" on public.haccp_equipment;
create policy "Admins can manage HACCP equipment" on public.haccp_equipment
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can read HACCP temperature logs" on public.haccp_temperature_logs;
create policy "Admins can read HACCP temperature logs" on public.haccp_temperature_logs
for select to authenticated using (public.is_admin());

drop policy if exists "Admins can insert HACCP temperature logs" on public.haccp_temperature_logs;
create policy "Admins can insert HACCP temperature logs" on public.haccp_temperature_logs
for insert to authenticated with check (public.is_admin());

insert into public.haccp_equipment(name,equipment_type,min_temperature_c,max_temperature_c)
values ('Réfrigérateur','refrigerator',0.0,4.0),('Congélateur','freezer',-25.0,-18.0)
on conflict (name) do nothing;
