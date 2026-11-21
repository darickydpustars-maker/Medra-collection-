import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

interface NavbarProps {
  bagCount: number;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenBag: () => void;
}

const NAV_LINKS = [
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Collections', href: '#collections' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'About', href: '#about' },
];

export const Navbar: React.FC<NavbarProps> = ({
  bagCount,
  isAdminMode,
  onToggleAdminMode,
  onOpenBag,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5DEC9]/80 bg-[#FAF9F6]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Left: Wordmark & Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center text-[#1A1A1A] hover:bg-[#F2EDE7] md:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>

          <a
            href="#new-arrivals"
            className="font-serif text-xl font-semibold tracking-wide text-[#1A1A1A] whitespace-nowrap shrink-0 sm:text-2xl"
          >
            Medra Collection
          </a>
        </div>

        {/* Center: Clean Editorial Nav Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 text-sm font-normal tracking-wide text-[#4A453E] whitespace-nowrap shrink-0 transition-colors hover:text-[#1A1A1A] after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:origin-left after:scale-x-0 after:bg-[#8A6B3F] after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Admin Edit Mode Toggle & Shopping Bag */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={isAdminMode}
            onClick={onToggleAdminMode}
            className="inline-flex items-center gap-2.5 py-1.5 px-2 text-xs font-medium text-[#1A1A1A] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A6B3F]"
            title="Toggle Store Admin & Media Manager mode"
          >
            <span className="hidden sm:inline tracking-wide text-[#4A453E]">Admin Edit Mode</span>
            <span className="sm:hidden tracking-wide text-[#4A453E]">Admin</span>
            <span
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200 ${
                isAdminMode
                  ? 'border-[#8A6B3F] bg-[#8A6B3F]'
                  : 'border-[#CFC6BA] bg-[#E8E2D9]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-[#FAF9F6] shadow-sm transition-transform duration-200 ${
                  isAdminMode ? 'translate-x-[18px]' : 'translate-x-[2px]'
                }`}
              />
            </span>
            <span
              className={`w-6 text-left text-[11px] font-semibold tracking-wider uppercase tabular-nums ${
                isAdminMode ? 'text-[#8A6B3F]' : 'text-[#70675D]'
              }`}
            >
              {isAdminMode ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenBag}
            className="inline-flex h-10 items-center gap-2 border border-[#D8CFC4] bg-[#FAF9F6] px-3.5 text-xs font-medium tracking-wider uppercase text-[#1A1A1A] whitespace-nowrap shrink-0 transition-colors hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A6B3F]"
            aria-label={`Open shopping bag with ${bagCount} items`}
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Bag</span>
            <span className="tabular-nums">({bagCount})</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-[#E5DEC9] bg-[#FAF9F6] px-4 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-sm font-medium tracking-wide text-[#1A1A1A] hover:text-[#8A6B3F]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
