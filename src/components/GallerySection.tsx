import { useWeddingData } from '@/hooks/useWeddingData';
import { SectionOrnament, BirdIllustration } from '@/components/Decorations';
import { VerticalImageStack } from '@/components/ui/vertical-image-stack';

export function GallerySection() {
  const { fallbackGallery } = useWeddingData();
  
  // Adapt our images to the format expected by VerticalImageStack
  // It needs an `id` field. We can use the index as ID.
  const stackImages = fallbackGallery.map((img, index) => ({
    ...img,
    id: index
  }));

  return (
    <section id="gallery" className="paper-grain relative bg-paper px-6 py-24">
      <BirdIllustration className="absolute left-[12%] top-10 w-12 text-muted-brown/35" />

      <div className="mx-auto max-w-invite text-center mb-12">
        <p className="reveal font-body text-[0.62rem] uppercase tracking-[0.34em] text-warm-gray">
          A look back
        </p>
        <h2 className="reveal mt-4 font-display text-4xl text-dark-brown sm:text-5xl">Photo Gallery</h2>
        <p className="reveal mt-3 font-script text-2xl text-muted-brown">Moments we treasure</p>
        <div className="reveal mt-6 flex justify-center">
          <SectionOrnament />
        </div>
      </div>

      <div className="reveal">
        <VerticalImageStack images={stackImages} />
      </div>
    </section>
  );
}
