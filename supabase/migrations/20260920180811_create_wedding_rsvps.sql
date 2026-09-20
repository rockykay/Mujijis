/*
# Create wedding RSVP submissions table

1. New Tables
- `wedding_rsvps`
- `id` (uuid, primary key) uniquely identifies each submission.
- `full_name` (text) stores the guest's name.
- `phone` (text) stores the guest's phone number.
- `email` (text) optionally stores the guest's email address.
- `attending` (boolean) stores whether the guest will attend.
- `guest_count` (integer) stores the number of guests including the respondent.
- `message` (text) optionally stores the guest's note for the couple.
- `created_at` (timestamptz) records when the RSVP was submitted.

2. Security
- Row-level security is enabled on `wedding_rsvps`.
- Anonymous and authenticated visitors may submit an RSVP.
- RSVP data is not readable, editable, or deletable through the public browser client.

3. Important Notes
- This is a single-tenant invitation and does not require accounts.
- The public form only needs insert access; the remaining policies are explicit deny-by-default policies.
*/

CREATE TABLE IF NOT EXISTS public.wedding_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  attending boolean NOT NULL,
  guest_count integer NOT NULL DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 12),
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;

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
  );

DROP POLICY IF EXISTS "RSVPs are not publicly readable" ON public.wedding_rsvps;
CREATE POLICY "RSVPs are not publicly readable"
  ON public.wedding_rsvps FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "RSVPs are not publicly editable" ON public.wedding_rsvps;
CREATE POLICY "RSVPs are not publicly editable"
  ON public.wedding_rsvps FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "RSVPs are not publicly deletable" ON public.wedding_rsvps;
CREATE POLICY "RSVPs are not publicly deletable"
  ON public.wedding_rsvps FOR DELETE
  TO anon, authenticated
  USING (false);
