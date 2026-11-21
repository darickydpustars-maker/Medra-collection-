import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem, Product, SizeOption } from '../types/store';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  products: Product[];
  mediaUrls: Record<string, string>;
  onClose: () => void;
  onUpdateQuantity: (productId: string, size: SizeOption, delta: number) => void;
  onRemoveItem: (productId: string, size: SizeOption) => void;
  onClearBag: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  products,
  mediaUrls,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [copied, setCopied] = useState(false);

  const enrichedItems = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          imageUrl: product.imageId ? mediaUrls[product.imageId] : undefined,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }, [items, products, mediaUrls]);

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalCount = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);
  const complimentaryShippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, complimentaryShippingThreshold - subtotal);

  const whatsappMessage = useMemo(() => {
    const lines = [
      'Hello Medra Collection Atelier,',
      '',
      'I would like to place the following order:',
      ...enrichedItems.map(
        (item, idx) =>
          `${idx + 1}. ${item.product.title} (Size ${item.size}) × ${item.quantity} — $${(
            item.product.price * item.quantity
          ).toLocaleString()}`
      ),
      '',
      `Subtotal: $${subtotal.toLocaleString()}`,
      `Shipping: ${remainingForFreeShipping === 0 ? 'Complimentary' : 'Calculated at confirmation'}`,
    ];

    if (customerName.trim()) {
      lines.push(`Client Name: ${customerName.trim()}`);
    }
    if (customerCity.trim()) {
      lines.push(`Delivery Location: ${customerCity.trim()}`);
    }
    if (orderNote.trim()) {
      lines.push(`Note: ${orderNote.trim()}`);
    }

    return lines.join('\n');
  }, [enrichedItems, subtotal, remainingForFreeShipping, customerName, customerCity, orderNote]);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1A1A]/55 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <aside
        className="flex h-full w-full max-w-md flex-col bg-[#FAF9F6] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E4DDD4] px-6 py-5">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                className="inline-flex h-8 w-8 items-center justify-center text-[#1A1A1A] hover:bg-[#F2EDE7]"
                aria-label="Back to shopping bag"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#1A1A1A]">
                {step === 'bag' ? 'Shopping Bag' : 'Order Preview'}
              </h2>
              <p className="text-xs text-[#70675D] tabular-nums">
                {totalCount} {totalCount === 1 ? 'piece' : 'pieces'} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="inline-flex h-10 w-10 items-center justify-center border border-[#E4DDD4] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Complimentary Shipping Notice */}
        {enrichedItems.length > 0 && (
          <div className="border-b border-[#E4DDD4] bg-[#F2EDE7] px-6 py-2.5 text-xs text-[#4A453E]">
            {remainingForFreeShipping === 0 ? (
              <span className="font-medium text-[#1A1A1A]">
                Your order qualifies for complimentary express atelier shipping.
              </span>
            ) : (
              <span>
                Add <span className="font-semibold tabular-nums">${remainingForFreeShipping.toLocaleString()}</span> more for complimentary express shipping.
              </span>
            )}
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {enrichedItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D8CFC4] bg-[#F2EDE7] text-[#6B6257]">
                <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <p className="font-serif text-2xl text-[#1A1A1A]">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-sm text-[#70675D]">
                Explore our contemporary ready-to-wear collection to add pieces to your bag.
              </p>
              <a
                href="#collections"
                onClick={onClose}
                className="mt-6 inline-flex items-center justify-center bg-[#1A1A1A] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#FAF9F6] transition-colors hover:bg-[#8A6B3F]"
              >
                Explore Collection
              </a>
            </div>
          ) : step === 'bag' ? (
            <ul className="divide-y divide-[#E4DDD4]">
              {enrichedItems.map(({ product, size, quantity, imageUrl }) => (
                <li key={`${product.id}-${size}`} className="flex gap-4 py-5 first:pt-0">
                  <div className="h-28 w-22 shrink-0 overflow-hidden bg-[#F2EDE7]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center border border-[#E4DDD4] text-[#8B8175]">
                        <Camera className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-lg font-medium leading-snug text-[#1A1A1A]">
                          {product.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id, size)}
                          aria-label={`Remove ${product.title} size ${size}`}
                          className="p-1 text-[#70675D] transition-colors hover:text-[#8B2635]"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-[#70675D]">
                        {product.category} · Size {size}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-[#D8CFC4]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, size, -1)}
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center text-[#1A1A1A] hover:bg-[#F2EDE7]"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.75} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, size, 1)}
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center text-[#1A1A1A] hover:bg-[#F2EDE7]"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.75} />
                        </button>
                      </div>

                      <p className="text-sm font-medium text-[#1A1A1A] tabular-nums">
                        ${(product.price * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            /* Checkout / WhatsApp Order Preview */
            <div className="space-y-6">
              <div className="border border-[#E4DDD4] bg-[#F2EDE7]/60 p-4">
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#8A6B3F]">
                  Client Details (Optional)
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="block text-xs font-medium text-[#4A453E]"
                    >
                      Full Name
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Amara Laurent"
                      className="mt-1 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#A39A8E] focus:border-[#8A6B3F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs font-medium text-[#4A453E]"
                    >
                      Delivery City / Address
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="e.g. London, UK"
                      className="mt-1 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#A39A8E] focus:border-[#8A6B3F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-note"
                      className="block text-xs font-medium text-[#4A453E]"
                    >
                      Tailoring or Delivery Note
                    </label>
                    <textarea
                      id="checkout-note"
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Any sizing adjustments or gift wrap requests"
                      className="mt-1 w-full border border-[#D8CFC4] bg-[#FAF9F6] px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#A39A8E] focus:border-[#8A6B3F] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1A1A1A]">
                    WhatsApp Order Summary
                  </p>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8A6B3F] hover:text-[#705530]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" strokeWidth={2} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="mt-2 whitespace-pre-wrap border border-[#E4DDD4] bg-[#F2EDE7]/40 p-4 font-sans text-xs leading-relaxed text-[#3E3933]">
                  {whatsappMessage}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {enrichedItems.length > 0 && (
          <div className="border-t border-[#E4DDD4] bg-[#FAF9F6] px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium tracking-wider uppercase text-[#70675D]">
                Subtotal
              </span>
              <span className="font-serif text-2xl font-medium text-[#1A1A1A] tabular-nums">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#70675D]">
              Taxes and personalized concierge shipping confirmed prior to dispatch.
            </p>

            {step === 'bag' ? (
              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#8A6B3F] px-6 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#FAF9F6] transition-colors hover:bg-[#705530]"
                >
                  <span>Proceed to Order / WhatsApp Checkout</span>
                </button>
                <button
                  type="button"
                  onClick={onClearBag}
                  className="w-full py-2 text-center text-xs text-[#70675D] hover:text-[#1A1A1A]"
                >
                  Clear Bag
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#8A6B3F] px-6 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#FAF9F6] transition-colors hover:bg-[#705530]"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
                  <span>Send Order via WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="w-full border border-[#D8CFC4] py-2.5 text-xs font-medium tracking-wider uppercase text-[#1A1A1A] hover:border-[#1A1A1A]"
                >
                  Modify Bag Items
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};
