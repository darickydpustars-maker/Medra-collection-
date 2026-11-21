import React, { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, Trash2, Upload, X } from 'lucide-react';
import {
  AboutConfig,
  ALL_SIZES,
  Category,
  HeroConfig,
  LookbookItem,
  PRODUCT_CATEGORIES,
  Product,
  SizeOption,
} from '../types/store';

/* -------------------------------------------------------------------------- */
/* 1. Product Editor Modal (Create or Edit Product + Upload Photo)            */
/* -------------------------------------------------------------------------- */

interface ProductEditorModalProps {
  isOpen: boolean;
  product: Product | null; // null => creating brand-new product
  mediaUrls: Record<string, string>;
  onClose: () => void;
  onSave: (
    draft: Omit<Product, 'id' | 'imageId'>,
    existingId: string | null,
    pendingFile: File | null,
    removeExistingImage: boolean
  ) => void | Promise<void>;
  onDelete?: (productId: string) => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  product,
  mediaUrls,
  onClose,
  onSave,
  onDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('350');
  const [category, setCategory] = useState<Category>('Dresses');
  const [description, setDescription] = useState('');
  const [fabricCare, setFabricCare] = useState('');
  const [sizes, setSizes] = useState<SizeOption[]>(['XS', 'S', 'M', 'L']);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (product) {
      setTitle(product.title);
      setPrice(String(product.price));
      setCategory(product.category);
      setDescription(product.description);
      setFabricCare(product.fabricCare);
      setSizes(product.sizes);
      setPendingFile(null);
      setPreviewUrl(product.imageId ? mediaUrls[product.imageId] ?? null : null);
      setRemoveExistingImage(false);
    } else {
      setTitle('');
      setPrice('360');
      setCategory('Dresses');
      setDescription('');
      setFabricCare('100% Natural Organic Fiber · Specialist dry clean.');
      setSizes(['XS', 'S', 'M', 'L', 'XL']);
      setPendingFile(null);
      setPreviewUrl(null);
      setRemoveExistingImage(false);
    }
    setError('');
  }, [isOpen, product, mediaUrls]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:') && pendingFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, pendingFile]);

  if (!isOpen) return null;

  const handleFilePicked = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setPendingFile(file);
    setRemoveExistingImage(false);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  };

  const toggleSize = (s: SizeOption) => {
    setSizes((prev) =>
      prev.includes(s)
        ? prev.filter((item) => item !== s)
        : ALL_SIZES.filter((sz) => prev.includes(sz) || sz === s)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);
    if (!title.trim()) {
      setError('Please enter a product title.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }
    if (sizes.length === 0) {
      setError('Select at least one available size.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        price: Math.round(numericPrice),
        category,
        description: description.trim() || 'Contemporary silhouette tailored in small atelier runs.',
        fabricCare: fabricCare.trim() || 'Natural fiber blend · Dry clean recommended.',
        sizes,
      },
      product ? product.id : null,
      pendingFile,
      removeExistingImage
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/65 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-editor-title"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-[#FAF9F6] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E4DDD4] pb-4">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#8A6B3F]">
              Store Admin · Product Editor
            </p>
            <h2 id="product-editor-title" className="mt-1 font-serif text-2xl font-medium text-[#1A1A1A]">
              {product ? `Edit "${product.title}"` : 'Add New Product'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product editor"
            className="inline-flex h-10 w-10 items-center justify-center border border-[#E4DDD4] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left: Photo Upload Slot */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Product Photography
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFilePicked(file);
                e.target.value = '';
              }}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFilePicked(file);
              }}
              className="mt-2 relative flex aspect-[4/5] w-full cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-[#C7BEB3] bg-[#F2EDE7] text-center transition-colors hover:border-[#8A6B3F]"
            >
              {previewUrl && !removeExistingImage ? (
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="p-6">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#D8CFC4] bg-[#FAF9F6] text-[#6B6257]">
                    <Camera className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <p className="font-serif text-lg text-[#1A1A1A]">Click or drop photo</p>
                  <p className="mt-1 text-xs text-[#70675D]">1200 × 1500 px · 4:5 Portrait</p>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex flex-1 items-center justify-center gap-1.5 border border-[#1A1A1A] px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
              >
                <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>{previewUrl && !removeExistingImage ? 'Replace' : 'Choose File'}</span>
              </button>
              {previewUrl && !removeExistingImage && (
                <button
                  type="button"
                  onClick={() => {
                    setPendingFile(null);
                    setPreviewUrl(null);
                    setRemoveExistingImage(true);
                  }}
                  className="inline-flex items-center justify-center border border-[#D8CFC4] px-3 py-2 text-xs text-[#8B2635] hover:border-[#8B2635]"
                  aria-label="Remove product image"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Metadata Fields */}
          <div className="space-y-4 md:col-span-7">
            <div>
              <label htmlFor="prod-title" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
                Product Title
              </label>
              <input
                id="prod-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Atelier Draped Midi Dress"
                className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="prod-price" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
                  Price (USD)
                </label>
                <input
                  id="prod-price"
                  type="number"
                  min={1}
                  step={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] tabular-nums focus:border-[#8A6B3F] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="prod-cat" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
                  Category
                </label>
                <select
                  id="prod-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
                Available Sizes
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_SIZES.map((s) => {
                  const active = sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`h-9 min-w-[44px] border px-3 text-xs font-medium transition-colors ${
                        active
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#FAF9F6]'
                          : 'border-[#D8CFC4] bg-[#FAF9F6] text-[#4A453E] hover:border-[#1A1A1A]'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="prod-desc" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
                Editorial Description
              </label>
              <textarea
                id="prod-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe silhouette, fit, and design inspiration..."
                className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prod-fabric" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
                Fabric & Care Details
              </label>
              <input
                id="prod-fabric"
                type="text"
                value={fabricCare}
                onChange={(e) => setFabricCare(e.target.value)}
                placeholder="e.g. 100% Mulberry Silk · Dry clean only"
                className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
              />
            </div>

            {error && (
              <p className="border border-[#8B2635]/30 bg-[#8B2635]/5 px-3 py-2 text-xs font-medium text-[#8B2635]">
                {error}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E4DDD4]">
              {product && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(product.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B2635] hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>Delete Product</span>
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-[#D8CFC4] px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-[#1A1A1A] hover:border-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#8A6B3F] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF9F6] hover:bg-[#705530]"
                >
                  {product ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Hero Copy Editor Modal                                                  */
/* -------------------------------------------------------------------------- */

interface HeroEditorModalProps {
  isOpen: boolean;
  hero: HeroConfig;
  onClose: () => void;
  onSave: (updated: Partial<HeroConfig>) => void;
}

export const HeroEditorModal: React.FC<HeroEditorModalProps> = ({
  isOpen,
  hero,
  onClose,
  onSave,
}) => {
  const [kicker, setKicker] = useState(hero.kicker);
  const [headline, setHeadline] = useState(hero.headline);
  const [subtext, setSubtext] = useState(hero.subtext);
  const [ctaLabel, setCtaLabel] = useState(hero.ctaLabel);

  useEffect(() => {
    if (isOpen) {
      setKicker(hero.kicker);
      setHeadline(hero.headline);
      setSubtext(hero.subtext);
      setCtaLabel(hero.ctaLabel);
    }
  }, [isOpen, hero]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      kicker: kicker.trim() || hero.kicker,
      headline: headline.trim() || hero.headline,
      subtext: subtext.trim() || hero.subtext,
      ctaLabel: ctaLabel.trim() || hero.ctaLabel,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/65 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Edit Hero Banner Copy"
    >
      <div
        className="w-full max-w-lg bg-[#FAF9F6] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E4DDD4] pb-4">
          <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">
            Edit Hero Editorial Copy
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hero editor"
            className="inline-flex h-9 w-9 items-center justify-center border border-[#E4DDD4] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="hero-kicker" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Season / Kicker
            </label>
            <input
              id="hero-kicker"
              type="text"
              value={kicker}
              onChange={(e) => setKicker(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="hero-headline" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Headline
            </label>
            <input
              id="hero-headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="hero-subtext" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Subtext
            </label>
            <textarea
              id="hero-subtext"
              rows={3}
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="hero-cta" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Button Label
            </label>
            <input
              id="hero-cta"
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E4DDD4]">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#D8CFC4] px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-[#1A1A1A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#8A6B3F] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF9F6] hover:bg-[#705530]"
            >
              Save Hero Copy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Lookbook Frame Editor Modal                                             */
/* -------------------------------------------------------------------------- */

interface LookbookEditorModalProps {
  isOpen: boolean;
  item: LookbookItem | null;
  onClose: () => void;
  onSave: (item: LookbookItem, pendingFile: File | null) => void | Promise<void>;
  onDelete: (itemId: string) => void;
}

export const LookbookEditorModal: React.FC<LookbookEditorModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
  onDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lookNumber, setLookNumber] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [aspect, setAspect] = useState<'portrait' | 'landscape'>('portrait');
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      setLookNumber(item.lookNumber);
      setTitle(item.title);
      setCaption(item.caption);
      setAspect(item.aspect);
      setPendingFile(null);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        ...item,
        lookNumber: lookNumber.trim() || item.lookNumber,
        title: title.trim() || item.title,
        caption: caption.trim() || item.caption,
        aspect,
      },
      pendingFile
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/65 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Edit Lookbook Frame"
    >
      <div
        className="w-full max-w-lg bg-[#FAF9F6] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E4DDD4] pb-4">
          <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">
            Edit Lookbook Frame
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lookbook editor"
            className="inline-flex h-9 w-9 items-center justify-center border border-[#E4DDD4] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="look-num" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
                Look Label
              </label>
              <input
                id="look-num"
                type="text"
                value={lookNumber}
                onChange={(e) => setLookNumber(e.target.value)}
                className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="look-aspect" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
                Frame Aspect
              </label>
              <select
                id="look-aspect"
                value={aspect}
                onChange={(e) => setAspect(e.target.value as 'portrait' | 'landscape')}
                className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
              >
                <option value="portrait">3:4 Portrait</option>
                <option value="landscape">4:3 Landscape</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="look-title" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Look Title
            </label>
            <input
              id="look-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="look-caption" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Styling Caption
            </label>
            <textarea
              id="look-caption"
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  setPendingFile(file);
                }
                e.target.value = '';
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex w-full items-center justify-center gap-2 border border-dashed border-[#8A6B3F] bg-[#F2EDE7] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#1A1A1A] hover:bg-[#E8DFD4]"
            >
              <ImagePlus className="h-4 w-4 text-[#8A6B3F]" strokeWidth={1.75} />
              <span>
                {pendingFile ? `Selected: ${pendingFile.name}` : 'Upload / Replace Lookbook Photo'}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E4DDD4]">
            <button
              type="button"
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B2635] hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>Remove Frame</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#D8CFC4] px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-[#1A1A1A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#8A6B3F] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF9F6] hover:bg-[#705530]"
              >
                Save Frame
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. About / Brand Story Editor Modal                                        */
/* -------------------------------------------------------------------------- */

interface AboutEditorModalProps {
  isOpen: boolean;
  about: AboutConfig;
  onClose: () => void;
  onSave: (updated: Partial<AboutConfig>) => void;
}

export const AboutEditorModal: React.FC<AboutEditorModalProps> = ({
  isOpen,
  about,
  onClose,
  onSave,
}) => {
  const [kicker, setKicker] = useState(about.kicker);
  const [headline, setHeadline] = useState(about.headline);
  const [storyText, setStoryText] = useState(about.paragraphs.join('\n\n'));
  const [atelierNote, setAtelierNote] = useState(about.atelierNote);

  useEffect(() => {
    if (isOpen) {
      setKicker(about.kicker);
      setHeadline(about.headline);
      setStoryText(about.paragraphs.join('\n\n'));
      setAtelierNote(about.atelierNote);
    }
  }, [isOpen, about]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paragraphs = storyText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    onSave({
      kicker: kicker.trim() || about.kicker,
      headline: headline.trim() || about.headline,
      paragraphs: paragraphs.length > 0 ? paragraphs : about.paragraphs,
      atelierNote: atelierNote.trim() || about.atelierNote,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/65 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Edit Brand Story"
    >
      <div
        className="w-full max-w-xl bg-[#FAF9F6] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E4DDD4] pb-4">
          <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">
            Edit Brand Story
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close brand story editor"
            className="inline-flex h-9 w-9 items-center justify-center border border-[#E4DDD4] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="about-kicker" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Section Kicker
            </label>
            <input
              id="about-kicker"
              type="text"
              value={kicker}
              onChange={(e) => setKicker(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="about-headline" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Headline
            </label>
            <input
              id="about-headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="about-body" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Narrative Paragraphs (Separate paragraphs with a blank line)
            </label>
            <textarea
              id="about-body"
              rows={6}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm leading-relaxed text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="about-note" className="block text-xs font-semibold tracking-wider uppercase text-[#4A453E]">
              Atelier Signature Line
            </label>
            <input
              id="about-note"
              type="text"
              value={atelierNote}
              onChange={(e) => setAtelierNote(e.target.value)}
              className="mt-1.5 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8A6B3F] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E4DDD4]">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#D8CFC4] px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-[#1A1A1A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#8A6B3F] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF9F6] hover:bg-[#705530]"
            >
              Save Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
