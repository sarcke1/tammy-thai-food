create table if not exists public.haccp_receipt_photos (
 id uuid primary key default gen_random_uuid(),
 receipt_id uuid not null references public.haccp_receipts(id) on delete cascade,
 storage_path text not null,
 original_name text,
 created_at timestamptz not null default now()
);
alter table public.haccp_receipt_photos enable row level security;
drop policy if exists "Admins manage haccp_receipt_photos" on public.haccp_receipt_photos;
create policy "Admins manage haccp_receipt_photos" on public.haccp_receipt_photos for all to authenticated using (public.is_admin()) with check (public.is_admin());
