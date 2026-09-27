import { useRef, useState, useCallback } from 'react';
import { useWeddingData } from '@/hooks/useWeddingData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   Floral vine corner SVG
───────────────────────────────────────────── */
function FloralVineCorner({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 220 200"
      aria-hidden="true"
      className="pointer-events-none absolute top-0 w-36 text-muted-brown/20 sm:w-44"
      style={{
        left: flip ? undefined : 0,
        right: flip ? 0 : undefined,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 196 C 20 160, 36 124, 52 92 C 64 68, 80 44, 104 20" />
        <path d="M30 150 Q 6 140 2 120" />
        <path d="M42 118 Q 18 112 10 92" />
        <path d="M54 88 Q 76 70 90 50" />
        <path d="M68 64 Q 90 48 108 36" />
        <ellipse cx="16" cy="132" rx="8" ry="3.5" transform="rotate(-50 16 132)" />
        <ellipse cx="24" cy="118" rx="7.5" ry="3" transform="rotate(-35 24 118)" />
        <ellipse cx="6" cy="108" rx="7" ry="3" transform="rotate(-20 6 108)" />
        <ellipse cx="82" cy="62" rx="7.5" ry="3" transform="rotate(40 82 62)" />
        <ellipse cx="96" cy="48" rx="7.5" ry="3" transform="rotate(50 96 48)" />
        <ellipse cx="112" cy="32" rx="7" ry="3" transform="rotate(60 112 32)" />
        <circle cx="2" cy="118" r="2.8" />
        <circle cx="118" cy="20" r="3.2" />
        <circle cx="36" cy="164" r="2.2" />
        <circle cx="70" cy="76" r="2" />
        <circle cx="104" cy="20" r="5" />
        <path d="M104 12 v -5" />
        <path d="M104 28 v 5" />
        <path d="M96 20 h -5" />
        <path d="M112 20 h 5" />
        <ellipse cx="97" cy="13" rx="3" ry="1.5" transform="rotate(-45 97 13)" />
        <ellipse cx="111" cy="13" rx="3" ry="1.5" transform="rotate(45 111 13)" />
        <ellipse cx="97" cy="27" rx="3" ry="1.5" transform="rotate(45 97 27)" />
        <ellipse cx="111" cy="27" rx="3" ry="1.5" transform="rotate(-45 111 27)" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Animated scroll mouse icon
───────────────────────────────────────────── */
function ScrollMouseIcon() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <p
        style={{
          fontFamily: '"Jost", ui-sans-serif, sans-serif',
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.28em',
          color: 'rgba(139,129,119,0.7)',
        }}
      >
        Scroll to RSVP
      </p>
      <div
        aria-hidden="true"
        style={{
          width: '20px',
          height: '34px',
          borderRadius: '10px',
          border: '1.5px solid rgba(139,129,119,0.4)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '5px',
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'rgba(139,129,119,0.6)',
            animation: 'gallery-mouse-dot 1.8s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animated flying bird
───────────────────────────────────────────── */
function FlyingBird() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        bottom: '48px',
        left: 0,
        pointerEvents: 'none',
        animation: 'gallery-bird-fly 9s ease-in-out infinite',
        animationDelay: '2.5s',
      }}
    >
      <svg
        viewBox="0 0 80 40"
        style={{ width: '40px', color: 'rgba(118,105,93,0.4)' }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 24 C 22 14, 38 12, 54 18 C 62 20, 68 26, 72 32" />
        <path d="M72 32 Q 78 28 82 24" />
        <path d="M72 32 Q 76 36 80 42" />
        <circle cx="26" cy="18" r="1.2" fill="currentColor" />
        <path d="M22 18 Q 14 16 10 12" />
        <path d="M36 16 Q 48 8 60 14" />
        <path d="M28 24 Q 38 32 50 28" />
      </svg>
    </div>
  );
}



/* ─────────────────────────────────────────────
   Main Gallery Section
───────────────────────────────────────────── */
export function GallerySection() {
  const { fallbackGallery } = useWeddingData();
  const images = fallbackGallery;
  const count = images.length;

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const hasDragged = useRef(false);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (transitioning) return;
      setDirection(dir === 1 ? 'right' : 'left');
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((c) => (c + dir + count) % count);
        setTransitioning(false);
      }, 480);
    },
    [transitioning, count]
  );

  const goTo = useCallback(
    (idx: number) => {
      if (transitioning || idx === current) return;
      setDirection(idx > current ? 'right' : 'left');
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(idx);
        setTransitioning(false);
      }, 480);
    },
    [transitioning, current]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    hasDragged.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = Math.abs(e.clientX - dragStartX.current);
    const dy = Math.abs(e.clientY - (dragStartY.current ?? 0));
    if (dx > 8 || dy > 8) hasDragged.current = true;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - (dragStartY.current ?? 0);
    dragStartX.current = null;
    dragStartY.current = null;
    if (!hasDragged.current) return;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    navigate(dx < 0 ? 1 : -1);
  };

  const prevIdx = (current - 1 + count) % count;
  const nextIdx = (current + 1) % count;

  // Alternate grayscale treatment: even = color, odd = grayscale
  const isGray = (idx: number) => idx % 2 === 1;

  return (
    <>
      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes gallery-mouse-dot {
          0%   { transform: translateY(0);    opacity: 1;   }
          55%  { transform: translateY(14px); opacity: 0.4; }
          100% { transform: translateY(0);    opacity: 1;   }
        }
        @keyframes gallery-bird-fly {
          0%   { transform: translateX(-60px) translateY(0px);    opacity: 0; }
          8%   { opacity: 1; }
          45%  { transform: translateX(45vw)  translateY(-22px);  opacity: 1; }
          72%  { transform: translateX(92vw)  translateY(-8px);   opacity: 0.5; }
          90%  { opacity: 0; }
          100% { transform: translateX(108vw) translateY(0px);    opacity: 0; }
        }
        @keyframes gallery-slide-in-right {
          from { transform: translateX(20%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes gallery-slide-in-left {
          from { transform: translateX(-20%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .gal-enter-right { animation: gallery-slide-in-right 0.48s cubic-bezier(0.4,0,0.2,1) both; }
        .gal-enter-left  { animation: gallery-slide-in-left  0.48s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <section
        id="gallery"
        className="relative overflow-hidden py-20"
        style={{ background: '#F0EAE0' }}
      >
        {/* Botanical corner vines */}
        <FloralVineCorner />
        <FloralVineCorner flip />

        {/* ── Section header ── */}
        <div className="relative z-10 mx-auto max-w-invite px-6 text-center">
          <h2
            className="reveal italic text-dark-brown"
            style={{
              fontFamily: '"Cormorant Garamond", "Cormorant", Georgia, serif',
              fontSize: 'clamp(2.4rem, 9vw, 3.5rem)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '0.01em',
            }}
          >
            Photo Gallery
          </h2>
          <p
            className="reveal mt-2"
            style={{
              fontFamily: '"Jost", ui-sans-serif, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 300,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(118,105,93,0.65)',
            }}
          >
            Moments we treasure
          </p>

          {/* Decorative rule */}
          <div className="reveal mt-5 flex items-center justify-center gap-3 px-8">
            <span style={{ flex: 1, height: '1px', background: 'rgba(118,105,93,0.2)' }} />
            <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, color: 'rgba(176,138,67,0.55)' }} fill="currentColor">
              <circle cx="12" cy="12" r="4" />
            </svg>
            <span style={{ flex: 1, height: '1px', background: 'rgba(118,105,93,0.2)' }} />
          </div>
        </div>

        {/* ── Center-peek carousel ── */}
        <div className="reveal relative mt-10">
          <div
            className="flex select-none items-stretch justify-center"
            style={{ gap: '10px', padding: '0 10px', touchAction: 'pan-y' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {/* Prev peek (partially visible, dimmed) */}
            <div
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: 'clamp(28px, 8vw, 58px)',
                overflow: 'hidden',
                borderRadius: '12px',
                opacity: 0.42,
                filter: 'brightness(0.68)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ aspectRatio: '3/4', width: '100%' }}>
                <img
                  src={images[prevIdx].src}
                  alt=""
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isGray(prevIdx) ? 'grayscale(1)' : 'none',
                    transition: 'filter 0.5s',
                  }}
                />
              </div>
            </div>

            {/* Active / center image */}
            <div
              style={{
                flexShrink: 0,
                width: 'clamp(260px, 80vw, 520px)',
                overflow: 'hidden',
                borderRadius: '18px',
                boxShadow: '0 24px 56px -18px rgba(81,72,63,0.5)',
                position: 'relative',
              }}
            >
              <div style={{ aspectRatio: '3/4', width: '100%', background: '#eee5d6' }}>
                <img
                  key={current}
                  src={images[current].src}
                  alt={images[current].alt}
                  draggable={false}
                  loading="lazy"
                  className={
                    transitioning
                      ? direction === 'right'
                        ? 'gal-enter-right'
                        : 'gal-enter-left'
                      : ''
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: isGray(current) ? 'grayscale(1)' : 'none',
                    transition: 'filter 0.5s',
                  }}
                />
              </div>

              {/* Left arrow */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Previous photo"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.25)',
                  background: 'rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: 'white',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                  transition: 'background 0.2s',
                }}
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>

              {/* Right arrow */}
              <button
                type="button"
                onClick={() => navigate(1)}
                aria-label="Next photo"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.25)',
                  background: 'rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: 'white',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                  transition: 'background 0.2s',
                }}
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Next peek (partially visible, dimmed) */}
            <div
              aria-hidden="true"
              style={{
                flexShrink: 0,
                width: 'clamp(28px, 8vw, 58px)',
                overflow: 'hidden',
                borderRadius: '12px',
                opacity: 0.42,
                filter: 'brightness(0.68)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ aspectRatio: '3/4', width: '100%' }}>
                <img
                  src={images[nextIdx].src}
                  alt=""
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isGray(nextIdx) ? 'grayscale(1)' : 'none',
                    transition: 'filter 0.5s',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Dot pagination ── */}
        <div
          className="reveal mt-6 flex justify-center gap-2.5"
          role="tablist"
          aria-label="Gallery pagination"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              role="tab"
              aria-selected={i === current}
              aria-label={`Photo ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                width: i === current ? '11px' : '8px',
                height: i === current ? '11px' : '8px',
                background: i === current ? 'rgba(81,72,63,0.72)' : 'rgba(118,105,93,0.3)',
                transform: i === current ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* ── Below carousel: scroll indicator + flying bird ── */}
        <div
          className="reveal relative mt-12 flex flex-col items-center gap-4"
          style={{ paddingBottom: '16px' }}
        >
          <ScrollMouseIcon />
          <FlyingBird />
        </div>
      </section>

    </>
  );
}
