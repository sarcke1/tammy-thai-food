-- HACCP V2.00 : registres complets, consultation et traçabilité des lots

create table if not exists public.haccp_transport_logs (
  id uuid primary key default gen_random_uuid(),
  reference text,
  transport_type text not null default 'Sac isotherme',
  departure_at timestamptz not null default now(),
  arrival_at timestamptz,
  departure_temperature_c numeric(4,1),
  arrival_temperature_c numeric(4,1),
  is_conforming boolean not null default true,
  corrective_action text,
  notes text,
  recorded_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  check (arrival_at is null or arrival_at >= departure_at)
);

create table if not exists public.haccp_cleaning_logs (
  id uuid primary key default gen_random_uuid(),
  cleaning_date date not null default current_date,
  zone text not null,
  frequency text not null default 'Quotidien',
  method_or_product text,
  performed_by text,
  validated boolean not null default true,
  notes text,
  recorded_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.haccp_receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique,
  supplier text not null,
  received_at timestamptz not null default now(),
  packaging_conforming boolean not null default true,
  temperature_c numeric(4,1),
  is_conforming boolean not null default true,
  corrective_action text,
  notes text,
  recorded_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.haccp_receipt_items (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references public.haccp_receipts(id) on delete cascade,
  product_name text not null,
  lot_number text,
  expiry_date date,
  temperature_c numeric(4,1),
  quantity_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.haccp_lot_usage (
  id uuid primary key default gen_random_uuid(),
  receipt_item_id uuid not null references public.haccp_receipt_items(id) on delete cascade,
  used_from date not null default current_date,
  used_until date,
  usage_note text,
  recorded_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  check (used_until is null or used_until >= used_from)
);

create table if not exists public.haccp_oil_logs (
  id uuid primary key default gen_random_uuid(),
  oil_action text not null check (oil_action in ('mise_en_service','controle','changement')),
  action_at timestamptz not null default now(),
  result text,
  is_conforming boolean not null default true,
  corrective_action text,
  notes text,
  recorded_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.haccp_nonconformities (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  occurred_at timestamptz not null default now(),
  description text not null,
  corrective_action text not null,
  result text,
  status text not null default 'open' check (status in ('open','resolved','monitoring')),
  resolved_at timestamptz,
  recorded_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.haccp_transport_logs enable row level security;
alter table public.haccp_cleaning_logs enable row level security;
alter table public.haccp_receipts enable row level security;
alter table public.haccp_receipt_items enable row level security;
alter table public.haccp_lot_usage enable row level security;
alter table public.haccp_oil_logs enable row level security;
alter table public.haccp_nonconformities enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'haccp_transport_logs','haccp_cleaning_logs','haccp_receipts',
    'haccp_receipt_items','haccp_lot_usage','haccp_oil_logs','haccp_nonconformities'
  ] loop
    execute format('drop policy if exists "Admins manage %s" on public.%I', t, t);
    execute format('create policy "Admins manage %s" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

insert into storage.buckets (id,name,public)
values ('haccp-receipts','haccp-receipts',false)
on conflict (id) do nothing;

drop policy if exists "Admins manage HACCP receipt photos" on storage.objects;
create policy "Admins manage HACCP receipt photos"
on storage.objects for all to authenticated
using (bucket_id='haccp-receipts' and public.is_admin())
with check (bucket_id='haccp-receipts' and public.is_admin());

create or replace function public.haccp_next_receipt_number(p_date date default current_date)
returns text
language sql
security invoker
set search_path = public
as $$
  select 'REC-' || to_char(p_date,'YYYYMMDD') || '-' ||
         lpad((count(*) filter (where received_at::date=p_date)+1)::text,3,'0')
  from public.haccp_receipts;
$$;

grant execute on function public.haccp_next_receipt_number(date) to authenticated;