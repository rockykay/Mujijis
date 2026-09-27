import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    // 'metadata' lets the browser fetch headers so it knows the file exists,
    // without pre-downloading the whole file.
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onReady = () => setIsReady(true);
    const onPlay  = () => setIsPlaying(true);
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

  /**
   * iOS Safari CRITICAL: play() must be called synchronously inside
   * a user-gesture handler — no awaits before it or iOS blocks it.
   * We call play() immediately and handle the returned Promise separately.
   */
  const tryPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const promise = audio.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Autoplay blocked (e.g. no gesture yet) or network error — ignore.
        setIsPlaying(false);
      });
    }
  }, []);

  const play   = useCallback(() => tryPlay(), [tryPlay]);
  const pause  = useCallback(() => { audioRef.current?.pause(); }, []);
  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) tryPlay();
    else audio.pause();
  }, [tryPlay]);

  return { isPlaying, isReady, play, pause, toggle } as const;
}
