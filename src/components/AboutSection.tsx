import React from 'react';
import { Edit3 } from 'lucide-react';
import { AboutConfig } from '../types/store';
import { MediaSlot } from './MediaSlot';

interface AboutSectionProps {
  about: AboutConfig;
  aboutImageUrl?: string;
  isAdminMode: boolean;
  onUploadAboutImage: (file: File) => void | Promise<void>;
  onRemoveAboutImage: () => void;
  onOpenAboutEditor: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  about,
  aboutImageUrl,
  isAdminMode,
  onUploadAboutImage,
  onRemoveAboutImage,
  onOpenAboutEditor,
}) => {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left: Portrait Upload Slot */}
        <div className="lg:col-span-5">
          <div className="h-full min-h-[420px] w-full aspect-[3/4] lg:aspect-auto lg:min-h-[540px]">
            <MediaSlot
              imageUrl={aboutImageUrl}
              alt="Medra Collection Atelier Portrait"
              slotTitle="Atelier & Brand Portrait"
              dimensionHint="1200 × 1600 px · 3:4 Portrait"
              isAdminMode={isAdminMode}
              onUploadFile={onUploadAboutImage}
              onRemoveImage={onRemoveAboutImage}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Right: Editable Brand Story */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#70675D]">
              {about.kicker}
            </p>
            {isAdminMode && (
              <button
                type="button"
                onClick={onOpenAboutEditor}
                className="inline-flex items-center gap-1.5 border border-[#1A1A1A] px-3.5 py-2 text-xs font-medium tracking-wider uppercase text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
              >
                <Edit3 className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Edit Story</span>
              </button>
            )}
          </div>

          <h2 className="mt-3 font-serif text-3xl font-medium leading-[1.12] tracking-tight text-[#1A1A1A] text-balance sm:text-5xl">
            {about.headline}
          </h2>

          <div className="mt-6 space-y-5 text-base leading-[1.7] text-[#3E3933] max-w-2xl">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 border-t border-[#E4DDD4] pt-6">
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#8A6B3F]">
              {about.atelierNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
