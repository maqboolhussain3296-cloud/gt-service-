import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, Star, Truck, Wallet } from 'lucide-react';
import { City, HeroSlide } from '../types';

interface HeroCarouselProps {
  slides: HeroSlide[];
  selectedCity: City;
  onOrderSlide: (productId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides,
  selectedCity,
  onOrderSlide,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const currentSlide = slides[activeIndex] || slides[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section id="top" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-6">
      {/* Main Hero Slider */}
      <div
        className="relative w-full h-[300px] sm:h-[380px] lg:h-[430px] rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200/70"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              idx === activeIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
          </div>
        ))}

        {/* Overlay Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-md bg-white/95 text-slate-900 text-xs font-semibold shadow-xs">
              {currentSlide.badge}
            </span>
          </div>

          <div className="max-w-xl">
            <div className="inline-block px-2.5 py-1 rounded-md bg-black/55 backdrop-blur-xs text-emerald-300 text-xs sm:text-sm font-semibold tabular-nums mb-2">
              Rs {currentSlide.price}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight [text-wrap:balance]">
              {currentSlide.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-100/95 mt-1.5 sm:mt-2">
              {currentSlide.subtitle}
            </p>
            <div className="mt-4 sm:mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOrderSlide(currentSlide.productId)}
                className="h-11 px-6 rounded-lg bg-white hover:bg-emerald-50 text-slate-900 text-sm font-bold transition-colors shadow-sm cursor-pointer"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* Prev / Next Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous dish"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next dish"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4-Column Service Guarantees Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">Fast Delivery</div>
            <div className="text-xs text-slate-500 truncate">30-45 min, {selectedCity}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">Free Delivery</div>
            <div className="text-xs text-slate-500 truncate">Rs 1000+ ke order par</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">Easy Payment</div>
            <div className="text-xs text-slate-500 truncate">Cash / JazzCash / Easypaisa</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
              <span className="tabular-nums">4.8</span>
              <span>Rated</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="text-xs text-slate-500 truncate">Verified shops aur riders</div>
          </div>
        </div>
      </div>
    </section>
  );
};
