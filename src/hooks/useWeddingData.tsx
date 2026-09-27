import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { wedding as fallbackData, type ScheduleEvent, type ScheduleDay, type Venue } from '@/data/wedding';

export type WeddingEvent = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  event_date: string;
  countdown_target: string;
  display_date_long: string;
  display_date_short: string;
  display_order: number;
};

export type WeddingConfig = {
  partner1: string;
  partner2: string;
  couple_script: string;
  initials: string;
  hashtag: string;
  cover_eyebrow: string;
  cover_request: string;
  cover_invitation: string;
  cover_background_image: string;
  audio_src: string;
  [key: string]: any;
};

type WeddingContextValue = {
  loading: boolean;
  config: WeddingConfig | null;
  events: WeddingEvent[];
  schedules: ScheduleDay[];
  venues: Venue[];
  closestEvent: WeddingEvent | null;
  primaryDateShort: string;
  primaryDateLong: string;
  fallbackHero: string;
  fallbackGallery: typeof fallbackData.galleryImages;
};

const defaultValue: WeddingContextValue = {
  loading: true,
  config: null,
  events: [],
  schedules: [],
  venues: [],
  closestEvent: null,
  primaryDateShort: '',
  primaryDateLong: '',
  fallbackHero: fallbackData.heroImage,
  fallbackGallery: fallbackData.galleryImages,
};

const WeddingContext = createContext<WeddingContextValue>(defaultValue);

export function WeddingDataProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<WeddingContextValue>(defaultValue);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabase) {
      setValue(buildFallback());
      return;
    }

    try {
      const [
        { data: configData },
        { data: eventsData },
        { data: scheduleItems },
        { data: venuesData },
      ] = await Promise.all([
        supabase.from('wedding_config').select('*').single(),
        supabase
          .from('wedding_events')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('wedding_schedule_items')
          .select('*')
          .order('display_order', { ascending: true }),
        supabase
          .from('wedding_venues')
          .select('*')
          .order('display_order', { ascending: true }),
      ]);

      if (!configData || !eventsData || eventsData.length === 0) {
        setValue(buildFallback());
        return;
      }

      // Group schedules by event
      const formattedSchedules: ScheduleDay[] = eventsData.map((evt: any) => {
        const evtSchedules = (scheduleItems || []).filter(
          (s: any) => s.event_id === evt.id
        );
        return {
          id: evt.slug,
          label: evt.title,
          subtitle: evt.subtitle || '',
          events: evtSchedules.map((s: any) => ({
            time: s.time,
            title: s.title,
            description: s.description || '',
            icon: s.icon as ScheduleEvent['icon'],
          })),
        };
      });

      // Venues
      const formattedVenues: Venue[] = (venuesData || []).map((v: any) => ({
        category: v.category as Venue['category'],
        name: v.name,
        address: v.address,
        mapsUrl: v.maps_url,
      }));

      const closest = computeClosestEvent(eventsData);
      const { dateShort, dateLong } = computeDates(eventsData);

      setValue({
        loading: false,
        config: configData as WeddingConfig,
        events: eventsData as WeddingEvent[],
        schedules: formattedSchedules,
        venues: formattedVenues,
        closestEvent: closest,
        primaryDateShort: dateShort,
        primaryDateLong: dateLong,
        fallbackHero: fallbackData.heroImage,
        fallbackGallery: fallbackData.galleryImages,
      });
    } catch (e) {
      console.error('Failed to load wedding data, using fallback.', e);
      setValue(buildFallback());
    }
  }

  return (
    <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>
  );
}

export function useWeddingData() {
  return useContext(WeddingContext);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildFallback(): WeddingContextValue {
  const fallbackEvents: WeddingEvent[] = [
    {
      id: 'gusaba',
      slug: 'gusaba',
      title: fallbackData.schedules[0].label,
      subtitle: fallbackData.schedules[0].subtitle,
      event_date: '2026-12-12',
      countdown_target: '2026-12-12T10:00:00',
      display_date_long: 'Saturday, the 12th of December 2026',
      display_date_short: '12 · 12 · 2026',
      display_order: 1,
    },
    {
      id: 'white',
      slug: 'white',
      title: fallbackData.schedules[1].label,
      subtitle: fallbackData.schedules[1].subtitle,
      event_date: '2026-12-19',
      countdown_target: fallbackData.date.countdownTo,
      display_date_long: fallbackData.date.long,
      display_date_short: fallbackData.date.short,
      display_order: 2,
    },
  ];

  const closest = computeClosestEvent(fallbackEvents);
  const { dateShort, dateLong } = computeDates(fallbackEvents);

  return {
    loading: false,
    config: {
      partner1: fallbackData.couple.partner1,
      partner2: fallbackData.couple.partner2,
      couple_script: fallbackData.couple.script,
      initials: fallbackData.couple.initials,
      hashtag: '#DaniaAndKevin',
      cover_eyebrow: fallbackData.cover.eyebrow,
      cover_request: fallbackData.cover.request,
      cover_invitation: fallbackData.cover.invitation,
      cover_background_image: fallbackData.cover.backgroundImage,
      audio_src: fallbackData.audio.src,
    },
    events: fallbackEvents,
    schedules: fallbackData.schedules,
    venues: fallbackData.venues,
    closestEvent: closest,
    primaryDateShort: dateShort,
    primaryDateLong: dateLong,
    fallbackHero: fallbackData.heroImage,
    fallbackGallery: fallbackData.galleryImages,
  };
}

function computeClosestEvent(evts: WeddingEvent[]): WeddingEvent {
  const now = Date.now();
  for (const evt of evts) {
    if (new Date(evt.countdown_target).getTime() > now) {
      return evt;
    }
  }
  return evts[evts.length - 1];
}

function computeDates(evts: WeddingEvent[]) {
  const parts = evts.map((e) => e.display_date_short.split('·').map((s) => s.trim()));

  let dateShort: string;
  if (
    parts.length > 1 &&
    parts[0].length >= 3 &&
    parts[1].length >= 3 &&
    parts[0][1] === parts[1][1] &&
    parts[0][2] === parts[1][2]
  ) {
    // Same month and year → e.g. "12 & 19 · 12 · 2026"
    dateShort = `${parts[0][0]} & ${parts[1][0]} · ${parts[0][1]} · ${parts[0][2]}`;
  } else {
    dateShort = evts.map((e) => e.display_date_short).join('  &  ');
  }

  const dateLong = evts.map((e) => e.display_date_long).join('  &  ');

  return { dateShort, dateLong };
}
