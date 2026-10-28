# Customer notification Realtime setup

The backend relays Supabase Realtime notification inserts to the matching
authenticated customer over `/api/notifications/stream`. Keep the Supabase
service key on the backend only.

Enable `public.notifications` in the `supabase_realtime` publication once in the
Supabase SQL Editor:

```sql
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end
$$;
```

After running the SQL, restart the backend. Its terminal should print
`Supabase Realtime: notifications connected` when the subscription is ready.
