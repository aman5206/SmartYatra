'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SEED_DESTINATIONS } from '@/data/seed-data';
import {
  Layers,
  Building2,
  Utensils,
  PlusSquare,
  Car,
  Bike,
  Star,
  Phone,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

function NearbyServicesContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialDest = searchParams.get('dest') || 'all';

  const [selectedDest, setSelectedDest] = useState(initialDest);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Aggregate services from destinations
  const allServices = SEED_DESTINATIONS.flatMap((d) =>
    d.nearbyServices.map((s) => ({
      ...s,
      destinationName: d.name,
      destinationSlug: d.slug,
      state: d.state,
    }))
  );

  const filtered = allServices.filter((s) => {
    const matchDest = selectedDest === 'all' || s.destinationSlug === selectedDest;
    const matchCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchDest && matchCat;
  });

  const categories = [
    { id: 'all', label: 'All Services', icon: Layers },
    { id: 'HOSPITAL', label: 'Hospitals & Emergency', icon: PlusSquare },
    { id: 'HOTEL', label: 'Hotels & Heritage Stays', icon: Building2 },
    { id: 'RESTAURANT', label: 'Restaurants & Cafes', icon: Utensils },
    { id: 'CAB', label: 'Authorized Cabs & Taxis', icon: Car },
    { id: 'BIKE_RENTAL', label: 'Bike & Scooter Rentals', icon: Bike },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Local Logistics & Safety</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Nearby Travel Services
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Verified emergency medical care, authentic dining landmarks, hotels, and authorized taxi stands across destinations.
        </p>
      </div>

      {/* Transparency Note */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Listing Transparency: Government hospitals and heritage culinary institutions are <strong>Verified Live</strong>.
            Sample hotels and rental outlets are clearly labeled as <strong>Sample Listings</strong>.
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Destination Selector */}
          <div className="w-full sm:w-72">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select City / Region:
            </label>
            <select
              value={selectedDest}
              onChange={(e) => setSelectedDest(e.target.value)}
              className="w-full py-2 px-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Indian Destinations</option>
              {SEED_DESTINATIONS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Service Count */}
          <div className="text-xs text-slate-500 self-end">
            Showing <strong>{filtered.length}</strong> service listing{filtered.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-orange-300 transition"
          >
            <div className="space-y-3">
              {/* Category & Verified Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {item.category.replace('_', ' ')}
                </span>

                {item.isSample ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                    Sample Listing
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Live
                  </span>
                )}
              </div>

              {/* Title & Rating */}
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.name}</h3>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal ml-1">
                    • {item.destinationName}, {item.state}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{item.address}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium truncate">{item.contactInfo || 'Contact details at local kiosk'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NearbyServicesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">Loading nearby services...</div>}>
      <NearbyServicesContent />
    </Suspense>
  );
}
