import React, { useState } from 'react';
import { Image as ImageIcon, Plus, RotateCcw } from 'lucide-react';

interface AdminToolbarProps {
  uploadedCount: number;
  totalSlots: number;
  onAddNewProduct: () => void;
  onEditHeroCopy: () => void;
  onEditAboutStory: () => void;
  onResetStore: () => void;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({
  uploadedCount,
  totalSlots,
  onAddNewProduct,
  onEditHeroCopy,
  onEditAboutStory,
  onResetStore,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="border-b border-[#D8CFC4] bg-[#F2EDE7]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-xs text-[#3E3933]">
          <ImageIcon className="h-4 w-4 text-[#8A6B3F]" strokeWidth={1.75} />
          <span>
            <strong className="font-semibold text-[#1A1A1A]">Store Admin & Media Manager:</strong>{' '}
            Click any image slot or drag photos directly from your device.{' '}
            <span className="tabular-nums text-[#70675D]">
              ({uploadedCount}/{totalSlots} media slots filled)
            </span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddNewProduct}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] px-3 py-1.5 text-xs font-medium text-[#FAF9F6] transition-colors hover:bg-[#8A6B3F]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            <span>New Product</span>
          </button>

          <button
            type="button"
            onClick={onEditHeroCopy}
            className="border border-[#CFC5B7] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#1A1A1A] transition-colors hover:border-[#1A1A1A]"
          >
            Edit Hero
          </button>

          <button
            type="button"
            onClick={onEditAboutStory}
            className="border border-[#CFC5B7] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#1A1A1A] transition-colors hover:border-[#1A1A1A]"
          >
            Edit Story
          </button>

          {confirmReset ? (
            <div className="inline-flex items-center gap-1.5 border border-[#8B2635] bg-[#FAF9F6] px-2.5 py-1 text-xs">
              <span className="text-[#8B2635] font-medium">Reset all?</span>
              <button
                type="button"
                onClick={() => {
                  onResetStore();
                  setConfirmReset(false);
                }}
                className="font-semibold text-[#8B2635] underline"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-[#70675D] hover:text-[#1A1A1A]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 border border-[#CFC5B7] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#70675D] transition-colors hover:border-[#8B2635] hover:text-[#8B2635]"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={1.75} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
