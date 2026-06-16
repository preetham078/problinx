create extension if not exists pgcrypto;

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  content text not null default '',
  media_url text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint stories_content_or_media_check
    check (length(trim(content)) > 0 or media_url is not null),
  constraint stories_expiry_window_check
    check (expires_at > created_at and expires_at <= created_at + interval '7 days')
);

create index if not exists stories_active_idx
  on public.stories (expires_at desc, created_at desc);

create index if not exists stories_user_idx
  on public.stories (user_id, created_at desc);

alter table public.stories enable row level security;

drop policy if exists "Authenticated users can read active stories" on public.stories;
create policy "Authenticated users can read active stories"
on public.stories
for select
to authenticated
using (expires_at > now());

drop policy if exists "Authenticated users can upload stories" on public.stories;
create policy "Authenticated users can upload stories"
on public.stories
for insert
to authenticated
with check (auth.uid() = user_id);
