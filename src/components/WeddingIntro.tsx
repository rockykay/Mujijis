import { useEffect, useState } from 'react';
import { useWeddingData } from '@/hooks/useWeddingData';
import { FloralDivider } from '@/components/Decorations';

export function Countdown({ target }: { target: string }) {
  const targetTime = new Date(target).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000 * 60);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, targetTime - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  const units = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
  ];

  return (
    <div className="flex items-stretch justify-center gap-6">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-6">
          <div className="text-center">
            <div className="font-display text-4xl text-dark-brown tabular-nums sm:text-5xl">
              {String(u.value).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-warm-gray">
              {u.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="font-display text-3xl text-gold/60">·</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function WeddingIntro() {
  const { closestEvent, primaryDateLong } = useWeddingData();

  if (!closestEvent) return null;

  return (
    <section
      id="intro"
      className="paper-grain relative flex min-h-screen flex-col items-center justify-center bg-ivory px-6 py-24 text-center"
    >
      <p className="reveal font-body text-[0.65rem] uppercase tracking-[0.34em] text-warm-gray">
        {primaryDateLong}
      </p>
      <h2 className="reveal mt-8 font-display text-4xl leading-tight text-dark-brown sm:text-5xl">
        The Day Has Arrived!
      </h2>
      <p className="reveal mt-5 font-script text-3xl text-muted-brown sm:text-4xl">
        Days until we say I DO
      </p>

      <div className="reveal mt-12 flex flex-col items-center">
        <span className="mb-4 inline-block rounded-full bg-gold/15 px-4 py-1.5 font-body text-xs uppercase tracking-widest text-dark-brown">
          Next Event: {closestEvent.title}
        </span>
        <Countdown target={closestEvent.countdown_target} />
      </div>

      <div className="reveal mt-16 max-w-xs">
        <FloralDivider />
      </div>

      <p className="reveal mt-10 max-w-sm font-body text-sm font-light leading-relaxed text-muted-brown">
        We invite you to witness the beginning of our forever <br />
        a day of love,
        family, and celebration.
      </p>
    </section>
  );
}
