import { useRef, useState } from 'react';
import { useWeddingData } from '@/hooks/useWeddingData';
import { SectionOrnament, BirdIllustration } from '@/components/Decorations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function GallerySection() {
  const { fallbackGallery } = useWeddingData();
  const images = fallbackGallery;
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + images.length) % images.length);
  };

  // Swipe-to-navigate: only trigger on predominantly horizontal swipes
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - (touchStartY.current ?? 0);
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <section id="gallery" className="paper-grain relative bg-paper px-6 py-24">
      <BirdIllustration className="absolute left-[12%] top-10 w-12 text-muted-brown/35" />

      <div className="mx-auto max-w-invite text-center">
        <p className="reveal font-body text-[0.62rem] uppercase tracking-[0.34em] text-warm-gray">
          A look back
        </p>
        <h2 className="reveal mt-4 font-display text-4xl text-dark-brown sm:text-5xl">Photo Gallery</h2>
        <p className="reveal mt-3 font-script text-2xl text-muted-brown">Moments we treasure</p>
        <div className="reveal mt-6 flex justify-center">
          <SectionOrnament />
        </div>

        <div
          className="reveal relative mt-10 overflow-hidden rounded-2xl border border-line bg-ivory shadow-[0_22px_50px_-30px_rgba(81,72,63,0.55)]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="aspect-[3/4] w-full sm:aspect-[4/5]">
            <img
              key={index}
              src={images[index].src}
              alt={images[index].alt}
              className="h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper/80 text-muted-brown backdrop-blur transition-colors hover:bg-paper"
          >
            <ChevronLeft size={18} strokeWidth={1.4} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-paper/80 text-muted-brown backdrop-blur transition-colors hover:bg-paper"
          >
            <ChevronRight size={18} strokeWidth={1.4} />
          </button>
        </div>

        <p className="reveal mt-4 font-body text-[0.58rem] uppercase tracking-[0.22em] text-warm-gray/70 sm:hidden">
          Swipe to browse
        </p>

        <div className="reveal mt-5 flex justify-center gap-2" role="tablist" aria-label="Gallery pagination">
          {images.map((img, i) => (
            <button
              key={img.src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-gold/70' : 'w-1.5 bg-line hover:bg-warm-gray/50'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
