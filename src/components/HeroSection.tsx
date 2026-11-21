import React, { useRef, useState } from 'react';
import { ArrowRight, Camera, Edit3, Trash2, Upload } from 'lucide-react';
import { HeroConfig } from '../types/store';

interface HeroSectionProps {
  hero: HeroConfig;
  heroImageUrl?: string;
  isAdminMode: boolean;
  onUploadHeroImage: (file: File) => void | Promise<void>;
  onRemoveHeroImage: () => void;
  onOpenHeroEditor: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  hero,
  heroImageUrl,
  isAdminMode,
  onUploadHeroImage,
  onRemoveHeroImage,
  onOpenHeroEditor,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasImage = Boolean(heroImageUrl) && !imgError;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImgError(false);
      onUploadHeroImage(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isAdminMode) return;
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImgError(false);
      onUploadHeroImage(file);
    }
  };

  return (
    <section
      id="new-arrivals"
      onDragOver={(e) => {
        if (!isAdminMode) return;
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative w-full overflow-hidden border-b border-[#E4DDD4] ${
        hasImage ? 'bg-[#1A1A1A]' : 'bg-[#F2EDE7]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload hero banner image"
      />

      {/* Full-bleed uploaded hero photo with measured contrast scrim */}
      {hasImage ? (
        <div className="relative min-h-[540px] w-full sm:min-h-[620px] lg:min-h-[680px]">
          <img
            src={heroImageUrl}
            alt={hero.headline}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/85 via-[#1A1A1A]/40 to-[#1A1A1A]/15"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-[540px] max-w-7xl flex-col justify-end px-4 py-12 sm:min-h-[620px] sm:px-6 sm:py-16 lg:min-h-[680px] lg:px-8 lg:py-20">
            <div className="max-w-2xl text-[#FAF9F6]">
              <p className="mb-3 text-xs font-medium tracking-[0.18em] uppercase text-[#E6DFD6]">
                {hero.kicker}
              </p>
              <h1 className="font-serif text-[clamp(2.5rem,5vw,4.25rem)] font-medium leading-[1.06] tracking-tight text-balance">
                {hero.headline}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#EDE7DF] sm:text-lg">
                {hero.subtext}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2.5 bg-[#8A6B3F] px-7 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#FAF9F6] transition-colors duration-200 hover:bg-[#705530] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F6]"
                >
                  <span>{hero.ctaLabel}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Editorial Banner with Neutral Custom Image Upload Slot when no photo is uploaded */
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="mb-3 text-xs font-medium tracking-[0.18em] uppercase text-[#70675D]">
                {hero.kicker}
              </p>
              <h1 className="font-serif text-[clamp(2.5rem,4.5vw,4rem)] font-medium leading-[1.08] tracking-tight text-[#1A1A1A] text-balance">
                {hero.headline}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#4A453E] sm:text-lg">
                {hero.subtext}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#collections"
                  className="inline-flex items-center gap-2.5 bg-[#8A6B3F] px-7 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#FAF9F6] transition-colors duration-200 hover:bg-[#705530] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A6B3F]"
                >
                  <span>{hero.ctaLabel}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </a>
                {isAdminMode && (
                  <button
                    type="button"
                    onClick={onOpenHeroEditor}
                    className="inline-flex items-center gap-2 border border-[#1A1A1A] bg-transparent px-5 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
                  >
                    <Edit3 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    <span>Edit Hero Copy</span>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                onClick={() => {
                  if (isAdminMode) fileInputRef.current?.click();
                }}
                className={`flex h-full min-h-[320px] flex-col items-center justify-center border border-[#D8CFC4] bg-[#EAE3D9] p-8 text-center transition-colors sm:min-h-[400px] ${
                  isAdminMode
                    ? 'cursor-pointer hover:border-[#8A6B3F] hover:bg-[#E4DBD0]'
                    : ''
                }`}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#CFC5B7] bg-[#FAF9F6] text-[#6B6257]">
                  {isAdminMode ? (
                    <Upload className="h-6 w-6" strokeWidth={1.5} />
                  ) : (
                    <Camera className="h-6 w-6" strokeWidth={1.5} />
                  )}
                </div>
                <p className="font-serif text-xl font-medium text-[#1A1A1A]">
                  Editorial Hero Campaign Banner
                </p>
                <p className="mt-1.5 text-xs tracking-wide text-[#70675D] tabular-nums">
                  Recommended: 1600 × 900 px · 16:9 Landscape
                </p>
                {isAdminMode ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-5 inline-flex items-center gap-2 border border-[#1A1A1A] bg-[#FAF9F6] px-5 py-2.5 text-xs font-medium tracking-wider uppercase text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
                  >
                    <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
                    <span>Upload Hero Banner</span>
                  </button>
                ) : (
                  <p className="mt-3 max-w-xs text-xs leading-relaxed text-[#70675D]">
                    Enable Admin Edit Mode in the top bar to upload your campaign photography.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Admin Controls when hero image is present */}
      {isAdminMode && hasImage && (
        <div className="absolute right-4 top-4 z-20 flex flex-wrap items-center gap-2 sm:right-6 sm:top-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 border border-[#E4DDD4] bg-[#FAF9F6]/95 px-3.5 py-2 text-xs font-medium text-[#1A1A1A] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Replace Banner</span>
          </button>
          <button
            type="button"
            onClick={onOpenHeroEditor}
            className="inline-flex items-center gap-1.5 border border-[#E4DDD4] bg-[#FAF9F6]/95 px-3.5 py-2 text-xs font-medium text-[#1A1A1A] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <Edit3 className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Edit Copy</span>
          </button>
          <button
            type="button"
            onClick={onRemoveHeroImage}
            aria-label="Remove hero banner image"
            className="inline-flex items-center justify-center border border-[#E4DDD4] bg-[#FAF9F6]/95 p-2 text-[#1A1A1A] shadow-sm backdrop-blur-sm transition-colors hover:border-[#8B2635] hover:bg-[#8B2635] hover:text-[#FAF9F6]"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      )}

      {isDragging && isAdminMode && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#1A1A1A]/75 text-[#FAF9F6] backdrop-blur-[2px]">
          <div className="border border-[#D8CFC4]/60 px-8 py-6 text-center">
            <Upload className="mx-auto mb-2 h-7 w-7 text-[#D8CFC4]" strokeWidth={1.5} />
            <p className="font-serif text-xl">Drop hero campaign photo here</p>
          </div>
        </div>
      )}
    </section>
  );
};
