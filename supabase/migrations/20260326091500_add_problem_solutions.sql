create extension if not exists pgcrypto;

create table if not exists public.solutions (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems(id) on delete cascade,
  solver_id uuid not null,
  solution_text text not null,
  status text not null default 'pending' check (status in ('pending', 'approved')),
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists solutions_problem_solver_idx
  on public.solutions (problem_id, solver_id);

create unique index if not exists solutions_one_approved_per_problem_idx
  on public.solutions (problem_id)
  where status = 'approved';

create or replace function public.approve_solution(p_solution_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_problem_id uuid;
  v_problem_owner uuid;
  v_solver_id uuid;
  v_status text;
begin
  select s.problem_id, p.user_id, s.solver_id, s.status
  into v_problem_id, v_problem_owner, v_solver_id, v_status
  from public.solutions s
  join public.problems p on p.id = s.problem_id
  where s.id = p_solution_id;

  if v_problem_id is null then
    raise exception 'Solution not found';
  end if;

  if auth.uid() is distinct from v_problem_owner then
    raise exception 'Only the problem owner can approve credits';
  end if;

  if v_status = 'approved' then
    raise exception 'This solution has already been approved';
  end if;

  if exists (
    select 1
    from public.solutions
    where problem_id = v_problem_id
      and status = 'approved'
      and id <> p_solution_id
  ) then
    raise exception 'A solution has already been approved for this problem';
  end if;

  update public.solutions
  set status = 'approved',
      approved_by = auth.uid(),
      approved_at = now()
  where id = p_solution_id;

  update public.profiles
  set credits = coalesce(credits, 0) + 10,
      updated_at = now()
  where user_id = v_solver_id;
end;
$$;
