import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    // Use 'metadata' so the browser fetches just enough to know the duration,
    // but still allows play() to work on first user interaction without a
    // "no data buffered" rejection on deployed HTTPS origins.
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onReady = () => setIsReady(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onReady);
    audio.addEventListener('canplay', onReady);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onReady);
      audio.removeEventListener('canplay', onReady);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [src]);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      // If not enough data yet, wait for canplay before attempting.
      if (audio.readyState < 3 /* HAVE_FUTURE_DATA */) {
        await new Promise<void>((resolve, reject) => {
          const onCan = () => { cleanup(); resolve(); };
          const onErr = () => { cleanup(); reject(); };
          const cleanup = () => {
            audio.removeEventListener('canplay', onCan);
            audio.removeEventListener('error', onErr);
          };
          audio.addEventListener('canplay', onCan, { once: true });
          audio.addEventListener('error', onErr, { once: true });
          // Kick off load if it hasn't started
          if (audio.networkState === HTMLMediaElement.NETWORK_EMPTY) {
            audio.load();
          }
        });
      }
      await audio.play();
    } catch {
      // Autoplay blocked or network error — leave isPlaying as false
      setIsPlaying(false);
    }
  }, []);

  const play = useCallback(() => void tryPlay(), [tryPlay]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void tryPlay();
    else audio.pause();
  }, [tryPlay]);

  return { isPlaying, isReady, play, pause, toggle } as const;
}
