import { useEffect } from 'react';
import { wedding } from '@/data/wedding';
import { useAudio } from '@/hooks/useAudio';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioControl() {
  const { isPlaying, toggle, play } = useAudio(wedding.audio.src);

  // Respect autoplay restrictions: try once after the first user interaction.
  useEffect(() => {
    if (isPlaying) return;
    const onFirstInteraction = () => {
      void play();
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
    window.addEventListener('pointerdown', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
  }, [isPlaying, play]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Mute wedding music' : 'Play wedding music'}
      className="fixed z-50 grid h-12 w-12 place-items-center rounded-full border border-line bg-paper/90 text-muted-brown shadow-[0_8px_24px_-12px_rgba(81,72,63,0.5)] backdrop-blur transition-all hover:text-dark-brown"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)', right: 'calc(env(safe-area-inset-right, 0px) + 1.25rem)' }}
    >
      {isPlaying ? <Volume2 size={18} strokeWidth={1.5} /> : <VolumeX size={18} strokeWidth={1.5} />}
      {isPlaying && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold/20" />
      )}
    </button>
  );
}
