import React, { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { LogOut, Package, User, X } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { City, CustomerUser, Order } from '../types';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: City;
  customerUser: CustomerUser | null;
  orders: Order[];
  onLogin: (user: CustomerUser) => void;
  onLogout: () => void;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  customerUser,
  orders,
  onLogin,
  onLogout,
}) => {
  const [name, setName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setLoadingGoogle(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin({
        uid: result.user.uid,
        name: result.user.displayName || result.user.email?.split('@')[0] || 'Customer',
        email: result.user.email || undefined,
        phone: phone.trim() || '0300-0000000',
        city: selectedCity,
      });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onLogin({
      uid: customerUser?.uid,
      email: customerUser?.email,
      name: name.trim(),
      phone: phone.trim(),
      city: selectedCity,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore if not signed into Firebase Auth
    }
    onLogout();
  };

  const userOrders = customerUser
    ? orders.filter(
        (o) =>
          (customerUser.uid && o.userId === customerUser.uid) ||
          o.phone === customerUser.phone ||
          o.customerName.toLowerCase() === customerUser.name.toLowerCase()
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 z-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close login modal"
          className="absolute right-4 top-4 w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {customerUser ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-lg text-slate-900 truncate">
                  {customerUser.name}
                </h2>
                <p className="text-xs text-slate-500 tabular-nums truncate">
                  {customerUser.phone} · {customerUser.city}
                  {customerUser.email ? ` · ${customerUser.email}` : ''}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Aapke Orders ({userOrders.length})
              </h3>
              {userOrders.length === 0 ? (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center text-xs text-slate-500">
                  Abhi koi order place nahi hua.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="tabular-nums">#{order.id}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {order.itemsSummary ||
                            order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-slate-900 tabular-nums">
                          Rs {order.total.toLocaleString()}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700">
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex-1 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl bg-[#007A4D] hover:bg-[#00633E] text-white text-xs font-semibold cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900">Customer Login</h2>
              <p className="text-xs text-slate-500 mt-1">
                Google se sign in karain taake aapke orders live save aur track hon.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className="w-full h-11 rounded-xl bg-[#007A4D] hover:bg-[#00633E] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {loadingGoogle ? 'Signing in...' : 'Continue with Google'}
            </button>

            {authError && (
              <div className="text-xs text-rose-600 text-center">{authError}</div>
            )}

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="shrink mx-3 text-[11px] font-medium text-slate-400">
                ya Quick Guest Info
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="cust-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  id="cust-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bilal Khan"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label htmlFor="cust-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03xx-xxxxxxx"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:bg-white focus:border-emerald-600 tabular-nums"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Continue as Guest
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Band Karain
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
