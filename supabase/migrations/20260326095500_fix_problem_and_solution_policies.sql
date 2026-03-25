create extension if not exists pgcrypto;

alter table public.problems
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

alter table public.profiles
  alter column credits set default 0,
  alter column updated_at set default now(),
  alter column created_at set default now();

alter table public.problems enable row level security;
alter table public.profiles enable row level security;
alter table public.solutions enable row level security;

drop policy if exists "Anyone can read problems" on public.problems;
create policy "Anyone can read problems"
on public.problems
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can post problems" on public.problems;
create policy "Authenticated users can post problems"
on public.problems
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Problem owners can update their problems" on public.problems;
create policy "Problem owners can update their problems"
on public.problems
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read profiles" on public.profiles;
create policy "Users can read profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can read solutions" on public.solutions;
create policy "Authenticated users can read solutions"
on public.solutions
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can submit solutions" on public.solutions;
create policy "Authenticated users can submit solutions"
on public.solutions
for insert
to authenticated
with check (auth.uid() = solver_id);
