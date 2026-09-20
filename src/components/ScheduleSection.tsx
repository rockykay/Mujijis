import { useState } from 'react';
import { wedding, type ScheduleEvent } from '@/data/wedding';
import { SectionOrnament, BotanicalCorner } from '@/components/Decorations';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import {
  Users,
  Drum,
  Heart,
  MessageCircle,
  Sparkles,
  Gift,
  Wine,
  UtensilsCrossed,
  Music,
  PartyPopper,
} from 'lucide-react';

const iconMap = {
  arrival: Users,
  drums: Drum,
  prayer: Heart,
  welcome: MessageCircle,
  ceremony: Sparkles,
  ring: Gift,
  toast: Wine,
  dinner: UtensilsCrossed,
  dancing: Music,
  sendoff: PartyPopper,
} as const;

function TimelineItem({ event, index }: { event: ScheduleEvent; index: number }) {
  const Icon = iconMap[event.icon];
  const isLast = false;
  return (
    <div className="reveal relative flex gap-5 pb-10 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-muted-brown">
          <Icon size={16} strokeWidth={1.3} />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-line" />}
      </div>
      <div className="flex-1 pt-1.5">
        <span className="font-body text-[0.65rem] uppercase tracking-[0.26em] text-gold">
          {event.time}
        </span>
        <h4 className="mt-1 font-display text-xl text-dark-brown">{event.title}</h4>
        <p className="mt-1.5 max-w-sm font-body text-sm font-light leading-relaxed text-muted-brown">
          {event.description}
        </p>
        <span className="sr-only">Event {index + 1}</span>
      </div>
    </div>
  );
}

export function ScheduleSection() {
  const [activeId, setActiveId] = useState(wedding.schedules[0].id);
  const active = wedding.schedules.find((s) => s.id === activeId) ?? wedding.schedules[0];

  return (
    <section
      id="schedule"
      className="paper-grain relative bg-paper px-6 py-24"
    >
      <BotanicalCorner className="absolute right-0 top-6 w-32 text-muted-brown/30 sm:w-44" flip />
      <BotanicalCorner className="absolute bottom-6 left-0 w-32 text-muted-brown/30 sm:w-44" style={{ transform: 'rotate(-90deg)' }} />

      <div className="mx-auto max-w-invite text-center">
        <p className="reveal font-body text-[0.62rem] uppercase tracking-[0.34em] text-warm-gray">
          The order of the day
        </p>
        <h2 className="reveal mt-4 font-display text-4xl text-dark-brown sm:text-5xl">Schedule</h2>
        <p className="reveal mt-3 font-script text-2xl text-muted-brown">What we have planned for you</p>
        <div className="reveal mt-6 flex justify-center">
          <SectionOrnament />
        </div>

        <div
          role="tablist"
          aria-label="Wedding program schedule"
          className="reveal mt-10 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {wedding.schedules.map((day) => {
            const selected = day.id === activeId;
            return (
              <button
                key={day.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(day.id)}
                className={`shrink-0 rounded-full border px-5 py-2.5 font-body text-xs tracking-wide transition-colors duration-300 sm:px-6 sm:text-sm ${
                  selected
                    ? 'border-gold/60 bg-gold/15 text-dark-brown'
                    : 'border-line bg-transparent text-warm-gray hover:border-gold/40 hover:text-muted-brown'
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>

        <p className="reveal mt-6 font-body text-xs font-light italic text-warm-gray">
          {active.subtitle}
        </p>

        <div className="reveal mt-10 text-left">
          {active.events.map((event, i) => (
            <TimelineItem key={`${active.id}-${event.time}-${event.title}`} event={event} index={i} />
          ))}
        </div>

        <div className="reveal mt-12">
          <ScrollIndicator targetId="rsvp" label="Scroll to RSVP" />
        </div>
      </div>
    </section>
  );
}
