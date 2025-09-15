export type PartyState = 'queued' | 'notified' | 'on_the_way' | 'seated' | 'no_show' | 'canceled';

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  address?: string;
  tz: string;
  plan: string;
  waba_phone_id?: string;
  created_at: string;
}

export interface UserRestaurant {
  user_id: string;
  restaurant_id: string;
  role: 'operator' | 'manager' | 'owner';
}

export interface Table {
  id: string;
  restaurant_id: string;
  seat_count: number;
  type: 'bar' | 'booth' | 'outdoor' | 'standard';
}

export interface Waitlist {
  id: string;
  restaurant_id: string;
  status: 'open' | 'closed';
  created_at: string;
}

export interface Party {
  id: string;
  waitlist_id: string;
  restaurant_id: string;
  name: string;
  phone: string;
  size: number;
  state: PartyState;
  token: string;
  eta_minutes?: number;
  notes?: string;
  created_at: string;
  notified_at?: string;
  seated_at?: string;
  no_show_at?: string;
  canceled_at?: string;
}

export interface Notification {
  id: string;
  party_id: string;
  channel: 'whatsapp' | 'sms';
  template: 'join_confirm' | 'reminder' | 'table_ready';
  status: 'queued' | 'sent' | 'failed';
  cost?: number;
  provider_id?: string;
  sent_at: string;
}

export interface PhoneVerification {
  id: string;
  phone: string;
  code: string;
  expires_at: string;
  verified: boolean;
  created_at: string;
}

export interface MetricsDaily {
  restaurant_id: string;
  day: string;
  seated: number;
  no_shows: number;
  avg_wait_minutes?: number;
  abandonment_rate?: number;
  covers: number;
}

export interface PartyWithDetails extends Party {
  restaurant: Restaurant;
  position: number;
  eta_minutes: number;
  wait_time_minutes?: number;
}

export interface QueueStats {
  waiting: number;
  avg_wait_minutes: number;
  seated_today: number;
  no_shows_today: number;
}
