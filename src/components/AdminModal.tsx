import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import { ADMIN_EMAIL, auth, googleProvider } from '../firebase';
import { GTLogo } from './GTLogo';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (mode: 'cloud' | 'demo') => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAdminLogin = async () => {
    setErrorMsg('');
    setIsLoadingGoogle(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const signedEmail = result.user.email?.toLowerCase();
      if (signedEmail === ADMIN_EMAIL.toLowerCase()) {
        onLoginSuccess('cloud');
      } else {
        setErrorMsg(
          `Sirf admin email (${ADMIN_EMAIL}) cloud admin panel access kar sakta hai. Aap ne ${result.user.email} se sign in kiya.`
        );
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Google sign-in mukammal nahi ho saka.'
      );
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === 'admin@gtservice.pk' && password === 'admin123') {
      setErrorMsg('');
      setPassword('');
      onLoginSuccess('demo');
    } else {
      setErrorMsg('Email ya password ghalat hai. Demo hint neechey diya gaya hai.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 z-10">
        <div className="text-center mb-4">
          <div className="w-14 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-2.5 p-1">
            <GTLogo className="w-12 h-10" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900">Admin Login</h2>
          <p className="text-xs text-slate-500 mt-0.5">GT Service control panel</p>
        </div>

        {/* Live Cloud Admin (Google Sign-In) */}
        <button
          type="button"
          onClick={handleGoogleAdminLogin}
          disabled={isLoadingGoogle}
          className="w-full h-11 rounded-xl bg-[#007A4D] hover:bg-[#00633E] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <span>{isLoadingGoogle ? 'Signing in...' : 'Sign in with Google (Live Sync)'}</span>
        </button>
        <p className="text-[11px] text-center text-slate-500 mt-1.5 mb-4">
          Google Admin se add kiye gaye categories &amp; products sab users ko live dikhain ge.
        </p>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="shrink mx-3 text-[11px] font-medium text-slate-400">
            ya Demo Login
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        <form onSubmit={handleLogin} className="space-y-3 mt-2">
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Email"
              aria-label="Admin email"
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Password"
              aria-label="Admin password"
              className="w-full h-10 pl-3.5 pr-10 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600 space-y-0.5">
            <div className="font-bold text-slate-800">Demo hint (local preview):</div>
            <div>
              Email: <span className="font-mono-num text-slate-900">admin@gtservice.pk</span>
            </div>
            <div>
              Password: <span className="font-mono-num text-slate-900">admin123</span>
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs font-medium text-rose-600 text-center px-1">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Login (Demo)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Band Karain
          </button>
        </form>
      </div>
    </div>
  );
};
