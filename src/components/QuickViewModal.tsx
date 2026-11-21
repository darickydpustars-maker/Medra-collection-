import React, { useEffect, useState } from 'react';
import { Camera, Check, ShoppingBag, X } from 'lucide-react';
import { ALL_SIZES, Product, SizeOption } from '../types/store';

interface QuickViewModalProps {
  product: Product | null;
  imageUrl?: string;
  onClose: () => void;
  onAddToBag: (product: Product, size: SizeOption) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  imageUrl,
  onClose,
  onAddToBag,
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] ?? 'M');
      setAdded(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToBag(product, selectedSize);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      onClose();
    }, 650);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/65 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        className="relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-y-auto bg-[#FAF9F6] shadow-2xl md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product quick view"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center border border-[#E4DDD4] bg-[#FAF9F6] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

        {/* Left: Larger Photo View */}
        <div className="aspect-[4/5] w-full bg-[#F2EDE7] md:col-span-6 md:aspect-auto md:min-h-[520px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[340px] flex-col items-center justify-center border-r border-[#E4DDD4] p-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#D8CFC4] bg-[#FAF9F6] text-[#6B6257]">
                <Camera className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <p className="font-serif text-xl text-[#1A1A1A]">{product.title}</p>
              <p className="mt-1 text-xs text-[#70675D]">1200 × 1500 px · 4:5 Portrait</p>
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Details */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 md:col-span-6">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#8A6B3F]">
              Medra Collection · {product.category}
            </p>

            <h2
              id="quick-view-title"
              className="mt-2 pr-8 font-serif text-3xl font-medium leading-tight text-[#1A1A1A]"
            >
              {product.title}
            </h2>

            <p className="mt-3 text-xl font-medium text-[#1A1A1A] tabular-nums">
              ${product.price.toLocaleString()}
            </p>

            <p className="mt-5 text-sm leading-relaxed text-[#4A453E]">
              {product.description}
            </p>

            {/* Fabric & Care Details */}
            <div className="mt-6 border-t border-[#E4DDD4] pt-5">
              <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1A1A1A]">
                Composition & Care
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6B6257]">
                {product.fabricCare}
              </p>
            </div>

            {/* Size Selector */}
            <div className="mt-6 border-t border-[#E4DDD4] pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1A1A1A]">
                  Select Size
                </span>
                <span className="text-xs text-[#70675D]">Selected: {selectedSize}</span>
              </div>

              <div className="mt-3 grid grid-cols-5 gap-2">
                {ALL_SIZES.map((size) => {
                  const available = product.sizes.includes(size);
                  const active = selectedSize === size && available;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!available}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 border text-xs font-medium transition-colors tabular-nums ${
                        !available
                          ? 'cursor-not-allowed border-[#ECE6DD] bg-[#F5F1EB] text-[#C7BEB3] line-through'
                          : active
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#FAF9F6]'
                          : 'border-[#D8CFC4] bg-[#FAF9F6] text-[#1A1A1A] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <button
              type="button"
              disabled={product.sizes.length === 0}
              onClick={handleAdd}
              className={`inline-flex w-full items-center justify-center gap-2.5 py-4 text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-200 ${
                added
                  ? 'bg-[#1A1A1A] text-[#FAF9F6]'
                  : 'bg-[#8A6B3F] text-[#FAF9F6] hover:bg-[#705530]'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2} />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                  <span>Add to Bag — ${product.price.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
