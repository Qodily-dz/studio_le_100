create table if not exists "studio-music".profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default '', phone text not null default '', email text not null default '', role text not null default 'user' check(role in ('user','admin')),
 is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table "studio-music".reservations (
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
 full_name text not null, phone text not null, email text, service_interest text not null,
 starts_at timestamptz not null, ends_at timestamptz not null, duration_minutes integer not null default 60 check(duration_minutes between 30 and 480),
 message text not null default '', status text not null default 'pending' check(status in ('pending','confirmed','declined','cancelled')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(starts_at > created_at),
 exclude using gist (tstzrange(starts_at, ends_at, '[)') with &&) where (status='confirmed')
);
create table "studio-music".pack_orders (
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
 pack_slug text not null, pack_name text not null, price_label text not null,
 full_name text not null, phone text not null, email text,
 status text not null default 'pending' check(status in ('pending','confirmed','declined','completed','cancelled')),
 payment_note text not null default 'Paiement convenu directement avec le studio, hors plateforme.',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index reservations_start_idx on "studio-music".reservations(starts_at);
create index reservations_status_idx on "studio-music".reservations(status);
create index pack_orders_created_idx on "studio-music".pack_orders(created_at desc);
create index pack_orders_status_idx on "studio-music".pack_orders(status);
create index profiles_role_idx on "studio-music".profiles(role);
create trigger profiles_updated before update on "studio-music".profiles for each row execute function "studio-music".touch_updated_at();
create trigger reservations_updated before update on "studio-music".reservations for each row execute function "studio-music".touch_updated_at();
create trigger pack_orders_updated before update on "studio-music".pack_orders for each row execute function "studio-music".touch_updated_at();
create or replace function "studio-music".set_reservation_end() returns trigger language plpgsql set search_path = '' as $$
begin new.ends_at := new.starts_at + make_interval(mins => new.duration_minutes); return new; end $$;
create trigger set_reservation_end before insert or update of starts_at,duration_minutes on "studio-music".reservations for each row execute function "studio-music".set_reservation_end();

create or replace function "studio-music".handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into "studio-music".profiles(user_id,full_name,phone,email)
 values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.raw_user_meta_data->>'phone',''),coalesce(new.email,''))
 on conflict(user_id) do nothing;
 return new;
end $$;
revoke all on function "studio-music".handle_new_user() from public, anon, authenticated;
create trigger create_profile_for_auth_user after insert on auth.users for each row execute function "studio-music".handle_new_user();
create or replace function "studio-music".sync_profile_email() returns trigger language plpgsql security definer set search_path = '' as $$
begin update "studio-music".profiles set email=coalesce(new.email,'') where user_id=new.id; return new; end $$;
revoke all on function "studio-music".sync_profile_email() from public, anon, authenticated;
create trigger sync_email_for_auth_user after update of email on auth.users for each row when (old.email is distinct from new.email) execute function "studio-music".sync_profile_email();
insert into "studio-music".profiles(user_id,full_name,email,role)
select u.id,coalesce(u.raw_user_meta_data->>'full_name',''),coalesce(u.email,''),case when exists(select 1 from "studio-music".admin_users a where a.user_id=u.id) then 'admin' else 'user' end
from auth.users u on conflict(user_id) do nothing;

create or replace function "studio-music".is_active_user() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from "studio-music".profiles where user_id=(select auth.uid()) and is_active)
$$;
revoke all on function "studio-music".is_active_user() from public;
grant execute on function "studio-music".is_active_user() to authenticated;

alter table "studio-music".profiles enable row level security;
alter table "studio-music".reservations enable row level security;
alter table "studio-music".pack_orders enable row level security;
grant select on "studio-music".profiles to authenticated;
grant update(full_name,phone) on "studio-music".profiles to authenticated;
grant update(role,is_active) on "studio-music".profiles to authenticated;
grant select,insert,update,delete on "studio-music".admin_users to authenticated;
grant select,insert on "studio-music".reservations to anon,authenticated;
grant select,update on "studio-music".reservations to authenticated;
grant select,insert on "studio-music".pack_orders to anon,authenticated;
grant select,update on "studio-music".pack_orders to authenticated;
create policy "users and admins read profiles" on "studio-music".profiles for select to authenticated using(user_id=(select auth.uid()) or "studio-music".is_admin());
create policy "users edit own profile" on "studio-music".profiles for update to authenticated using(user_id=(select auth.uid()) and is_active) with check(user_id=(select auth.uid()) and role='user' and is_active);
create policy "admins manage profiles" on "studio-music".profiles for update to authenticated using("studio-music".is_admin()) with check("studio-music".is_admin());
create policy "admins manage admin membership" on "studio-music".admin_users for all to authenticated using("studio-music".is_admin()) with check("studio-music".is_admin());
create policy "guests create reservation requests" on "studio-music".reservations for insert to anon with check(user_id is null);
create policy "active users create reservation requests" on "studio-music".reservations for insert to authenticated with check(user_id=(select auth.uid()) and "studio-music".is_active_user());
create policy "users and admins read reservations" on "studio-music".reservations for select to authenticated using((user_id=(select auth.uid()) and "studio-music".is_active_user()) or "studio-music".is_admin());
create policy "admins manage reservations" on "studio-music".reservations for update to authenticated using("studio-music".is_admin()) with check("studio-music".is_admin());
create policy "guests create pack orders" on "studio-music".pack_orders for insert to anon with check(user_id is null);
create policy "active users create pack orders" on "studio-music".pack_orders for insert to authenticated with check(user_id=(select auth.uid()) and "studio-music".is_active_user());
create policy "users and admins read pack orders" on "studio-music".pack_orders for select to authenticated using((user_id=(select auth.uid()) and "studio-music".is_active_user()) or "studio-music".is_admin());
create policy "admins manage pack orders" on "studio-music".pack_orders for update to authenticated using("studio-music".is_admin()) with check("studio-music".is_admin());

do $$ begin
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='studio-music' and tablename='reservations') then alter publication supabase_realtime add table "studio-music".reservations; end if;
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='studio-music' and tablename='pack_orders') then alter publication supabase_realtime add table "studio-music".pack_orders; end if;
end $$;
