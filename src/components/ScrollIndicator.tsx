import { MousePointerClick } from 'lucide-react';

export function ScrollIndicator({
  targetId,
  label = 'Scroll',
}: {
  targetId?: string;
  label?: string;
}) {
  const onClick = () => {
    if (!targetId) return;
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-3 text-warm-gray transition-colors hover:text-muted-brown"
      aria-label={targetId ? `${label} to ${targetId}` : label}
    >
      <span className="text-[0.6rem] uppercase tracking-[0.3em]">{label}</span>
      <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-line p-1.5">
        <span className="h-1.5 w-1.5 animate-[scrollPulse_2.2s_ease-in-out_infinite] rounded-full bg-warm-gray group-hover:bg-muted-brown" />
      </span>
      <MousePointerClick size={14} strokeWidth={1.4} className="opacity-60" />
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(10px); opacity: 1; }
        }
      `}</style>
    </button>
  );
}
