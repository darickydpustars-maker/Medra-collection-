import { StoreData } from '../types/store';

export const DEFAULT_STORE_DATA: StoreData = {
  hero: {
    kicker: 'Autumn / Winter Capsule',
    headline: 'Sculpted Quietude in Natural Form',
    subtext:
      'Architectural silhouettes tailored from raw organic silk, brushed wool, and unbleached Belgian linen. Designed for effortless permanence.',
    ctaLabel: 'Shop the Collection',
    imageId: null,
  },
  products: [
    {
      id: 'prod-atelier-silk-dress',
      title: 'Sora Bias-Cut Silk Dress',
      price: 380,
      category: 'Dresses',
      description:
        'Cut on the true bias for fluid movement, featuring a softly draped cowl neckline and elongated French-seamed cuffs.',
      fabricCare: '100% Mulberry Silk Charmeuse · Dry clean only · Crafted in small atelier runs.',
      sizes: ['XS', 'S', 'M', 'L'],
      imageId: null,
    },
    {
      id: 'prod-linen-coord-set',
      title: 'Elara Tailored Linen Two-Piece',
      price: 420,
      category: 'Sets',
      description:
        'Relaxed double-breasted vest paired with high-waisted wide-leg trousers in heavyweight stone-washed linen.',
      fabricCare: '100% European Flax Linen · Gentle cold wash or steam refresh · Corozo nut buttons.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      imageId: null,
    },
    {
      id: 'prod-cashmere-trench',
      title: 'Aurelia Double-Faced Wool Coat',
      price: 690,
      category: 'Outerwear',
      description:
        'Unlined hand-finished overcoat with sculpted raglan sleeves, deep welt pockets, and a tonal self-tie waist belt.',
      fabricCare: '90% Virgin Wool, 10% Cashmere · Specialist dry clean · Breathable natural weave.',
      sizes: ['S', 'M', 'L', 'XL'],
      imageId: null,
    },
    {
      id: 'prod-column-maxi',
      title: 'Kora Pleated Column Gown',
      price: 460,
      category: 'Dresses',
      description:
        'Architectural knife-pleated silhouette with an understated boat neck and clean ankle-grazing hem.',
      fabricCare: '72% Triacetate, 28% Recycled Silk · Steam gently · Do not wring.',
      sizes: ['XS', 'S', 'M', 'L'],
      imageId: null,
    },
    {
      id: 'prod-knit-lounge-set',
      title: 'Noor Ribbed Merino Lounge Set',
      price: 340,
      category: 'Sets',
      description:
        'Fine-gauge tonal knit tunic and flared knit pant designed to transition seamlessly from studio to evening.',
      fabricCare: '100% Extra-Fine Merino Wool · Hand wash cool, dry flat on towel.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      imageId: null,
    },
    {
      id: 'prod-sculpted-leather-tote',
      title: 'Vespera Soft Grain Atelier Bag',
      price: 295,
      category: 'Accessories',
      description:
        'Minimalist architectural shoulder bag with raw-painted edges, suede interior lining, and brushed brass hardware.',
      fabricCare: 'Vegetable-tanned full-grain calfskin · Store in cotton dust bag away from direct sun.',
      sizes: ['S', 'M', 'L'],
      imageId: null,
    },
  ],
  lookbook: [
    {
      id: 'look-01',
      lookNumber: 'Look 01',
      title: 'Morning Light in Limestone',
      caption: 'Sora Bias-Cut Silk Dress styled with brushed brass cuffs.',
      aspect: 'portrait',
      imageId: null,
    },
    {
      id: 'look-02',
      lookNumber: 'Look 02',
      title: 'The Relaxed Tailoring Study',
      caption: 'Elara Linen Two-Piece in unbleached alabaster flax.',
      aspect: 'landscape',
      imageId: null,
    },
    {
      id: 'look-03',
      lookNumber: 'Look 03',
      title: 'Draped Overcoat Architecture',
      caption: 'Aurelia Double-Faced Wool Coat over fine merino knitwear.',
      aspect: 'portrait',
      imageId: null,
    },
    {
      id: 'look-04',
      lookNumber: 'Look 04',
      title: 'Evening Verticality',
      caption: 'Kora Pleated Column Gown photographed in natural window shadow.',
      aspect: 'portrait',
      imageId: null,
    },
    {
      id: 'look-05',
      lookNumber: 'Look 05',
      title: 'Tactile Minimalism',
      caption: 'Vespera Atelier Bag and hand-loomed winter textures.',
      aspect: 'landscape',
      imageId: null,
    },
  ],
  about: {
    kicker: 'Our Philosophy',
    headline: 'Designed for Stillness, Tailored for Life',
    paragraphs: [
      'Founded on the belief that true luxury is quiet, Medra Collection crafts contemporary garments that honor architectural proportion and tactile honesty. Each piece begins with raw, traceable fibers—Belgian flax, organic mulberry silk, and double-faced virgin wool.',
      'Working in small numbered studio runs, our pattern makers balance fluid drape with crisp tailoring so every garment moves naturally with the wearer across seasons, rather than bowing to fleeting trends.',
    ],
    atelierNote: 'Small-Batch Atelier · Natural Fibers · Timeless Silhouettes',
    imageId: null,
  },
};
