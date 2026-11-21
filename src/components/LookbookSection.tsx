import React, { useState } from 'react';
import { Edit3, Maximize2, Plus, X } from 'lucide-react';
import { LookbookItem } from '../types/store';
import { MediaSlot } from './MediaSlot';

interface LookbookSectionProps {
  items: LookbookItem[];
  mediaUrls: Record<string, string>;
  isAdminMode: boolean;
  onUploadLookbookImage: (itemId: string, file: File) => void | Promise<void>;
  onRemoveLookbookImage: (itemId: string) => void;
  onEditLookbookItem: (item: LookbookItem) => void;
  onAddLookbookItem: () => void;
}

export const LookbookSection: React.FC<LookbookSectionProps> = ({
  items,
  mediaUrls,
  isAdminMode,
  onUploadLookbookImage,
  onRemoveLookbookImage,
  onEditLookbookItem,
  onAddLookbookItem,
}) => {
  const [lightboxItem, setLightboxItem] = useState<LookbookItem | null>(null);

  return (
    <section
      id="lookbook"
      className="border-y border-[#E4DDD4] bg-[#F2EDE7]/65 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-[#DDD4C8] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#70675D]">
              Editorial Campaign
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#1A1A1A] sm:text-4xl">
              Autumn / Winter Lookbook
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="max-w-sm text-sm text-[#4A453E]">
              Photographed in natural daylight—silhouettes shaped by movement and quiet texture.
            </p>
            {isAdminMode && (
              <button
                type="button"
                onClick={onAddLookbookItem}
                className="inline-flex items-center gap-2 bg-[#8A6B3F] px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#FAF9F6] whitespace-nowrap shrink-0 transition-colors hover:bg-[#705530]"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                <span>Add Frame</span>
              </button>
            )}
          </div>
        </div>

        {/* Asymmetric Editorial Gallery Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          {items.map((item, idx) => {
            const imageUrl = item.imageId ? mediaUrls[item.imageId] : undefined;
            const isLandscape = item.aspect === 'landscape';
            const colSpanClass = isLandscape
              ? 'md:col-span-7'
              : 'md:col-span-5';
            const aspectClass = isLandscape
              ? 'aspect-[4/3]'
              : 'aspect-[3/4]';

            // Offset slightly on alternating portrait rows on desktop for editorial asymmetry
            const staggerClass = !isLandscape && idx % 2 === 0 ? 'md:mt-6' : '';

            return (
              <figure
                key={item.id}
                className={`flex flex-col ${colSpanClass} ${staggerClass}`}
              >
                <div className={`relative w-full overflow-hidden ${aspectClass}`}>
                  <MediaSlot
                    imageUrl={imageUrl}
                    alt={`${item.lookNumber} — ${item.title}`}
                    slotTitle={`${item.lookNumber} · ${item.title}`}
                    dimensionHint={
                      isLandscape
                        ? '1600 × 1200 px · 4:3 Landscape'
                        : '1200 × 1600 px · 3:4 Portrait'
                    }
                    isAdminMode={isAdminMode}
                    onUploadFile={(file) => onUploadLookbookImage(item.id, file)}
                    onRemoveImage={() => onRemoveLookbookImage(item.id)}
                    onCardClick={() => {
                      if (isAdminMode) {
                        onEditLookbookItem(item);
                      } else if (imageUrl) {
                        setLightboxItem(item);
                      }
                    }}
                    className="h-full w-full"
                  />

                  {!isAdminMode && imageUrl && (
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      aria-label={`Inspect ${item.title}`}
                      className="absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center border border-[#E4DDD4] bg-[#FAF9F6]/90 text-[#1A1A1A] opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
                    >
                      <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  )}

                  {isAdminMode && (
                    <button
                      type="button"
                      onClick={() => onEditLookbookItem(item)}
                      className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 border border-[#1A1A1A] bg-[#FAF9F6]/95 px-3 py-1.5 text-xs font-medium text-[#1A1A1A] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
                    >
                      <Edit3 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <span>Edit Frame</span>
                    </button>
                  )}
                </div>

                <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-b border-[#E2D9CE] pb-3">
                  <div>
                    <span className="text-xs font-medium tracking-wider uppercase text-[#8A6B3F]">
                      {item.lookNumber}
                    </span>
                    <span className="mx-2 text-[#B8AFA4]" aria-hidden="true">·</span>
                    <span className="font-serif text-lg font-medium text-[#1A1A1A]">
                      {item.title}
                    </span>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#6B6257]">
                      {item.caption}
                    </p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Customer Lookbook Lightbox */}
      {lightboxItem && mediaUrls[lightboxItem.imageId ?? ''] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/85 p-4 backdrop-blur-sm"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden bg-[#FAF9F6] p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              aria-label="Close lookbook preview"
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center border border-[#E4DDD4] bg-[#FAF9F6] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <div className="max-h-[70vh] overflow-hidden bg-[#F2EDE7]">
              <img
                src={mediaUrls[lightboxItem.imageId!]}
                alt={lightboxItem.title}
                referrerPolicy="no-referrer"
                className="mx-auto max-h-[70vh] w-full object-contain"
              />
            </div>

            <div className="mt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
              <div>
                <span className="text-xs font-medium tracking-wider uppercase text-[#8A6B3F]">
                  {lightboxItem.lookNumber}
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1A1A1A]">
                  {lightboxItem.title}
                </h3>
              </div>
              <p className="text-sm text-[#4A453E]">{lightboxItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
