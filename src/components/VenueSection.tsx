import { useState, useEffect } from 'react';
import { useWeddingData } from '@/hooks/useWeddingData';
import { type Venue } from '@/data/wedding';
import { SectionOrnament, BotanicalCorner } from '@/components/Decorations';
import { MapPin, ChevronRight, Compass } from 'lucide-react';

// Tabs computed dynamically from venues

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="rounded-2xl border border-line bg-paper/90 p-7 text-center shadow-[0_18px_40px_-28px_rgba(81,72,63,0.5)] sm:p-9">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-line text-muted-brown">
        <MapPin size={18} strokeWidth={1.3} />
      </div>
      <h3 className="mt-5 font-display text-2xl text-dark-brown">{venue.name}</h3>
      <p className="mt-2 font-body text-sm font-light leading-relaxed text-muted-brown">
        {venue.address}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-5 py-2.5 font-body text-xs uppercase tracking-[0.18em] text-dark-brown transition-colors hover:bg-gold/20"
        >
          <Compass size={14} strokeWidth={1.5} />
          Get directions
        </a>
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${venue.name} in maps`}
          className="inline-flex items-center justify-center rounded-full border border-line p-2.5 text-warm-gray transition-colors hover:text-muted-brown"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
}

export function VenueSection() {
  const { venues } = useWeddingData();
  const tabs = venues.map(v => ({ id: v.category, label: v.category.charAt(0).toUpperCase() + v.category.slice(1) }));
  
  const [active, setActive] = useState<string>('');
  
  useEffect(() => {
    if (!active && tabs.length > 0) {
      setActive(tabs[0].id);
    }
  }, [tabs, active]);

  const venue = venues.find((v) => v.category === active) ?? venues[0];

  if (!venue) return null;

  return (
    <section id="venues" className="paper-grain relative bg-ivory px-6 py-24">
      <BotanicalCorner className="absolute left-0 top-8 w-32 text-muted-brown/30 sm:w-44" />
      <BotanicalCorner className="absolute bottom-8 right-0 w-32 text-muted-brown/30 sm:w-44" flip />

      <div className="mx-auto max-w-invite text-center">
        <p className="reveal font-body text-[0.62rem] uppercase tracking-[0.34em] text-warm-gray">
          Where to find us
        </p>
        <h2 className="reveal mt-4 font-display text-4xl text-dark-brown sm:text-5xl">Venues</h2>
        <p className="reveal mt-3 font-script text-2xl text-muted-brown">What we have planned for you</p>
        <div className="reveal mt-6 flex justify-center">
          <SectionOrnament />
        </div>

        <div
          role="tablist"
          aria-label="Wedding venues"
          className="reveal mt-10 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(t.id)}
                className={`shrink-0 rounded-full border px-5 py-2.5 font-body text-xs tracking-wide transition-colors duration-300 sm:px-6 sm:text-sm ${
                  selected
                    ? 'border-gold/60 bg-gold/15 text-dark-brown'
                    : 'border-line bg-transparent text-warm-gray hover:border-gold/40 hover:text-muted-brown'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="reveal mt-10">
          <VenueCard venue={venue} />
        </div>
      </div>
    </section>
  );
}
