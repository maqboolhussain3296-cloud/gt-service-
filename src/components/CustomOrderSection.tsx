import React, { useState } from 'react';
import { Camera, Check, Minus, Plus, ShoppingBag } from 'lucide-react';

interface CustomOrderSectionProps {
  onAddCustomItem: (name: string, quantity: number, note: string) => void;
}

export const CustomOrderSection: React.FC<CustomOrderSectionProps> = ({ onAddCustomItem }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    onAddCustomItem(itemName.trim(), quantity, note.trim());
    setItemName('');
    setQuantity(1);
    setNote('');
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2500);
  };

  return (
    <section id="custom-order" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Explanatory Copy */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
              Kuch Bhi Mangwao
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              Menu me nahi mila? Koi baat nahi.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Kisi bhi dukan se koi bhi cheez — likh dain, hum le aayenge. Item ka naam aur note
              detail se likhain taake rider sahi cheez le aaye.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm text-slate-700">
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>Kisi bhi local shop se</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>Price pehle confirm, phir order</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>Cash on Delivery available</span>
            </li>
          </ul>

          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Photo reference</div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Agar photo available nahi hai, item ka naam aur note likhain — team aap se confirm
                kar legi.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 space-y-4">
          <div>
            <label htmlFor="custom-item-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Item ka naam *
            </label>
            <input
              id="custom-item-name"
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Dahi, Anda, dawai ka naam..."
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quantity
              </label>
              <div className="h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between px-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-slate-900 tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-8">
              <label htmlFor="custom-shop-note" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Shop / Note
              </label>
              <input
                id="custom-shop-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Kahan se lena hai?"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/70 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Preview
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {itemName.trim() || 'Aapka custom item'}
            </div>
            <div className="text-xs text-slate-600 mt-0.5 tabular-nums">
              Qty: {quantity} <span aria-hidden="true">·</span>{' '}
              {note.trim() || 'Shop note add karain'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Price rider/shop confirm karega. Aap order se pehle approve kar sakte hain.
            </p>
          </div>

          <button
            type="submit"
            disabled={!itemName.trim()}
            className="w-full h-11 rounded-xl bg-[#007A4D] hover:bg-[#00633E] disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4" />
                <span>Cart me add ho gaya!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Item to Cart</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
