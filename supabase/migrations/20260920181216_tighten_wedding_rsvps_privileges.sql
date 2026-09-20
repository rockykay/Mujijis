/*
# Tighten wedding_rsvps table privileges

1. Security changes
- Revoke default UPDATE, DELETE and SELECT privileges from anon and authenticated.
- Keep INSERT for anon and authenticated so the public form can submit RSVPs.
- RLS policies already deny SELECT/UPDATE/DELETE (USING false); this removes the
  underlying table grants as well for defense in depth.

2. Important Notes
- The public RSVP form continues to work because INSERT is still granted.
- No data is lost; only privileges change.
*/

REVOKE SELECT, UPDATE, DELETE ON public.wedding_rsvps FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.wedding_rsvps FROM authenticated;
GRANT INSERT ON public.wedding_rsvps TO anon;
GRANT INSERT ON public.wedding_rsvps TO authenticated;
