import type { CSSProperties } from 'react';

type CornerProps = {
  className?: string;
  flip?: boolean;
  style?: CSSProperties;
};

/** Fine-line botanical branch for section corners. */
export function BotanicalCorner({ className = '', flip = false, style }: CornerProps) {
  return (
    <svg
      viewBox="0 0 180 180"
      aria-hidden="true"
      className={`pointer-events-none ${flip ? '-scale-x-100' : ''} ${className}`}
      style={style}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 178 C 30 140, 44 110, 52 78" />
        <path d="M52 78 C 58 60, 64 46, 76 30" />
        <path d="M44 116 q -14 -2 -24 -10" />
        <path d="M48 100 q -16 2 -30 -4" />
        <path d="M50 86 q -14 -8 -22 -20" />
        <path d="M54 70 q 10 -16 24 -20" />
        <path d="M60 54 q 14 -10 30 -10" />
        <path d="M70 40 q 16 -4 30 -12" />
        <ellipse cx="18" cy="108" rx="6.5" ry="3" transform="rotate(-40 18 108)" />
        <ellipse cx="22" cy="96" rx="6.5" ry="3" transform="rotate(-25 22 96)" />
        <ellipse cx="28" cy="74" rx="6.5" ry="3" transform="rotate(-15 28 74)" />
        <ellipse cx="62" cy="58" rx="6.5" ry="3" transform="rotate(35 62 58)" />
        <ellipse cx="74" cy="44" rx="6.5" ry="3" transform="rotate(50 74 44)" />
        <ellipse cx="92" cy="32" rx="6.5" ry="3" transform="rotate(60 92 32)" />
        <circle cx="104" cy="22" r="3.4" />
        <circle cx="36" cy="120" r="2.6" />
      </g>
    </svg>
  );
}

/** Symmetrical floral divider with a small center bloom. */
export function FloralDivider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 48" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M120 24 H 200" />
        <path d="M120 24 H 40" />
        <path d="M200 24 q 14 -10 24 -16" />
        <path d="M40 24 q -14 -10 -24 -16" />
        <ellipse cx="208" cy="16" rx="4.5" ry="2.2" transform="rotate(35 208 16)" />
        <ellipse cx="48" cy="16" rx="4.5" ry="2.2" transform="rotate(145 48 16)" />
        <circle cx="222" cy="6" r="2.4" />
        <circle cx="18" cy="6" r="2.4" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <circle cx="120" cy="24" r="5" />
        <path d="M120 16 v -6" />
        <path d="M120 32 v 6" />
        <path d="M112 24 h -6" />
        <path d="M128 24 h 6" />
        <ellipse cx="113" cy="17" rx="3" ry="1.4" transform="rotate(-45 113 17)" />
        <ellipse cx="127" cy="17" rx="3" ry="1.4" transform="rotate(45 127 17)" />
        <ellipse cx="113" cy="31" rx="3" ry="1.4" transform="rotate(45 113 31)" />
        <ellipse cx="127" cy="31" rx="3" ry="1.4" transform="rotate(-45 127 31)" />
      </g>
    </svg>
  );
}

/** Small bird perched illustration. */
export function BirdIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 58 C 36 40, 56 32, 76 36 C 84 38, 92 44, 96 52" />
        <path d="M96 52 q 10 -2 18 -8" />
        <path d="M96 52 q 8 4 14 12" />
        <circle cx="44" cy="44" r="1.6" fill="currentColor" />
        <path d="M40 44 q -8 -2 -12 -8" />
        <path d="M48 52 q -10 8 -18 6" />
        <path d="M60 46 q 12 -6 22 -2" />
        <path d="M30 60 q 8 -2 14 2" />
        <path d="M18 60 c -6 2 -10 8 -6 14" />
      </g>
    </svg>
  );
}

/** Decorative section ornament - small symmetrical flourish. */
export function SectionOrnament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M60 12 H 96" />
        <path d="M60 12 H 24" />
        <circle cx="60" cy="12" r="2.6" />
        <circle cx="100" cy="12" r="1.6" />
        <circle cx="20" cy="12" r="1.6" />
        <path d="M60 6 v -3" />
        <path d="M60 18 v 3" />
      </g>
    </svg>
  );
}

/** Gold wax-seal style circular element with initials. */
export function WaxSeal({
  initials,
  size = 132,
  className = '',
}: {
  initials: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative grid place-items-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 32% 28%, #cda256, #b08a43 55%, #8a6a2f 100%)',
        boxShadow:
          'inset 0 2px 6px rgba(255,255,255,0.25), inset 0 -8px 14px rgba(60,40,10,0.45), 0 10px 24px rgba(60,40,10,0.22)',
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[6%] rounded-full border border-[#f3e2b6]/40"
        style={{ boxShadow: 'inset 0 0 12px rgba(60,40,10,0.3)' }}
      />
      <span
        className="relative z-10 max-w-[88%] px-1 text-center font-display text-[#fbf2d8] leading-none"
        style={{ fontSize: initials.length > 4 ? size * 0.16 : size * 0.24, letterSpacing: '0.04em' }}
      >
        {initials}
      </span>
    </div>
  );
}
