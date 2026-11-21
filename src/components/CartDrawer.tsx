import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { CartItem, City, CustomerUser, Order, PaymentMethod } from '../types';
import { ProductVisual } from './ProductVisual';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedCity: City;
  customerUser: CustomerUser | null;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: (details: {
    customerName: string;
    phone: string;
    city: City;
    address: string;
    paymentMethod: PaymentMethod;
  }) => Order;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  selectedCity,
  customerUser,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
}) => {
  const [customerName, setCustomerName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const hasCustomItems = items.some((i) => i.isCustom);
  const qualifiesFreeDelivery = subtotal >= 1000;
  const deliveryFee = items.length === 0 || qualifiesFreeDelivery ? 0 : 80;
  const total = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, 1000 - subtotal);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !customerName.trim() || !phone.trim() || !address.trim()) return;
    const order = onPlaceOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: selectedCity,
      address: address.trim(),
      paymentMethod,
    });
    setConfirmedOrder(order);
    setAddress('');
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-emerald-700" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              {confirmedOrder ? 'Order Confirmed' : 'Aapka Cart'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
            className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed Order Receipt */}
        {confirmedOrder ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center">
                <CheckCircle2 className="w-11 h-11 text-emerald-700 mx-auto mb-2.5" />
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Order #{confirmedOrder.id} Confirmed
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mt-1">
                  Rider assign ho raha hai
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {confirmedOrder.city} me 30-45 min me delivery hogi.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-medium text-slate-900 tabular-nums">{confirmedOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment</span>
                  <span className="font-medium text-slate-900">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Address</span>
                  <span className="font-medium text-slate-900 text-right">{confirmedOrder.address}</span>
                </div>
                <div className="pt-2.5 border-t border-slate-100 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="tabular-nums text-emerald-800">
                    Rs {confirmedOrder.total.toLocaleString()}
                    {confirmedOrder.hasCustomItems ? ' + custom' : ''}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full h-11 rounded-xl bg-[#007A4D] hover:bg-[#00633E] text-white text-sm font-semibold cursor-pointer"
            >
              Back to GT Service
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">Cart khali hai</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              Biryani, Panadol, doodh ya koi bhi custom cheez add karain aur 30-45 min me ghar mangwayein.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-5 h-10 px-5 rounded-xl bg-[#007A4D] text-white text-sm font-semibold hover:bg-[#00633E] cursor-pointer"
            >
              Items Dekhain
            </button>
          </div>
        ) : (
          /* Active Cart + Checkout Form */
          <form onSubmit={handleCheckout} className="flex-1 overflow-y-auto flex flex-col">
            {/* Free Delivery Progress */}
            <div className="px-5 py-3 bg-emerald-50/70 border-b border-emerald-100 text-xs">
              {qualifiesFreeDelivery ? (
                <span className="font-semibold text-emerald-800">
                  Mubarak! Aapko {selectedCity} me Free Delivery mil rahi hai.
                </span>
              ) : (
                <span className="text-slate-700">
                  Free delivery ke liye{' '}
                  <strong className="tabular-nums text-emerald-800">
                    Rs {remainingForFree.toLocaleString()}
                  </strong>{' '}
                  ka mazeed order karain (Rs 1000+ par free).
                </span>
              )}
            </div>

            {/* Cart Items */}
            <div className="p-5 space-y-3 border-b border-slate-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 bg-slate-50/80 border border-slate-200/70 rounded-xl p-3"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                    <ProductVisual
                      name={item.name}
                      image={item.image}
                      visualType={item.visualType || 'image'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {item.isCustom ? item.note || 'Custom shop order' : item.vendor}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {item.price !== null
                          ? `Rs ${(item.price * item.quantity).toLocaleString()}`
                          : 'Price confirm on call'}
                      </span>
                      <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1.5 text-xs font-bold tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="w-6 h-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery & Payment Details */}
            <div className="p-5 space-y-3.5 flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Delivery Details ({selectedCity})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Aapka naam"
                  className="h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:bg-white focus:border-emerald-600"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03xx-xxxxxxx"
                  className="h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:bg-white focus:border-emerald-600 tabular-nums"
                />
              </div>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={`Ghar / Mohalla / Street (${selectedCity})`}
                className="w-full h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:bg-white focus:border-emerald-600"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cash on Delivery', 'JazzCash', 'Easypaisa'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`h-9 px-2 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer truncate ${
                        paymentMethod === method
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary & Place Order Sticky Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    Rs {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total</span>
                  <span className="tabular-nums text-emerald-800">
                    Rs {total.toLocaleString()}
                    {hasCustomItems ? ' + custom' : ''}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#007A4D] hover:bg-[#00633E] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Order Confirm Karain
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
