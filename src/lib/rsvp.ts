import { supabase } from '@/lib/supabase';

export type RSVPData = {
  fullName: string;
  phone: string;
  email?: string;
  attending: boolean;
  guestCount: number;
  message?: string;
};

export type RSVPResult = { ok: boolean; error?: string };

const STORAGE_KEY = 'wedding_rsvp_fallback';

export async function submitRSVP(data: RSVPData): Promise<RSVPResult> {
  if (supabase) {
    try {
      const { error } = await supabase.from('wedding_rsvps').insert({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email || null,
        attending: data.attending,
        guest_count: data.guestCount,
        message: data.message || null,
      });
      if (error) {
        console.error('RSVP insert failed', error);
        return { ok: false, error: 'We could not send your RSVP just now. Please try again.' };
      }
      return { ok: true };
    } catch (cause) {
      console.error('RSVP submission error', cause);
      return { ok: false, error: 'We could not send your RSVP just now. Please try again.' };
    }
  }

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push({ ...data, at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return { ok: true };
  } catch {
    return { ok: false, error: 'We could not save your RSVP locally. Please try again.' };
  }
}
