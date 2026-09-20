import { useEffect, useState } from 'react';
import { InvitationCover } from '@/components/InvitationCover';
import { WeddingIntro } from '@/components/WeddingIntro';
import { ScheduleSection } from '@/components/ScheduleSection';
import { VenueSection } from '@/components/VenueSection';
import { GallerySection } from '@/components/GallerySection';
import { RSVPSection } from '@/components/RSVPSection';
import { AudioControl } from '@/components/AudioControl';
import { Footer } from '@/components/Footer';

export default function App() {
  const [opened, setOpened] = useState(false);

  // Prevent any scrolling until the seal is opened.
  useEffect(() => {
    if (!opened) {
      window.scrollTo(0, 0);

      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      const prevBodyHeight = document.body.style.height;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';

      const preventDefaultTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };

      const preventDefaultWheel = (e: WheelEvent) => {
        e.preventDefault();
      };

      const preventScrollKeys = (e: KeyboardEvent) => {
        const scrollKeys = ['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
        if (scrollKeys.includes(e.code)) {
          const target = e.target as HTMLElement | null;
          if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
            return;
          }
          e.preventDefault();
        }
      };

      window.addEventListener('touchmove', preventDefaultTouchMove, { passive: false });
      window.addEventListener('wheel', preventDefaultWheel, { passive: false });
      window.addEventListener('keydown', preventScrollKeys, { passive: false });

      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
        document.body.style.height = prevBodyHeight;
        window.removeEventListener('touchmove', preventDefaultTouchMove);
        window.removeEventListener('wheel', preventDefaultWheel);
        window.removeEventListener('keydown', preventScrollKeys);
      };
    }
  }, [opened]);

  // Activate reveal-on-scroll for every .reveal element once opened.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [opened]);

  return (
    <div
      className={`relative min-h-screen bg-ivory ${
        !opened ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : ''
      }`}
    >
      <main className="mx-auto w-full max-w-3xl">
        <InvitationCover
          opened={opened}
          onOpen={() => setOpened(true)}
          onClose={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setOpened(false);
          }}
        />
        <WeddingIntro />
        <ScheduleSection />
        <VenueSection />
        <GallerySection />
        <RSVPSection />
        <Footer />
      </main>
      <AudioControl />
    </div>
  );
}
