import React, { useState } from 'react';
import { Check, Edit3, Plus, ShoppingBag } from 'lucide-react';
import {
  ALL_SIZES,
  FilterCategory,
  Product,
  SizeOption,
} from '../types/store';
import { MediaSlot } from './MediaSlot';

interface CatalogSectionProps {
  products: Product[];
  mediaUrls: Record<string, string>;
  activeCategory: FilterCategory;
  onSelectCategory: (cat: FilterCategory) => void;
  isAdminMode: boolean;
  onQuickViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onAddNewProduct: () => void;
  onUploadProductImage: (productId: string, file: File) => void | Promise<void>;
  onRemoveProductImage: (productId: string) => void;
  onAddToBag: (product: Product, size: SizeOption) => void;
}

const CATEGORIES: FilterCategory[] = ['All', 'Dresses', 'Sets', 'Outerwear', 'Accessories'];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  mediaUrls,
  activeCategory,
  onSelectCategory,
  isAdminMode,
  onQuickViewProduct,
  onEditProduct,
  onAddNewProduct,
  onUploadProductImage,
  onRemoveProductImage,
  onAddToBag,
}) => {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, SizeOption>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const getActiveSize = (product: Product): SizeOption => {
    const chosen = selectedSizes[product.id];
    if (chosen && product.sizes.includes(chosen)) {
      return chosen;
    }
    return product.sizes[0] ?? 'M';
  };

  const handleQuickAdd = (product: Product) => {
    const size = getActiveSize(product);
    onAddToBag(product, size);
    setJustAddedId(product.id);
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === product.id ? null : curr));
    }, 1400);
  };

  return (
    <section id="collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Section Header & Filter Controls */}
      <div className="flex flex-col gap-6 border-b border-[#E4DDD4] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#70675D]">
            Curated Ready-to-Wear
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#1A1A1A] sm:text-4xl">
            The Collection
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Filter collection by category">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectCategory(category)}
                  className={`px-3 py-2 text-xs font-medium tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'border-b-2 border-[#8A6B3F] text-[#1A1A1A]'
                      : 'border-b-2 border-transparent text-[#70675D] hover:text-[#1A1A1A]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {isAdminMode && (
            <button
              type="button"
              onClick={onAddNewProduct}
              className="inline-flex items-center gap-2 bg-[#8A6B3F] px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#FAF9F6] whitespace-nowrap shrink-0 transition-colors hover:bg-[#705530]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="my-16 border border-[#E4DDD4] bg-[#F2EDE7]/60 px-6 py-16 text-center">
          <p className="font-serif text-2xl text-[#1A1A1A]">
            No pieces in {activeCategory} yet
          </p>
          <p className="mt-2 text-sm text-[#70675D]">
            Select another category or add a new garment in Admin Edit Mode.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
          {filteredProducts.map((product) => {
            const imageUrl = product.imageId ? mediaUrls[product.imageId] : undefined;
            const activeSize = getActiveSize(product);
            const isJustAdded = justAddedId === product.id;

            return (
              <article
                key={product.id}
                className="group flex flex-col justify-between transition-transform duration-200"
              >
                <div>
                  {/* Image Slot (aspect 4:5) */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2EDE7]">
                    <MediaSlot
                      imageUrl={imageUrl}
                      alt={product.title}
                      slotTitle={product.title}
                      dimensionHint="1200 × 1500 px · 4:5 Portrait"
                      isAdminMode={isAdminMode}
                      onUploadFile={(file) => onUploadProductImage(product.id, file)}
                      onRemoveImage={() => onRemoveProductImage(product.id)}
                      onCardClick={() =>
                        isAdminMode ? onEditProduct(product) : onQuickViewProduct(product)
                      }
                      className="h-full w-full"
                    />

                    {isAdminMode && (
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 border border-[#1A1A1A] bg-[#FAF9F6]/95 px-3 py-1.5 text-xs font-medium text-[#1A1A1A] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
                      >
                        <Edit3 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        <span>Edit Item</span>
                      </button>
                    )}
                  </div>

                  {/* Product Metadata & Title */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2 text-xs tracking-wide text-[#70675D]">
                      <span className="uppercase">{product.category}</span>
                      <span className="font-medium text-[#1A1A1A] tabular-nums text-[15px]">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="mt-1.5 font-serif text-xl font-medium leading-snug text-[#1A1A1A]">
                      <button
                        type="button"
                        onClick={() =>
                          isAdminMode ? onEditProduct(product) : onQuickViewProduct(product)
                        }
                        className="text-left transition-colors hover:text-[#8A6B3F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A6B3F]"
                      >
                        {product.title}
                      </button>
                    </h3>
                  </div>
                </div>

                {/* Available Sizes & Add to Bag */}
                <div className="mt-4 pt-3 border-t border-[#ECE6DD]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] tracking-wider uppercase text-[#70675D]">
                      Sizes
                    </span>
                    <div className="flex items-center gap-1" role="group" aria-label={`Select size for ${product.title}`}>
                      {ALL_SIZES.map((size) => {
                        const available = product.sizes.includes(size);
                        const selected = activeSize === size && available;
                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={!available}
                            onClick={() =>
                              setSelectedSizes((prev) => ({
                                ...prev,
                                [product.id]: size,
                              }))
                            }
                            className={`h-7 min-w-[28px] px-1.5 text-[11px] font-medium transition-colors tabular-nums ${
                              !available
                                ? 'cursor-not-allowed text-[#C7BEB3] line-through'
                                : selected
                                ? 'border border-[#1A1A1A] bg-[#1A1A1A] text-[#FAF9F6]'
                                : 'border border-transparent text-[#4A453E] hover:border-[#D8CFC4]'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={product.sizes.length === 0}
                      onClick={() => handleQuickAdd(product)}
                      className={`inline-flex w-full items-center justify-center gap-2 border px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-200 ${
                        isJustAdded
                          ? 'border-[#8A6B3F] bg-[#8A6B3F] text-[#FAF9F6]'
                          : 'border-[#1A1A1A] bg-transparent text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]'
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" strokeWidth={2} />
                          <span>Added ({activeSize})</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
