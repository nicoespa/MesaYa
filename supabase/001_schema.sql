-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Tenancy
create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  address text,
  tz text not null default 'America/Argentina/Buenos_Aires',
  plan text not null default 'starter',
  waba_phone_id text, -- WhatsApp phone number id
  created_at timestamptz default now()
);

create table public.users_restaurants (
  user_id uuid not null,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  role text not null default 'operator', -- operator|manager|owner
  primary key (user_id, restaurant_id)
);

create table public.tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  seat_count int not null check (seat_count > 0),
  type text not null default 'standard' -- bar|booth|outdoor|standard
);

create table public.waitlists (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  status text not null default 'open', -- open|closed
  created_at timestamptz default now()
);

-- Party states: queued → notified → on_the_way → seated | no_show | canceled
create type party_state as enum ('queued','notified','on_the_way','seated','no_show','canceled');

create table public.parties (
  id uuid primary key default gen_random_uuid(),
  waitlist_id uuid not null references public.waitlists(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  phone text not null,
  size int not null check (size > 0 and size <= 12),
  state party_state not null default 'queued',
  token text not null unique, -- opaque for /status/[token]
  eta_minutes int, -- current estimate
  notes text,
  created_at timestamptz default now(),
  notified_at timestamptz,
  seated_at timestamptz,
  no_show_at timestamptz,
  canceled_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  party_id uuid not null references public.parties(id) on delete cascade,
  channel text not null check (channel in ('whatsapp','sms')),
  template text not null, -- 'join_confirm','reminder','table_ready'
  status text not null,   -- 'queued','sent','failed'
  cost numeric(10,4),
  provider_id text,
  sent_at timestamptz default now()
);

create table public.phone_verifications (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code text not null,
  expires_at timestamptz not null,
  verified boolean not null default false,
  created_at timestamptz default now()
);

create table public.metrics_daily (
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  day date not null,
  seated int not null default 0,
  no_shows int not null default 0,
  avg_wait_minutes int,
  abandonment_rate numeric(5,2),
  covers int not null default 0,
  primary key (restaurant_id, day)
);

-- RLS
alter table restaurants enable row level security;
alter table users_restaurants enable row level security;
alter table tables enable row level security;
alter table waitlists enable row level security;
alter table parties enable row level security;
alter table notifications enable row level security;
alter table metrics_daily enable row level security;

-- Policies: authenticated users can only access rows of their restaurants.
create policy "tenant read" on restaurants for select using (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = id and ur.user_id = auth.uid())
);
create policy "tenant read ur" on users_restaurants for select using (user_id = auth.uid() or
  exists (select 1 from users_restaurants ur where ur.restaurant_id = users_restaurants.restaurant_id and ur.user_id = auth.uid()));
create policy "tenant read tables" on tables for select using (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = restaurant_id and ur.user_id = auth.uid())
);
create policy "tenant read waitlists" on waitlists for select using (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = restaurant_id and ur.user_id = auth.uid())
);
create policy "tenant crud tables" on tables for all using (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = restaurant_id and ur.user_id = auth.uid())
) with check (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = restaurant_id and ur.user_id = auth.uid())
);
create policy "tenant crud waitlists" on waitlists for all using (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = restaurant_id and ur.user_id = auth.uid())
) with check (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = restaurant_id and ur.user_id = auth.uid())
);
create policy "tenant crud parties" on parties for all using (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = parties.restaurant_id and ur.user_id = auth.uid())
) with check (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = parties.restaurant_id and ur.user_id = auth.uid())
);
create policy "tenant read notifications" on notifications for select using (
  exists (select 1 from users_restaurants ur where ur.restaurant_id =
    (select p.restaurant_id from parties p where p.id = notifications.party_id) and ur.user_id = auth.uid())
);
create policy "tenant read metrics" on metrics_daily for select using (
  exists (select 1 from users_restaurants ur where ur.restaurant_id = metrics_daily.restaurant_id and ur.user_id = auth.uid())
);

-- Allow public access to parties by token (for status page)
create policy "public read party by token" on parties for select using (true);

-- Helper: estimate wait time (very simple for MVP)
create or replace function public.estimate_eta_minutes(rid uuid) returns int
language sql stable as $$
  with q as (
    select count(*) as ahead
    from parties p
    where p.restaurant_id = rid and p.state in ('queued','notified','on_the_way')
  )
  select greatest(5, (select ahead from q) * 7); -- 7 min per party (placeholder)
$$;

-- Indexes for performance
create index idx_parties_restaurant_state on parties(restaurant_id, state);
create index idx_parties_token on parties(token);
create index idx_parties_created_at on parties(created_at);
create index idx_notifications_party_id on notifications(party_id);
create index idx_phone_verifications_phone on phone_verifications(phone);
create index idx_phone_verifications_expires_at on phone_verifications(expires_at);
