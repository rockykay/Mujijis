import { wedding } from '@/data/wedding';

export function HeroSection() {
  return (
    <section id="hero" className="relative bg-ivory">
      <div className="mx-auto flex max-w-3xl flex-col">
        <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]">
          <img
            src={wedding.heroImage}
            alt="Amani and Marcus embracing on their wedding day"
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-ivory/30" />
        </div>
        <div className="-mt-10 flex justify-center">
          <p className="bg-ivory px-6 font-script text-3xl text-muted-brown">
            {wedding.couple.script}
          </p>
        </div>
      </div>
    </section>
  );
}
