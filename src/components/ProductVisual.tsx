import React, { useState } from 'react';
import { Package, Pill, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { VisualType } from '../types';

interface ProductVisualProps {
  name: string;
  image?: string;
  visualType: VisualType;
  mainGroup?: string;
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  name,
  image,
  visualType,
  mainGroup = 'Food',
  className = 'w-full h-full object-cover',
}) => {
  const [imgError, setImgError] = useState(false);

  if (visualType === 'image' && image && !imgError) {
    return (
      <img
        src={image}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={className}
      />
    );
  }

  // Crisp studio packaging illustrations for pharmaceutical & pantry items
  if (visualType === 'medicine-panadol') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="relative flex items-center gap-3">
          <div className="w-24 h-32 rounded-xl bg-white border border-sky-200 shadow-sm p-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-tight text-sky-700">PANADOL</span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            </div>
            <div className="grid grid-cols-2 gap-1.5 my-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3.5 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300/80 shadow-inner"
                />
              ))}
            </div>
            <span className="text-[9px] font-medium text-slate-500">500mg · Extra</span>
          </div>
          <div className="w-20 h-28 rounded-lg bg-sky-700 text-white p-2.5 shadow-md flex flex-col justify-between -rotate-3">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-sky-200">Pharmacy</div>
            <div>
              <div className="text-xs font-bold leading-tight">Fast Pain Relief</div>
              <div className="text-[10px] text-sky-100 mt-0.5">10 Tablets</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'medicine-brufen') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <div className="w-28 h-24 rounded-xl bg-white border border-rose-200 shadow-sm p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-700">BRUFEN 400</span>
              <Pill className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full bg-rose-400/90 border border-rose-500/40" />
              ))}
            </div>
            <span className="text-[9px] text-slate-500">Ibuprofen Tablets</span>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'medicine-prescription') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="w-40 rounded-xl bg-white border border-emerald-200 shadow-sm p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Rx Verified</span>
            <Pill className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="h-1.5 w-full rounded bg-emerald-600" />
          <div className="text-sm font-bold text-slate-900 leading-tight">Augmentin 625mg</div>
          <div className="text-[11px] text-slate-500">Co-amoxiclav · Sealed Box</div>
        </div>
      </div>
    );
  }

  if (visualType === 'medicine-syrup') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-indigo-50 via-white to-sky-50 flex items-center justify-center p-4">
        <div className="flex items-end gap-3">
          <div className="w-14 h-28 rounded-t-2xl rounded-b-lg bg-amber-900/90 border border-amber-950/20 shadow-md flex flex-col items-center justify-between py-2 px-1.5">
            <div className="w-8 h-3 bg-slate-200 rounded-sm -mt-3 border border-slate-300" />
            <div className="w-full bg-white rounded p-1 text-center">
              <div className="text-[8px] font-bold text-indigo-800">SYRUP</div>
              <div className="text-[7px] text-slate-500">120ml</div>
            </div>
          </div>
          <div className="w-20 h-24 rounded-lg bg-white border border-indigo-200 shadow-sm p-2.5 flex flex-col justify-between">
            <span className="text-[9px] font-bold text-indigo-700">COUGH RELIEF</span>
            <span className="text-[10px] text-slate-600 leading-snug">Soothing Syrup</span>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === 'grocery-rice') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-32 h-36 rounded-2xl bg-gradient-to-b from-amber-100 to-amber-200/80 border border-amber-300 shadow-sm p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-900">
            <span>SUPER KERNEL</span>
            <span>5 KG</span>
          </div>
          <div className="bg-white/95 rounded-lg p-2 text-center border border-amber-200">
            <div className="text-xs font-extrabold text-emerald-900">BASMATI RICE</div>
            <div className="text-[10px] text-amber-800 mt-0.5">Aged Long Grain</div>
          </div>
          <div className="text-[9px] text-center font-medium text-amber-900/80">Khanewal Mandi Choice</div>
        </div>
      </div>
    );
  }

  if (visualType === 'grocery-atta') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-stone-100 via-amber-50 to-stone-50 flex items-center justify-center p-4">
        <div className="w-32 h-36 rounded-2xl bg-stone-200/80 border border-stone-300 shadow-sm p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-700">
            <span>CHAKKI ATTA</span>
            <span>10 KG</span>
          </div>
          <div className="bg-white rounded-lg p-2 text-center border border-stone-200">
            <div className="text-xs font-extrabold text-stone-900">WHOLE WHEAT</div>
            <div className="text-[10px] text-stone-600 mt-0.5">Fresh Stone Ground</div>
          </div>
          <div className="text-[9px] text-center text-stone-600">Pure & Unbleached</div>
        </div>
      </div>
    );
  }

  if (visualType === 'grocery-oil') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-yellow-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="w-24 h-32 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-400 border border-amber-500/30 shadow-sm p-2.5 flex flex-col justify-between">
          <div className="text-[9px] font-bold text-amber-950 text-center">1 LITRE POUCH</div>
          <div className="bg-white rounded-lg p-2 text-center shadow-xs">
            <div className="text-xs font-extrabold text-emerald-800">PURE OIL</div>
            <div className="text-[9px] text-slate-600">Vitamin A & D</div>
          </div>
          <div className="text-[8px] font-semibold text-amber-950 text-center">Cholesterol Free</div>
        </div>
      </div>
    );
  }

  if (visualType === 'grocery-tea') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="w-28 h-32 rounded-xl bg-emerald-900 text-white p-3 shadow-md flex flex-col justify-between">
          <div className="text-[9px] font-semibold text-amber-300 tracking-wider uppercase">Danedar</div>
          <div>
            <div className="text-sm font-extrabold leading-tight">Kadak Chai</div>
            <div className="text-[10px] text-emerald-200 mt-0.5">450g Family Pack</div>
          </div>
          <div className="h-1 w-10 bg-amber-400 rounded-full" />
        </div>
      </div>
    );
  }

  // Fallback container if image fails to load
  const Icon =
    mainGroup === 'Medicine'
      ? Pill
      : mainGroup === 'Grocery'
      ? ShoppingBag
      : mainGroup === 'Food'
      ? UtensilsCrossed
      : Package;

  return (
    <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-semibold text-slate-700 line-clamp-2 max-w-[160px]">{name}</span>
    </div>
  );
};
