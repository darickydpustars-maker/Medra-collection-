import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2 } from 'lucide-react';

interface MediaSlotProps {
  imageUrl?: string;
  alt: string;
  slotTitle: string;
  dimensionHint: string;
  isAdminMode: boolean;
  onUploadFile: (file: File) => void | Promise<void>;
  onRemoveImage?: () => void;
  onCardClick?: () => void;
  className?: string;
  imageClassName?: string;
  darkSurface?: boolean;
  compact?: boolean;
  hideAdminOverlay?: boolean;
}

export const MediaSlot: React.FC<MediaSlotProps> = ({
  imageUrl,
  alt,
  slotTitle,
  dimensionHint,
  isAdminMode,
  onUploadFile,
  onRemoveImage,
  onCardClick,
  className = '',
  imageClassName = '',
  darkSurface = false,
  compact = false,
  hideAdminOverlay = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasValidImage = Boolean(imageUrl) && !imgError;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImgError(false);
      onUploadFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAdminMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isAdminMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isAdminMode) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImgError(false);
      onUploadFile(file);
    }
  };

  const triggerFilePicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  const handleContainerClick = () => {
    if (isAdminMode) {
      if (onCardClick) {
        onCardClick();
      } else {
        inputRef.current?.click();
      }
    } else if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative overflow-hidden select-none ${
        onCardClick || isAdminMode ? 'cursor-pointer' : ''
      } ${
        isDragging
          ? 'ring-2 ring-[#8A6B3F] ring-offset-2 ring-offset-[#FAF9F6]'
          : ''
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label={`Upload photo for ${slotTitle}`}
      />

      {hasValidImage ? (
        <img
          src={imageUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${imageClassName}`}
        />
      ) : (
        <div
          className={`flex h-full w-full flex-col items-center justify-center text-center transition-colors duration-200 ${
            darkSurface
              ? 'bg-[#252320] text-[#FAF9F6] border border-[#3A3631]'
              : 'bg-[#F2EDE7] text-[#1A1A1A] border border-[#E4DDD4]'
          } ${
            isAdminMode
              ? darkSurface
                ? 'hover:bg-[#2E2B27] hover:border-[#8A6B3F]'
                : 'hover:bg-[#ECE5DC] hover:border-[#8A6B3F]'
              : ''
          } ${compact ? 'p-4' : 'p-6 sm:p-8'}`}
        >
          <div
            className={`mb-3 flex items-center justify-center rounded-full border transition-colors ${
              compact ? 'h-9 w-9' : 'h-12 w-12'
            } ${
              darkSurface
                ? 'border-[#4A443D] bg-[#1F1D1A] text-[#D8CFC4]'
                : 'border-[#D8CFC4] bg-[#FAF9F6] text-[#6B6257]'
            }`}
          >
            {isAdminMode ? (
              <Upload className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={1.5} />
            ) : (
              <Camera className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={1.5} />
            )}
          </div>

          <p
            className={`font-serif font-medium tracking-wide ${
              compact ? 'text-sm' : 'text-lg sm:text-xl'
            } ${darkSurface ? 'text-[#FAF9F6]' : 'text-[#1A1A1A]'}`}
          >
            {slotTitle}
          </p>

          <p
            className={`mt-1 text-xs tracking-wide tabular-nums ${
              darkSurface ? 'text-[#B8AFA4]' : 'text-[#70675D]'
            }`}
          >
            {dimensionHint}
          </p>

          {isAdminMode && !compact && (
            <button
              type="button"
              onClick={triggerFilePicker}
              className={`mt-4 inline-flex items-center gap-2 border px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors ${
                darkSurface
                  ? 'border-[#8A6B3F] bg-[#8A6B3F] text-[#FAF9F6] hover:bg-[#705530]'
                  : 'border-[#1A1A1A] bg-[#FAF9F6] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]'
              }`}
            >
              <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
              Upload Photo
            </button>
          )}
        </div>
      )}

      {/* Admin Edit Mode action bar when image is present or overlay requested */}
      {isAdminMode && !hideAdminOverlay && (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 p-3 transition-opacity duration-200 ${
            hasValidImage
              ? 'opacity-95 sm:opacity-0 sm:group-hover:opacity-100'
              : 'opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={triggerFilePicker}
            className="pointer-events-auto inline-flex items-center gap-1.5 border border-[#E4DDD4] bg-[#FAF9F6]/95 px-3 py-1.5 text-xs font-medium text-[#1A1A1A] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>{hasValidImage ? 'Replace Photo' : 'Upload'}</span>
          </button>

          {hasValidImage && onRemoveImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage();
              }}
              aria-label={`Remove photo for ${slotTitle}`}
              className="pointer-events-auto inline-flex items-center justify-center border border-[#E4DDD4] bg-[#FAF9F6]/95 p-1.5 text-[#1A1A1A] shadow-sm backdrop-blur-sm transition-colors hover:border-[#8B2635] hover:bg-[#8B2635] hover:text-[#FAF9F6]"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      )}

      {isDragging && isAdminMode && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1A1A1A]/75 text-[#FAF9F6] backdrop-blur-[2px]">
          <div className="border border-[#D8CFC4]/60 px-6 py-4 text-center">
            <Upload className="mx-auto mb-2 h-6 w-6 text-[#D8CFC4]" strokeWidth={1.5} />
            <p className="font-serif text-lg">Drop photo to upload</p>
          </div>
        </div>
      )}
    </div>
  );
};
