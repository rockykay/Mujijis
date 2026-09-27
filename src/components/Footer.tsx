import { useWeddingData } from '@/hooks/useWeddingData';
import { FloralDivider } from '@/components/Decorations';

export function Footer() {
  const { config, primaryDateShort } = useWeddingData();
  
  if (!config) return null;

  return (
    <footer className="paper-grain relative bg-paper px-6 py-16 text-center">
      <div className="mx-auto max-w-invite">
        <FloralDivider className="mx-auto w-56 text-muted-brown/70" />
        <p className="mt-8 font-script text-3xl text-muted-brown">{config.couple_script}</p>
        <p className="mt-3 font-body text-xs uppercase tracking-[0.26em] text-warm-gray">
          {primaryDateShort}
        </p>
        <p className="mt-6 font-body text-[0.65rem] uppercase tracking-[0.26em] text-warm-gray/70">
          {config.hashtag}
        </p>
      </div>
    </footer>
  );
}
