-- The advisor flagged protect_default_habit() for a mutable search_path
-- (unlike handle_new_user(), which already pins it). It isn't SECURITY
-- DEFINER so the practical risk is low, but pin it anyway for consistency.
create or replace function public.protect_default_habit()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.is_default and (new.archived_at is not null or new.is_default = false) then
    raise exception 'The default habit cannot be archived or unset.';
  end if;
  return new;
end;
$$;
