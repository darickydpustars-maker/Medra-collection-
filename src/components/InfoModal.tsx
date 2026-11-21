import React from 'react';
import { X } from 'lucide-react';
import { InfoModalTopic } from '../types/store';

interface InfoModalProps {
  topic: InfoModalTopic;
  onClose: () => void;
}

const TOPIC_CONTENT: Record<
  Exclude<InfoModalTopic, null>,
  { kicker: string; title: string; sections: { heading: string; body: string }[] }
> = {
  shipping: {
    kicker: 'Client Services',
    title: 'Shipping & Returns',
    sections: [
      {
        heading: 'Express Atelier Dispatch',
        body: 'Orders are carefully steamed, wrapped in unbleached cotton garment bags, and dispatched within 2 business days. Complimentary express shipping applies on orders over $500.',
      },
      {
        heading: 'Returns & Exchanges',
        body: 'Unworn pieces with original atelier tags may be exchanged or returned within 14 days of delivery. Contact our client concierge via WhatsApp or email to initiate a prepaid courier collection.',
      },
    ],
  },
  sizing: {
    kicker: 'Fit & Proportion',
    title: 'Sizing Guide',
    sections: [
      {
        heading: 'Contemporary Architectural Fit',
        body: 'XS (US 0–2 / UK 4–6) · S (US 4 / UK 8) · M (US 6–8 / UK 10–12) · L (US 10–12 / UK 14) · XL (US 14 / UK 16). Bias-cut silk pieces drape naturally; tailored outerwear allows room for fine knit layering.',
      },
      {
        heading: 'Bespoke Hem Adjustments',
        body: 'Complimentary trouser and gown hem adjustments can be noted during your WhatsApp order consultation.',
      },
    ],
  },
  care: {
    kicker: 'Material Longevity',
    title: 'Garment Care',
    sections: [
      {
        heading: 'Organic Mulberry Silk & Virgin Wool',
        body: 'Air garments on wide cedar hangers between wears and refresh with a gentle handheld steamer rather than frequent dry cleaning.',
      },
      {
        heading: 'European Flax Linen',
        body: 'Wash cool on a delicate cycle with pH-neutral detergent and dry flat away from direct heat to preserve natural fiber luster.',
      },
    ],
  },
  contact: {
    kicker: 'Private Concierge',
    title: 'Contact Atelier',
    sections: [
      {
        heading: 'Client Appointments & Inquiries',
        body: 'Our stylists are available Monday through Saturday, 10:00 – 18:00 GMT for sizing consultations, fabric swatches, and private wardrobe appointments.',
      },
      {
        heading: 'Direct Correspondence',
        body: 'Email: concierge@medracollection.com · Direct WhatsApp orders can be submitted directly from your Shopping Bag.',
      },
    ],
  },
};

export const InfoModal: React.FC<InfoModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;
  const content = TOPIC_CONTENT[topic];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/65 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF9F6] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#E4DDD4] pb-4">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#8A6B3F]">
              {content.kicker}
            </p>
            <h2 id="info-modal-title" className="mt-1 font-serif text-3xl font-medium text-[#1A1A1A]">
              {content.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer care dialog"
            className="inline-flex h-9 w-9 items-center justify-center border border-[#E4DDD4] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1A1A1A]">
                {section.heading}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#4A453E]">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
