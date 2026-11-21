import React, { useState } from 'react';
import { ChevronDown, MapPin, Search, ShoppingCart, User, Bike, X } from 'lucide-react';
import { City, CustomerUser } from '../types';
import { GTLogo } from './GTLogo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: City;
  onCityChange: (city: City) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onScrollToRider: () => void;
  customerUser: CustomerUser | null;
}

const CITIES: City[] = ['Khanewal', 'Kabirwala', 'Mian Channu'];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  cartCount,
  onOpenCart,
  onOpenLogin,
  onScrollToRider,
  customerUser,
}) => {
  const [cityMenuOpen, setCityMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Slim Top Promo Banner */}
      <div className="bg-[#006A4E] text-white text-center px-3 py-1.5 text-xs font-medium tracking-tight">
        <span>
          {selectedCity} me free delivery — Rs 1000+ ke order par · 30-45 min me ghar tak
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 md:gap-6">
        {/* Brand Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg"
        >
          <div className="w-11 h-10 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center p-0.5 shadow-xs">
            <GTLogo className="w-10 h-9" />
          </div>
          <div className="leading-tight">
            <span className="font-display font-extrabold text-base sm:text-lg text-[#0B1F4D] block whitespace-nowrap">
              GT Service
            </span>
            <span className="hidden sm:block text-[11px] text-slate-500 whitespace-nowrap">
              Sab kuch, bharose ke saath
            </span>
          </div>
        </a>

        {/* Search Input */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Biryani, Panadol, doodh..."
            aria-label="Search food, medicine, or grocery"
            className="w-full h-10 pl-10 pr-8 rounded-full bg-slate-100/90 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* City Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCityMenuOpen((prev) => !prev)}
              className="h-10 px-2.5 sm:px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {cityMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setCityMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-20">
                  <div className="px-3 py-1 text-[11px] font-medium text-slate-400">
                    Delivery Area
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        onCityChange(city);
                        setCityMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        selectedCity === city
                          ? 'text-emerald-800 font-semibold bg-emerald-50/60'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <span className="text-[11px] text-emerald-700 font-medium">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={onOpenLogin}
            className="h-10 px-2.5 sm:px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="max-w-[90px] truncate">
              {customerUser ? customerUser.name.split(' ')[0] : 'Login'}
            </span>
          </button>

          {/* Become Rider CTA */}
          <button
            type="button"
            onClick={onScrollToRider}
            className="hidden lg:inline-flex h-10 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <Bike className="w-4 h-4 shrink-0" />
            <span>Become Rider</span>
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="h-10 px-3 sm:px-4 rounded-lg bg-[#007A4D] hover:bg-[#00633E] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors shadow-xs"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>Cart</span>
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-white text-[#007A4D] text-xs font-bold flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Biryani, Panadol, doodh..."
            aria-label="Search food, medicine, or grocery"
            className="w-full h-10 pl-10 pr-8 rounded-full bg-slate-100 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
