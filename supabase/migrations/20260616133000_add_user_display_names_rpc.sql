create or replace function public.get_user_display_names(p_user_ids uuid[])
returns table (
  user_id uuid,
  display_name text
)
language sql
security definer
set search_path = public, auth
as $$
  select
    requested.user_id,
    nullif(
      trim(
        coalesce(
          p.name,
          au.raw_user_meta_data->>'name',
          au.raw_user_meta_data->>'full_name',
          split_part(coalesce(p.email, au.email, ''), '@', 1)
        )
      ),
      ''
    ) as display_name
  from unnest(p_user_ids) as requested(user_id)
  left join public.profiles p on p.user_id = requested.user_id
  left join auth.users au on au.id = requested.user_id;
$$;

revoke all on function public.get_user_display_names(uuid[]) from public;
grant execute on function public.get_user_display_names(uuid[]) to authenticated;
