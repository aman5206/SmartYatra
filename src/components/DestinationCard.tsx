'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DestinationItem } from '@/data/seed-data';
import { MapPin, Star, Heart, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface DestinationCardProps {
  destination: DestinationItem;
  initialSaved?: boolean;
}

export function DestinationCard({ destination, initialSaved = false }: DestinationCardProps) {
  const { language } = useLanguage();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      const res = await fetch('/api/saved-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationSlug: destination.slug }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
      } else if (res.status === 401) {
        alert('Please log in to save destinations to your Travel Memory.');
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-100">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{destination.rating.toFixed(1)}</span>
        </div>

        {/* Save to Memory Heart Button */}
        <button
          onClick={handleToggleSave}
          disabled={saving}
          aria-label={`Save ${destination.name} to memory`}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
            isSaved
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-red-500 hover:bg-white'
          }`}
          title={isSaved ? 'Saved in Travel Memory' : 'Save to Travel Memory'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* State & City Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-xs text-orange-200 font-medium mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>
              {destination.state}, {destination.country}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {language === 'hi' && destination.hindiName ? destination.hindiName : destination.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {destination.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-900/40"
            >
              {tag}
            </span>
          ))}
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        </div>

        {/* Overview Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {destination.overview}
        </p>

        {/* Speciality Highlight */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
          <strong className="text-orange-600 dark:text-orange-400">Speciality:</strong>{' '}
          <span className="line-clamp-1">{destination.speciality}</span>
        </div>

        {/* Footer info: Season & Price Estimate */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block uppercase font-medium">
              Daily Sample Est.
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              ₹{destination.practicalInfo.sampleDailyBudgetINR.toLocaleString('en-IN')}{' '}
              <span className="text-[10px] font-normal text-slate-500">/day</span>
            </span>
          </div>

          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 group-hover:translate-x-0.5 transition-transform"
          >
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
