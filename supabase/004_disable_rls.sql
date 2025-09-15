-- Disable RLS for all tables (development only)
alter table restaurants disable row level security;
alter table users_restaurants disable row level security;
alter table tables disable row level security;
alter table waitlists disable row level security;
alter table parties disable row level security;
alter table notifications disable row level security;
alter table metrics_daily disable row level security;

-- Drop any existing policies that might cause issues
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
