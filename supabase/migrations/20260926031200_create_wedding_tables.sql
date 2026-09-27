/*
# Dynamic Wedding Tables and RSVP updates

1. New Tables
- `wedding_config`
- `wedding_events`
- `wedding_schedule_items`
- `wedding_venues`

2. Updates
- Add `events_attending` to `wedding_rsvps`.

3. Security
- Public read (SELECT) for config, events, schedules, venues.
- Admin full access.
*/

CREATE TABLE IF NOT EXISTS public.wedding_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner1 text NOT NULL DEFAULT 'Dania',
  partner2 text NOT NULL DEFAULT 'Kevin',
  couple_script text NOT NULL DEFAULT 'Dania & Kevin',
  initials text NOT NULL DEFAULT 'D&K',
  hashtag text NOT NULL DEFAULT '#DaniaAndKevin',
  cover_eyebrow text DEFAULT 'Together with their families',
  cover_request text DEFAULT 'request the pleasure of your company',
  cover_invitation text DEFAULT 'You are invited!',
  cover_background_image text DEFAULT '/images/AXX_3641.jpg',
  audio_src text DEFAULT '/audio/wedding-music.mp3',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wedding_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  event_date date NOT NULL,
  countdown_target timestamptz NOT NULL,
  display_date_long text,
  display_date_short text,
  display_order int NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wedding_schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.wedding_events(id) ON DELETE CASCADE,
  time text NOT NULL,
  title text NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'arrival',
  display_order int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wedding_venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.wedding_events(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  maps_url text NOT NULL,
  display_order int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Modify existing wedding_rsvps table
ALTER TABLE public.wedding_rsvps ADD COLUMN IF NOT EXISTS events_attending text DEFAULT 'both';

-- Enable RLS
ALTER TABLE public.wedding_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_venues ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read)
CREATE POLICY "Public can view wedding config" ON public.wedding_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can view wedding events" ON public.wedding_events FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public can view schedule items" ON public.wedding_schedule_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can view venues" ON public.wedding_venues FOR SELECT TO anon, authenticated USING (true);

-- Admin Policies (Full Access)
CREATE POLICY "Admin can manage config" ON public.wedding_config TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage events" ON public.wedding_events TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage schedules" ON public.wedding_schedule_items TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage venues" ON public.wedding_venues TO authenticated USING (true) WITH CHECK (true);

-- Update RSVP policy check to include the new column
DROP POLICY IF EXISTS "Guests can submit wedding RSVPs" ON public.wedding_rsvps;
CREATE POLICY "Guests can submit wedding RSVPs"
  ON public.wedding_rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(full_name)) BETWEEN 2 AND 120
    AND length(trim(phone)) BETWEEN 5 AND 40
    AND (email IS NULL OR length(trim(email)) <= 254)
    AND guest_count BETWEEN 1 AND 12
    AND length(coalesce(message, '')) <= 1000
    AND events_attending IN ('both', 'gusaba', 'white')
  );

-- Allow authenticated (admin) to read RSVPs
DROP POLICY IF EXISTS "RSVPs are not publicly readable" ON public.wedding_rsvps;
CREATE POLICY "Authenticated users can read RSVPs"
  ON public.wedding_rsvps FOR SELECT
  TO authenticated
  USING (true);

-- Keep anon from reading RSVPs
CREATE POLICY "RSVPs are not readable by anon"
  ON public.wedding_rsvps FOR SELECT
  TO anon
  USING (false);

-- Re-grant SELECT on wedding_rsvps to authenticated (revoked by earlier migration)
GRANT SELECT ON public.wedding_rsvps TO authenticated;

-- Seed Initial Data

-- Config
INSERT INTO public.wedding_config (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- Events
DO $$
DECLARE
  gusaba_id uuid := gen_random_uuid();
  white_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO public.wedding_events (id, slug, title, subtitle, event_date, countdown_target, display_date_long, display_date_short, display_order)
  VALUES
    (gusaba_id, 'gusaba', 'Gusaba Program', 'The traditional introduction ceremony', '2026-12-12', '2026-12-12T10:00:00+02:00', 'Saturday, the 12th of December 2026', '12 · 12 · 2026', 1),
    (white_id, 'white', 'White Wedding Program', 'The ceremony and celebration', '2026-12-19', '2026-12-19T14:00:00+02:00', 'Saturday, the 19th of December 2026', '19 · 12 · 2026', 2);

  -- Schedule items for Gusaba
  INSERT INTO public.wedding_schedule_items (event_id, time, title, description, icon, display_order)
  VALUES
    (gusaba_id, '10:00', 'Arrival & Seating', 'Arrival and seating of the bride’s family and guests, accompanied by traditional music.', 'arrival', 1),
    (gusaba_id, '10:40', 'Groom’s Family Arrival', 'Formal entrance of the groom’s family, welcomed with traditional drums.', 'drums', 2),
    (gusaba_id, '11:10', 'Opening Prayer', 'A blessing to open the day and invite grace over the gathering.', 'prayer', 3),
    (gusaba_id, '11:30', 'Welcome Remarks', 'Welcome speeches from the bride and groom’s families.', 'welcome', 4),
    (gusaba_id, '12:00', 'Gusaba Ceremony', 'The traditional negotiation and introduction of the groom’s family.', 'ceremony', 5),
    (gusaba_id, '13:30', 'Gift Exchange', 'Families exchange symbolic gifts as a sign of union.', 'ring', 6),
    (gusaba_id, '15:00', 'Lunch & Toasts', 'A shared meal and toasts celebrating the two families.', 'toast', 7);

  -- Schedule items for White Wedding
  INSERT INTO public.wedding_schedule_items (event_id, time, title, description, icon, display_order)
  VALUES
    (white_id, '14:00', 'Arrival & Seating', 'Guests are seated as gentle music plays in the background.', 'arrival', 1),
    (white_id, '14:30', 'Opening Prayer', 'A short prayer to begin the ceremony.', 'prayer', 2),
    (white_id, '14:45', 'Bridal Procession', 'The bride walks in accompanied by her family.', 'drums', 3),
    (white_id, '15:00', 'Wedding Ceremony', 'Vows and ring exchange before the congregation.', 'ceremony', 4),
    (white_id, '15:45', 'Reception Welcome', 'The couple is introduced and welcomed to the reception.', 'welcome', 5),
    (white_id, '17:00', 'Dinner & Toasts', 'Dinner is served, followed by toasts from loved ones.', 'dinner', 6),
    (white_id, '19:00', 'First Dance', 'The couple’s first dance as a married pair.', 'dancing', 7),
    (white_id, '21:30', 'Send-off', 'A sparkling send-off to close the celebration.', 'sendoff', 8);

  -- Venues
  INSERT INTO public.wedding_venues (event_id, category, name, address, maps_url, display_order)
  VALUES
    (gusaba_id, 'intro', 'Intare Conference Arena — Pavilion', 'KG 11 Ave, Nyarugunge, Kigali, Rwanda', 'https://www.google.com/maps/search/?api=1&query=Intare+Conference+Arena+Kigali', 1),
    (white_id, 'church', 'Sainte Famille Church', 'KN 4 Ave, Kigali, Rwanda', 'https://www.google.com/maps/search/?api=1&query=Sainte+Famille+Church+Kigali', 2),
    (white_id, 'reception', 'Intare Conference Arena — Pavilion', 'KG 11 Ave, Nyarugunge, Kigali, Rwanda', 'https://www.google.com/maps/search/?api=1&query=Intare+Conference+Arena+Kigali', 3);
END $$;
