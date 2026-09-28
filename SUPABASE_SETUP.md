# Supabase setup

1. In **Project Settings → API → Exposed schemas**, add `studio-music`.
2. Apply both files in `supabase/migrations/` in order in the SQL Editor. The second migration creates user profiles, reservations and pack orders and enables realtime updates for new requests.
3. In **Authentication → Users**, create the administrator with email and password.
4. Copy that user's UUID.
5. In the SQL Editor, add the user to `admin_users` and set the matching profile's role to `admin` (replace `USER_UUID` with the UUID from Auth → Users):
   ```sql
   insert into "studio-music".admin_users (user_id)
   values ('USER_UUID')
   on conflict (user_id) do nothing;

   update "studio-music".profiles
   set role = 'admin'
   where user_id = 'USER_UUID';
   ```
6. Start the app with `npm run dev`.
7. Open `/admin/login` and sign in with that administrator account.
8. To create Auth users from **Admin → Utilisateurs**, set the Supabase `service_role` key as `SUPABASE_SERVICE_ROLE_KEY` in the server's `.env.local`, then restart the app. Keep it server-only; never use a `NEXT_PUBLIC_` variable or browser code. New account passwords must be at least 10 characters.
9. Users can create an account at `/account/signup`, update their profile at `/account`, and submit a booking or pack request. Pack payment is arranged directly with the studio outside the site.
