import React from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { MainGroup } from '../types';
import { GTLogo } from './GTLogo';

interface FooterProps {
  onSelectGroup: (group: MainGroup) => void;
  onScrollToRider: () => void;
  onOpenAdmin: () => void;
  isAdminAuthenticated?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectGroup,
  onScrollToRider,
  onOpenAdmin,
  isAdminAuthenticated = false,
}) => {
  const handleExploreClick = (group: MainGroup) => {
    onSelectGroup(group);
    const el = document.getElementById('catalog');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B2B26] text-slate-200 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-10 rounded-lg bg-white p-0.5 flex items-center justify-center">
              <GTLogo className="w-10 h-9" />
            </div>
            <span className="font-display font-bold text-lg text-white">GT Service</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
            Sab kuch, bharose ke saath — ghar tak. Khanewal ka apna delivery partner.
          </p>
          <p className="text-xs text-emerald-300 font-medium">Rozana: 9:00 AM - 11:00 PM</p>
        </div>

        {/* Explore Links */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-sm font-bold text-white">Explore</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <button
                type="button"
                onClick={() => handleExploreClick('Food')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Food
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleExploreClick('Medicine')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Medicine
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleExploreClick('Grocery')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Grocery
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onScrollToRider}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Become a Rider
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Admin Login */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-sm font-bold text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2 tabular-nums">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>0300-1234567</span>
            </li>
            <li className="flex items-center gap-2 tabular-nums">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp: 0300-1234567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>support@gtservice.pk</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="h-10 px-4 rounded-lg bg-[#007A4D] hover:bg-[#00633E] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {isAdminAuthenticated ? 'Open Admin Panel' : 'Admin Login'}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4 sm:px-6 text-center text-xs text-slate-400">
        © 2026 GT Service · Khanewal · Made with bharosa
      </div>
    </footer>
  );
};
