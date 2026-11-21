export type Category = 'Dresses' | 'Sets' | 'Outerwear' | 'Accessories';

export type FilterCategory = 'All' | Category;

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL';

export const ALL_SIZES: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL'];

export const PRODUCT_CATEGORIES: Category[] = ['Dresses', 'Sets', 'Outerwear', 'Accessories'];

export interface Product {
  id: string;
  title: string;
  price: number;
  category: Category;
  description: string;
  fabricCare: string;
  sizes: SizeOption[];
  imageId: string | null;
}

export interface LookbookItem {
  id: string;
  lookNumber: string;
  title: string;
  caption: string;
  aspect: 'portrait' | 'landscape';
  imageId: string | null;
}

export interface HeroConfig {
  kicker: string;
  headline: string;
  subtext: string;
  ctaLabel: string;
  imageId: string | null;
}

export interface AboutConfig {
  kicker: string;
  headline: string;
  paragraphs: string[];
  atelierNote: string;
  imageId: string | null;
}

export interface StoreData {
  hero: HeroConfig;
  products: Product[];
  lookbook: LookbookItem[];
  about: AboutConfig;
}

export interface CartItem {
  productId: string;
  size: SizeOption;
  quantity: number;
}

export type InfoModalTopic =
  | 'shipping'
  | 'sizing'
  | 'care'
  | 'contact'
  | null;
