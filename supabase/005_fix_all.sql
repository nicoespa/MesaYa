-- Drop all existing policies first
drop policy if exists "Allow all for restaurants" on restaurants;
drop policy if exists "Allow all for users_restaurants" on users_restaurants;
drop policy if exists "Allow all for tables" on tables;
drop policy if exists "Allow all for waitlists" on waitlists;
drop policy if exists "Allow all for parties" on parties;
drop policy if exists "Allow all for notifications" on notifications;
drop policy if exists "Allow all for metrics_daily" on metrics_daily;
drop policy if exists "tenant read" on restaurants;
drop policy if exists "tenant read ur" on users_restaurants;
drop policy if exists "tenant read tables" on tables;
drop policy if exists "tenant read waitlists" on waitlists;
drop policy if exists "tenant crud tables" on tables;
drop policy if exists "tenant crud waitlists" on waitlists;
drop policy if exists "tenant crud parties" on parties;
drop policy if exists "tenant read notifications" on notifications;
drop policy if exists "tenant read metrics" on metrics_daily;
drop policy if exists "public read party by token" on parties;

-- Disable RLS completely for development
alter table restaurants disable row level security;
alter table users_restaurants disable row level security;
alter table tables disable row level security;
alter table waitlists disable row level security;
alter table parties disable row level security;
alter table notifications disable row level security;
alter table metrics_daily disable row level security;

-- Clear existing data and re-insert
delete from public.notifications;
delete from public.parties;
delete from public.waitlists;
delete from public.tables;
delete from public.users_restaurants;
delete from public.metrics_daily;
delete from public.restaurants;

-- Insert test restaurant
insert into public.restaurants (id, slug, name, address, tz, plan, waba_phone_id) 
values (
  '550e8400-e29b-41d4-a716-446655440000',
  'kansas-belgrano',
  'Kansas Belgrano',
  'Av. Santa Fe 3456, C1425 CABA, Argentina',
  'America/Argentina/Buenos_Aires',
  'starter',
  '+5491123456789'
);

-- Insert test user
insert into public.users_restaurants (user_id, restaurant_id, role)
values (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'owner'
);

-- Insert test tables
insert into public.tables (restaurant_id, seat_count, type)
values 
  ('550e8400-e29b-41d4-a716-446655440000', 2, 'bar'),
  ('550e8400-e29b-41d4-a716-446655440000', 4, 'standard'),
  ('550e8400-e29b-41d4-a716-446655440000', 4, 'standard'),
  ('550e8400-e29b-41d4-a716-446655440000', 6, 'booth'),
  ('550e8400-e29b-41d4-a716-446655440000', 2, 'outdoor'),
  ('550e8400-e29b-41d4-a716-446655440000', 4, 'outdoor');

-- Insert open waitlist
insert into public.waitlists (id, restaurant_id, status)
values (
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440000',
  'open'
);

-- Insert demo parties
insert into public.parties (id, waitlist_id, restaurant_id, name, phone, size, state, token, eta_minutes, notes, created_at)
values 
  (
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'María González',
    '+5491123456789',
    2,
    'queued',
    'demo-token-1',
    14,
    'Mesa cerca de la ventana',
    now() - interval '10 minutes'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Carlos Rodríguez',
    '+5491123456790',
    4,
    'notified',
    'demo-token-2',
    7,
    null,
    now() - interval '5 minutes'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Ana Martínez',
    '+5491123456791',
    3,
    'on_the_way',
    'demo-token-3',
    0,
    'Llegan en 5 minutos',
    now() - interval '2 minutes'
  );

-- Update timestamps
update public.parties 
set notified_at = now() - interval '3 minutes'
where id = '550e8400-e29b-41d4-a716-446655440004';

-- Insert demo notifications
insert into public.notifications (party_id, channel, template, status, cost, provider_id)
values 
  ('550e8400-e29b-41d4-a716-446655440004', 'whatsapp', 'table_ready', 'sent', 0.05, 'wa_msg_123'),
  ('550e8400-e29b-41d4-a716-446655440005', 'whatsapp', 'reminder', 'sent', 0.05, 'wa_msg_124');

-- Insert demo metrics
insert into public.metrics_daily (restaurant_id, day, seated, no_shows, avg_wait_minutes, abandonment_rate, covers)
values 
  ('550e8400-e29b-41d4-a716-446655440000', current_date, 12, 2, 18, 5.5, 45);
