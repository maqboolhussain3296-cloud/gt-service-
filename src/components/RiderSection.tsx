import React, { useState } from 'react';
import { Bike, Check, Star } from 'lucide-react';
import { City, Rider, RiderApplication, VehicleType } from '../types';

interface RiderSectionProps {
  riders: Rider[];
  onSubmitApplication: (app: Omit<RiderApplication, 'id' | 'status' | 'submittedAt'>) => void;
}

export const RiderSection: React.FC<RiderSectionProps> = ({ riders, onSubmitApplication }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState<VehicleType>('Bike');
  const [city, setCity] = useState<City>('Khanewal');
  const [cnic, setCnic] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !cnic.trim()) return;
    onSubmitApplication({
      fullName: fullName.trim(),
      phone: phone.trim(),
      vehicle,
      city,
      cnic: cnic.trim(),
    });
    setFullName('');
    setPhone('');
    setCnic('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="rider-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-12">
      <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recruitment Info + Active Riders */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-md bg-white border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-3">
              Rider Bano
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
              Kamao Rs 40,000+/month apni timing par.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Bike ya cycle — Khanewal me apna waqt, apni kamai. Daily payments, fuel support aur GT
              Rider community.
            </p>
          </div>

          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>Daily payment, koi waiting nahi</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>Flexible shifts — jab chahein, tab kaam</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span>Khanewal, Kabirwala aur Mian Channu coverage</span>
            </li>
          </ul>

          {/* 3 Stat Tiles */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-emerald-200/70 rounded-xl p-3.5 text-center">
              <div className="font-display font-extrabold text-base sm:text-lg text-slate-900 tabular-nums">
                Rs 40k+
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Monthly</div>
            </div>
            <div className="bg-white border border-emerald-200/70 rounded-xl p-3.5 text-center">
              <div className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                Daily
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Payment</div>
            </div>
            <div className="bg-white border border-emerald-200/70 rounded-xl p-3.5 text-center">
              <div className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                Flexible
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Timing</div>
            </div>
          </div>

          {/* Active Riders List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Active Riders
            </h3>
            <div className="space-y-2">
              {riders.map((rider) => (
                <div
                  key={rider.id}
                  className="bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Bike className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{rider.name}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {rider.vehicle} <span aria-hidden="true">·</span> {rider.city}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {rider.rating.toFixed(1)}
                    </div>
                    <div className="text-[11px] text-slate-500 tabular-nums">{rider.trips} trips</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Rider Application Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4"
        >
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              Rider Application
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Form bharain — team contact karegi.
            </p>
          </div>

          <div>
            <label htmlFor="rider-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full name
            </label>
            <input
              id="rider-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Apna naam"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>

          <div>
            <label htmlFor="rider-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phone number
            </label>
            <input
              id="rider-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 tabular-nums"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rider-vehicle" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Vehicle
              </label>
              <select
                id="rider-vehicle"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value as VehicleType)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
              >
                <option value="Bike">Bike</option>
                <option value="Cycle">Cycle</option>
                <option value="Car / Rickshaw">Car / Rickshaw</option>
              </select>
            </div>

            <div>
              <label htmlFor="rider-city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                City
              </label>
              <select
                id="rider-city"
                value={city}
                onChange={(e) => setCity(e.target.value as City)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-600"
              >
                <option value="Khanewal">Khanewal</option>
                <option value="Kabirwala">Kabirwala</option>
                <option value="Mian Channu">Mian Channu</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="rider-cnic" className="block text-xs font-semibold text-slate-700 mb-1.5">
              CNIC number
            </label>
            <input
              id="rider-cnic"
              type="text"
              required
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              placeholder="xxxxx-xxxxxxx-x"
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 tabular-nums"
            />
          </div>

          {submitted && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Aapki request submit ho gayi hai! Hamari team jald rabta karegi.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Rider Request Bhejain
          </button>
        </form>
      </div>
    </section>
  );
};
