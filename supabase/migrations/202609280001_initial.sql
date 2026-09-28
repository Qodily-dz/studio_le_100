create schema if not exists "studio-music";
grant usage on schema "studio-music" to anon, authenticated;
grant usage on schema "studio-music" to service_role;

create table "studio-music".services (
 id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, eyebrow text,
 short_description text, description text, price_amount integer, price_label text not null, price_unit text,
 features jsonb not null default '[]'::jsonb, sort_order integer not null default 0,
 is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table "studio-music".packages (
 id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, tagline text,
 description text, price_amount integer, price_label text not null, compare_at_price integer,
 items jsonb not null default '[]'::jsonb, badge text, is_featured boolean not null default false,
 sort_order integer not null default 0, is_active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table "studio-music".contact_messages (
 id uuid primary key default gen_random_uuid(), full_name text not null, artist_name text, phone text not null,
 email text, service_interest text, message text not null, status text not null default 'new' check(status in ('new','read','replied','archived')),
 created_at timestamptz not null default now()
);
create table "studio-music".admin_users (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
create index services_order_idx on "studio-music".services(sort_order);
create index packages_order_idx on "studio-music".packages(sort_order);
create index messages_created_idx on "studio-music".contact_messages(created_at desc);
create index messages_status_idx on "studio-music".contact_messages(status);
create or replace function "studio-music".touch_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
create trigger services_updated before update on "studio-music".services for each row execute function "studio-music".touch_updated_at();
create trigger packages_updated before update on "studio-music".packages for each row execute function "studio-music".touch_updated_at();
create or replace function "studio-music".is_admin() returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from "studio-music".admin_users where user_id = (select auth.uid())) $$;
revoke all on function "studio-music".is_admin() from public;
grant execute on function "studio-music".is_admin() to anon, authenticated;
alter table "studio-music".services enable row level security;
alter table "studio-music".packages enable row level security;
alter table "studio-music".contact_messages enable row level security;
alter table "studio-music".admin_users enable row level security;
grant select on "studio-music".services, "studio-music".packages to anon, authenticated;
grant insert, update, delete on "studio-music".services, "studio-music".packages to authenticated;
grant insert on "studio-music".contact_messages to anon, authenticated;
grant select, update, delete on "studio-music".contact_messages to authenticated;
grant select on "studio-music".admin_users to authenticated;
create policy "public sees active services" on "studio-music".services for select to anon, authenticated using (is_active or "studio-music".is_admin());
create policy "admins manage services" on "studio-music".services for all to authenticated using ("studio-music".is_admin()) with check ("studio-music".is_admin());
create policy "public sees active packages" on "studio-music".packages for select to anon, authenticated using (is_active or "studio-music".is_admin());
create policy "admins manage packages" on "studio-music".packages for all to authenticated using ("studio-music".is_admin()) with check ("studio-music".is_admin());
create policy "public sends contact messages" on "studio-music".contact_messages for insert to anon, authenticated with check (true);
create policy "admins read messages" on "studio-music".contact_messages for select to authenticated using ("studio-music".is_admin());
create policy "admins update messages" on "studio-music".contact_messages for update to authenticated using ("studio-music".is_admin()) with check ("studio-music".is_admin());
create policy "admins delete messages" on "studio-music".contact_messages for delete to authenticated using ("studio-music".is_admin());
create policy "admins can check own membership" on "studio-music".admin_users for select to authenticated using (user_id = (select auth.uid()) and "studio-music".is_admin());

insert into "studio-music".services(slug,title,eyebrow,short_description,description,price_amount,price_label,price_unit,features,sort_order) values
('enregistrement-vocal','Enregistrement vocal','La prise','Une voix au centre, accompagnée du début à la fin.','Prise de voix assistée avec direction artistique, conseils de placement vocal, cabine traitée acoustiquement et chaîne d’enregistrement professionnelle.',2000,'2 000 DA','/ heure','["Direction artistique","Cabine traitée","Prise assistée"]',1),
('mixage-mastering','Mixage & mastering','La finition','Un morceau équilibré, prêt à sortir.','Égalisation, compression, nettoyage fréquentiel, spatialisation, équilibre instrumental, traitement vocal, réverbérations, délais et mastering adapté aux plateformes de streaming.',7000,'7 000 DA','/ titre','["Traitement vocal","Mixage stéréo","Master streaming"]',2),
('beatmaking-composition','Beatmaking & composition','La production','Des prods façonnées autour de votre identité.','Productions exclusives et personnalisées selon la voix, le style et l’identité de l’artiste. Raï, rap, trap, RnB, Zan9aoui, afro et drill. Instruments live possibles : trompette, violon et derbouka.',7000,'7 000 DA','/ beat','["Raï · Rap · Trap · RnB","Afro · Drill · Zan9aoui","Instruments live en option"]',3),
('topline-ecriture','Topline & écriture','Les mots','Un refrain qui reste et des paroles à votre image.','Création de toplines, paroles originales, arrangements vocaux et construction de la structure du morceau.',null,'Sur devis','/ selon la demande','["Topline","Paroles originales","Arrangements vocaux"]',4),
('clip-video','Réalisation clip vidéo','L’image','Un clip pensé pour raconter votre morceau.','Écriture du scénario, tournage, éclairage, montage, colorimétrie et effets visuels si nécessaires.',15000,'À partir de 15 000 DA',null,'["Scénario","Tournage & éclairage","Montage & étalonnage"]',5);
insert into "studio-music".packages(slug,name,tagline,description,price_amount,price_label,compare_at_price,items,badge,is_featured,sort_order) values
('single-star','Pack Single Star','Tout l’essentiel pour un titre prêt à sortir.','Enregistrement, beat exclusif et finition professionnelle.',15000,'15 000 DA',16000,'["1h30 enregistrement vocal","1 beat personnalisé","Mixage & mastering professionnel"]','Économisez 1 000 DA',false,1),
('hitmaker','Pack Hitmaker','Du premier couplet au hit radio.','La formule complète pour construire votre morceau.',25000,'25 000 DA',null,'["2h enregistrement vocal","1 beat personnalisé","Instruments live","Topline & arrangements vocaux","Mixage & mastering HD"]','Le plus choisi',true,2),
('vip-artiste','Pack VIP Artiste','Le son et l’image dans une seule formule.','Pack Hitmaker complété par un clip prêt à publier.',38000,'À partir de 38 000 DA',null,'["Pack Hitmaker","Tournage clip","Scénario & montage","Étalonnage","Export YouTube & réseaux"]',null,false,3);
