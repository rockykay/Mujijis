import { useState } from 'react';
import { wedding } from '@/data/wedding';
import { BotanicalCorner, BirdIllustration, WaxSeal, FloralDivider } from '@/components/Decorations';

type InvitationCoverProps = {
  opened?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export function InvitationCover({
  opened: controlledOpened,
  onOpen,
  onClose,
}: InvitationCoverProps = {}) {
  const [uncontrolledOpened, setUncontrolledOpened] = useState(false);
  const isControlled = controlledOpened !== undefined;
  const opened = isControlled ? controlledOpened : uncontrolledOpened;

  const handleOpen = () => {
    if (!isControlled) setUncontrolledOpened(true);
    onOpen?.();
  };

  const handleClose = () => {
    if (!isControlled) setUncontrolledOpened(false);
    onClose?.();
  };

  return (
    <section
      id="cover"
      className="paper-grain relative flex h-[100dvh] min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-ivory px-4 text-center sm:px-6"
    >
      <BotanicalCorner
        className="absolute left-0 top-0 w-32 text-muted-brown/40 sm:w-52"
        style={{ transform: 'rotate(0deg)' }}
      />
      <BotanicalCorner
        className="absolute right-0 top-0 w-32 text-muted-brown/40 sm:w-52"
        flip
      />
      <BotanicalCorner
        className="absolute bottom-0 left-0 w-32 text-muted-brown/40 sm:w-52"
        style={{ transform: 'rotate(-90deg)' }}
      />
      <BotanicalCorner
        className="absolute bottom-0 right-0 w-32 text-muted-brown/40 sm:w-52"
        style={{ transform: 'rotate(90deg)' }}
        flip
      />

      <BirdIllustration className="absolute left-[12%] top-[14%] w-10 text-muted-brown/45 sm:left-[18%] sm:top-[20%] sm:w-12" />
      <BirdIllustration className="absolute right-[10%] bottom-[20%] w-8 -scale-x-100 text-muted-brown/45 sm:right-[16%] sm:bottom-[26%] sm:w-10" />

      <div
        className={`relative z-10 flex max-h-[calc(100dvh-5rem)] min-h-[min(560px,calc(100dvh-5rem))] w-full max-w-[30rem] flex-col items-center justify-center overflow-hidden px-6 py-8 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-[min(640px,calc(100dvh-4rem))] sm:py-12 ${
          opened ? 'rounded-[2rem] shadow-[0_28px_80px_-24px_rgba(40,34,28,0.7)]' : ''
        }`}
        style={
          opened
            ? {
                backgroundImage: `linear-gradient(rgba(24, 22, 20, 0.34), rgba(24, 22, 20, 0.55)), url(${wedding.cover.backgroundImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }
            : undefined
        }
      >
        <div
          className={`absolute inset-0 bg-[#201d1a]/10 transition-opacity duration-1000 ${opened ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center">
          <p
            className={`font-body text-[0.62rem] uppercase tracking-[0.4em] transition-all duration-700 ${
              opened ? 'text-paper/80' : 'text-warm-gray'
            }`}
          >
            {wedding.cover.eyebrow}
          </p>

          <h1
            className={`mt-6 font-script text-4xl transition-all duration-700 sm:mt-8 sm:text-6xl ${
              opened ? 'text-paper drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]' : 'text-muted-brown'
            }`}
          >
            {wedding.couple.script}
          </h1>

          <p
            className={`mt-3 font-body text-[0.62rem] uppercase tracking-[0.34em] transition-all duration-700 sm:mt-4 ${
              opened ? 'text-paper/80' : 'text-warm-gray'
            }`}
          >
            {wedding.cover.request}
          </p>

          <button
            type="button"
            onClick={handleOpen}
            disabled={opened}
            aria-label={opened ? 'Invitation opened' : wedding.cover.openLabel}
            className={`group relative my-6 rounded-full touch-manipulation transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-gold/70 sm:my-8 ${
              opened ? 'pointer-events-none scale-[5] opacity-0' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <WaxSeal initials={wedding.couple.initials} size={118} />
            <span className="absolute -bottom-7 left-1/2 w-max -translate-x-1/2 font-body text-[0.55rem] uppercase tracking-[0.24em] text-warm-gray opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {wedding.cover.openLabel}
            </span>
          </button>

          <p
            className={`font-script text-3xl transition-all delay-200 duration-700 sm:text-5xl ${
              opened ? 'text-paper drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]' : 'text-dark-brown'
            }`}
          >
            {wedding.cover.invitation}
          </p>

          <div className="mt-6 max-w-[12rem] sm:mt-8 sm:max-w-[14rem]">
            <FloralDivider className={opened ? 'text-paper/75' : 'text-muted-brown/70'} />
          </div>

          <p
            className={`mt-6 font-body text-xs font-light tracking-[0.2em] transition-colors duration-700 sm:mt-7 ${
              opened ? 'text-paper/80' : 'text-warm-gray'
            }`}
          >
            {wedding.date.short}
          </p>

          <button
            type="button"
            onClick={handleClose}
            className={`mt-6 font-body text-[0.58rem] uppercase tracking-[0.26em] text-paper/75 underline-offset-4 transition-all duration-500 hover:text-paper hover:underline sm:mt-8 ${
              opened ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            Close invitation
          </button>
        </div>
      </div>

      {/* When unopened: prominent hint to tap the wax seal */}
      <button
        type="button"
        onClick={handleOpen}
        className={`absolute bottom-5 z-10 flex flex-col items-center gap-1.5 text-warm-gray transition-all duration-500 sm:bottom-7 ${
          opened ? 'pointer-events-none opacity-0 translate-y-3' : 'opacity-100 translate-y-0 hover:text-muted-brown'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Click the seal to open the invitation"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.32em]">Tap seal to open</span>
        <span className="text-xs text-gold/80 animate-bounce">❦</span>
      </button>

      {/* When opened: scroll indicator to explore wedding details */}
      <button
        type="button"
        onClick={() => {
          document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`absolute bottom-5 z-10 flex flex-col items-center gap-2 text-warm-gray transition-all duration-700 sm:bottom-7 ${
          opened
            ? 'opacity-100 translate-y-0 delay-500 hover:text-muted-brown'
            : 'pointer-events-none opacity-0 translate-y-3'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Scroll down to wedding details"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.32em] text-warm-gray">Scroll to explore</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-line bg-paper/60 p-1 backdrop-blur-sm">
          <span className="h-2 w-px animate-[scrollDot_1.8s_ease-in-out_infinite] rounded-full bg-warm-gray" />
        </span>
      </button>

      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(12px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
