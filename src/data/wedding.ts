export type ScheduleEvent = {
  time: string;
  title: string;
  description: string;
  icon:
  | 'arrival'
  | 'drums'
  | 'prayer'
  | 'welcome'
  | 'ceremony'
  | 'ring'
  | 'toast'
  | 'dancing'
  | 'dinner'
  | 'sendoff';
};

export type ScheduleDay = {
  id: string;
  label: string;
  subtitle: string;
  events: ScheduleEvent[];
};

export type Venue = {
  category: 'intro' | 'church' | 'reception';
  name: string;
  address: string;
  mapsUrl: string;
};

export const wedding = {
  couple: {
    initials: 'D&K',
    partner1: 'Dania',
    partner2: 'Kevin',
    script: 'Dania & Kevin',
  },
  cover: {
    eyebrow: 'Together with their families',
    request: 'request the pleasure of your company',
    invitation: 'You are invited!',
    openLabel: 'Click the seal to open',
    backgroundImage: '/images/AXX_3641.jpg',
  },
  date: {
    long: 'Saturday, the 19th of December 2026',
    short: '19 · 12 · 2026',
    countdownTo: '2026-12-19T10:00:00',
  },
  heroImage:
    'https://images.pexels.com/photos/16542556/pexels-photo-16542556.jpeg?auto=compress&cs=tinysrgb&h=1400',
  galleryImages: [
    {
      src: 'https://images.pexels.com/photos/35106517/pexels-photo-35106517.jpeg?auto=compress&cs=tinysrgb&h=1400',
      alt: 'Amani and Marcus standing together on a warmly lit staircase',
    },
    {
      src: 'https://images.pexels.com/photos/35999813/pexels-photo-35999813.jpeg?auto=compress&cs=tinysrgb&h=1400',
      alt: 'The couple sharing a quiet moment behind a window',
    },
    {
      src: 'https://images.pexels.com/photos/35106520/pexels-photo-35106520.jpeg?auto=compress&cs=tinysrgb&h=1400',
      alt: 'Bride and groom walking up the stairs together',
    },
  ],
  schedules: [
    {
      id: 'gusaba',
      label: 'Gusaba Program',
      subtitle: 'The traditional introduction ceremony',
      events: [
        { time: '10:00', title: 'Arrival & Seating', description: 'Arrival and seating of the bride’s family and guests, accompanied by traditional music.', icon: 'arrival' },
        { time: '10:40', title: 'Groom’s Family Arrival', description: 'Formal entrance of the groom’s family, welcomed with traditional drums.', icon: 'drums' },
        { time: '11:10', title: 'Opening Prayer', description: 'A blessing to open the day and invite grace over the gathering.', icon: 'prayer' },
        { time: '11:30', title: 'Welcome Remarks', description: 'Welcome speeches from the bride and groom’s families.', icon: 'welcome' },
        { time: '12:00', title: 'Gusaba Ceremony', description: 'The traditional negotiation and introduction of the groom’s family.', icon: 'ceremony' },
        { time: '13:30', title: 'Gift Exchange', description: 'Families exchange symbolic gifts as a sign of union.', icon: 'ring' },
        { time: '15:00', title: 'Lunch & Toasts', description: 'A shared meal and toasts celebrating the two families.', icon: 'toast' },
      ],
    },
    {
      id: 'white',
      label: 'White Wedding Program',
      subtitle: 'The ceremony and celebration',
      events: [
        { time: '14:00', title: 'Arrival & Seating', description: 'Guests are seated as gentle music plays in the background.', icon: 'arrival' },
        { time: '14:30', title: 'Opening Prayer', description: 'A short prayer to begin the ceremony.', icon: 'prayer' },
        { time: '14:45', title: 'Bridal Procession', description: 'The bride walks in accompanied by her family.', icon: 'drums' },
        { time: '15:00', title: 'Wedding Ceremony', description: 'Vows and ring exchange before the congregation.', icon: 'ceremony' },
        { time: '15:45', title: 'Reception Welcome', description: 'The couple is introduced and welcomed to the reception.', icon: 'welcome' },
        { time: '17:00', title: 'Dinner & Toasts', description: 'Dinner is served, followed by toasts from loved ones.', icon: 'dinner' },
        { time: '19:00', title: 'First Dance', description: 'The couple’s first dance as a married pair.', icon: 'dancing' },
        { time: '21:30', title: 'Send-off', description: 'A sparkling send-off to close the celebration.', icon: 'sendoff' },
      ],
    },
  ] as ScheduleDay[],
  venues: [
    {
      category: 'intro',
      name: 'Intare Conference Arena — Pavilion',
      address: 'KG 11 Ave, Nyarugunge, Kigali, Rwanda',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Intare+Conference+Arena+Kigali',
    },
    {
      category: 'church',
      name: 'Sainte Famille Church',
      address: 'KN 4 Ave, Kigali, Rwanda',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sainte+Famille+Church+Kigali',
    },
    {
      category: 'reception',
      name: 'Intare Conference Arena — Pavilion',
      address: 'KG 11 Ave, Nyarugunge, Kigali, Rwanda',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Intare+Conference+Arena+Kigali',
    },
  ] as Venue[],
  audio: {
    src: 'https://kvctrtcmhdhlzbtberny.supabase.co/storage/v1/object/public/Music/bien._chikwere_official_audio_mp3_7518_5782.mp3',
  },
} as const;
