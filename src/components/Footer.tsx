import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { InfoModalTopic } from '../types/store';

interface FooterProps {
  onOpenInfoModal: (topic: InfoModalTopic) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInfoModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-[#E4DDD4] bg-[#F2EDE7]/55 text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5">
            <a href="#new-arrivals" className="font-serif text-2xl font-semibold tracking-wide text-[#1A1A1A]">
              Medra Collection
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#4A453E]">
              Receive early invitations to seasonal capsule releases, private salon appointments, and atelier notes.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-sm" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for newsletter
              </label>
              <div className="flex border-b border-[#1A1A1A] pb-1.5">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (subscribed) setSubscribed(false);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#8A8074] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="inline-flex items-center gap-1.5 pl-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#1A1A1A] transition-colors hover:text-[#8A6B3F]"
                >
                  <span>Join</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
              {error && <p className="mt-2 text-xs text-[#8B2635]">{error}</p>}
              {subscribed && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#705530]">
                  <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Thank you. You are on the Medra Collection private list.</span>
                </p>
              )}
            </form>
          </div>

          {/* Navigation & Customer Care Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#70675D]">
                Atelier
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#3E3933]">
                <li>
                  <a href="#new-arrivals" className="hover:text-[#8A6B3F] transition-colors">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#collections" className="hover:text-[#8A6B3F] transition-colors">
                    Collections
                  </a>
                </li>
                <li>
                  <a href="#lookbook" className="hover:text-[#8A6B3F] transition-colors">
                    Lookbook
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#8A6B3F] transition-colors">
                    About Medra
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#70675D]">
                Customer Care
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#3E3933]">
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenInfoModal('shipping')}
                    className="text-left hover:text-[#8A6B3F] transition-colors"
                  >
                    Shipping & Returns
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenInfoModal('sizing')}
                    className="text-left hover:text-[#8A6B3F] transition-colors"
                  >
                    Sizing Guide
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenInfoModal('care')}
                    className="text-left hover:text-[#8A6B3F] transition-colors"
                  >
                    Garment Care
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenInfoModal('contact')}
                    className="text-left hover:text-[#8A6B3F] transition-colors"
                  >
                    Contact Atelier
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#70675D]">
                Follow
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#3E3933]">
                <li>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#8A6B3F] transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#8A6B3F] transition-colors"
                  >
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.pinterest.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#8A6B3F] transition-colors"
                  >
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#DDD4C8] pt-6 text-xs text-[#70675D] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Medra Collection. All rights reserved.</p>
          <p>Contemporary Womenswear · Natural Fibers · Crafted in Small Runs</p>
        </div>
      </div>
    </footer>
  );
};
