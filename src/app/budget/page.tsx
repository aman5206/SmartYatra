'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Wallet,
  Building,
  Utensils,
  Car,
  Ticket,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function BudgetCalculatorPage() {
  const { t } = useLanguage();

  const [destinationType, setDestinationType] = useState('Heritage');
  const [durationDays, setDurationDays] = useState(4);
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelStyle, setTravelStyle] = useState<'Budget' | 'Comfortable' | 'Luxury'>('Comfortable');

  // Baseline daily per-person rates in INR
  const baseRates = {
    Heritage: { accommodation: 1200, food: 600, transport: 500, activities: 350, misc: 250 },
    HillStation: { accommodation: 1500, food: 700, transport: 700, activities: 400, misc: 300 },
    Spiritual: { accommodation: 900, food: 500, transport: 400, activities: 250, misc: 200 },
    HighAltitude: { accommodation: 1800, food: 800, transport: 1200, activities: 500, misc: 400 },
    Coastal: { accommodation: 1600, food: 900, transport: 600, activities: 600, misc: 350 },
  };

  const styleMultipliers = {
    Budget: 0.65,
    Comfortable: 1.0,
    Luxury: 2.4,
  };

  const currentBase = baseRates[destinationType as keyof typeof baseRates] || baseRates.Heritage;
  const mult = styleMultipliers[travelStyle];

  const dailyAccom = Math.round(currentBase.accommodation * mult);
  const dailyFood = Math.round(currentBase.food * mult);
  const dailyTransport = Math.round(currentBase.transport * mult);
  const dailyActivities = Math.round(currentBase.activities * mult);
  const dailyMisc = Math.round(currentBase.misc * mult);

  const dailyPerPerson = dailyAccom + dailyFood + dailyTransport + dailyActivities + dailyMisc;
  const totalPerPerson = dailyPerPerson * durationDays;
  const grandTotal = totalPerPerson * travelersCount;

  const totalAccom = dailyAccom * durationDays * travelersCount;
  const totalFood = dailyFood * durationDays * travelersCount;
  const totalTransport = dailyTransport * durationDays * travelersCount;
  const totalActivities = dailyActivities * durationDays * travelersCount;
  const totalMisc = dailyMisc * durationDays * travelersCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Calculator className="w-4 h-4" />
          <span>Transparent Indian Travel Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Travel Budget Calculator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Calculate realistic, itemized trip expenses in Indian Rupees (₹ INR) across accommodation, dining, transport, and experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls (Left) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Trip Parameters
          </h2>

          {/* Destination Type */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Destination Classification
            </label>
            <select
              value={destinationType}
              onChange={(e) => setDestinationType(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
            >
              <option value="Heritage">Heritage Royal City (e.g. Jaipur, Hampi)</option>
              <option value="HillStation">Hill Station & Valleys (e.g. Munnar, Shimla)</option>
              <option value="Spiritual">Spiritual Riverfront (e.g. Varanasi, Rishikesh)</option>
              <option value="HighAltitude">High-Altitude Desert (e.g. Leh & Ladakh)</option>
              <option value="Coastal">Coastal & Beaches (e.g. Goa, Alleppey)</option>
            </select>
          </div>

          {/* Travel Style */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Travel Comfort Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Budget', 'Comfortable', 'Luxury'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                    travelStyle === style
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              {travelStyle === 'Budget' && 'Hostels/homestays, authentic street thalis, public transit, shared autos.'}
              {travelStyle === 'Comfortable' && '3-star boutique hotels, verified dining cafes, AC taxis, guided tours.'}
              {travelStyle === 'Luxury' && 'Palace heritage properties, fine-dining restaurants, private chauffeurs.'}
            </p>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Trip Duration:
              </span>
              <span className="font-bold text-orange-600">{durationDays} Days</span>
            </div>
            <input
              type="range"
              min={1}
              max={21}
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
              className="w-full accent-orange-600"
            />
          </div>

          {/* Travelers Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Number of Travelers:
              </span>
              <span className="font-bold text-emerald-600">{travelersCount} Person{travelersCount > 1 ? 's' : ''}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={travelersCount}
              onChange={(e) => setTravelersCount(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600"
            />
          </div>

          {/* Quick CTA to planner */}
          <Link
            href="/planner"
            className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Itinerary With This Budget</span>
          </Link>
        </div>

        {/* Results Breakdown (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Total Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-emerald-700 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-white/90">
              <span className="uppercase tracking-wider font-semibold">
                Estimated Total Trip Cost ({durationDays} Days, {travelersCount} Traveler{travelersCount > 1 ? 's' : ''})
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 font-bold text-[10px]">
                {travelStyle} Tier
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black tracking-tight">
              ₹{grandTotal.toLocaleString('en-IN')}
            </div>

            <div className="pt-3 border-t border-white/20 flex flex-wrap items-center justify-between text-xs text-white/90 gap-2">
              <div>
                Average Per Person: <strong>₹{totalPerPerson.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                Daily Per Person: <strong>₹{dailyPerPerson.toLocaleString('en-IN')} / day</strong>
              </div>
            </div>
          </div>

          {/* Itemized Categories Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-orange-500" />
              <span>Itemized Expense Breakdown (All Travelers)</span>
            </h3>

            <div className="space-y-3">
              {/* Accommodation */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Accommodation (Hotels / Haveli)
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      ~₹{dailyAccom.toLocaleString('en-IN')} / person / night
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ₹{totalAccom.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Food */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Food & Regional Dining
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Breakfast, thalis, local tea & snacks (~₹{dailyFood.toLocaleString('en-IN')}/day)
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ₹{totalFood.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Transport */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Local Transport & Cabs
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Autos, airport cabs, day sightseeing (~₹{dailyTransport.toLocaleString('en-IN')}/day)
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ₹{totalTransport.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Activities */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Monuments & Activity Tickets
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      ASI monument entry, boat rides, national parks
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ₹{totalActivities.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Misc */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Contingency & Souvenirs
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Emergency reserve, tips, shopping souvenirs
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ₹{totalMisc.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Legal / Transparency Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-800 dark:text-amber-300 block mb-0.5">
                [Sample Estimate Disclaimer]
              </strong>
              These estimates represent realistic statistical averages calculated for Indian tourism destinations. They
              do not constitute confirmed quotes, live hotel inventory, or transport bookings. Actual pricing may vary
              during major festivals (e.g. Diwali, Pushkar Fair, Kumbh Mela).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
