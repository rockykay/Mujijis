import { useEffect } from 'react';
import { useWeddingData } from '@/hooks/useWeddingData';
import { useAudio } from '@/hooks/useAudio';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioControl() {
  const { config } = useWeddingData();
  const { isPlaying, toggle, play } = useAudio(config?.audio_src || 'https://kvctrtcmhdhlzbtberny.supabase.co/storage/v1/object/public/Music/bien._chikwere_official_audio_mp3_7518_5782.mp3');

  // Respect autoplay restrictions: try once after the first user interaction.
  useEffect(() => {
    if (isPlaying) return;
    const onFirstInteraction = () => {
      void play();
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
      style={{
        position: 'fixed',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)',
        right: 'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
        zIndex: 50,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(45,38,32,0.78)',
        color: 'rgba(245,240,231,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 28px -10px rgba(0,0,0,0.55)',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      {isPlaying ? <Volume2 size={18} strokeWidth={1.5} /> : <VolumeX size={18} strokeWidth={1.5} />}
      {isPlaying && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            borderRadius: '50%',
            background: 'rgba(176,138,67,0.2)',
            animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
          }}
        />
      )}
    </button>
  );
}
