'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DestinationItem, SEED_DESTINATIONS } from '@/data/seed-data';
import { DestinationCard } from '@/components/DestinationCard';
import { Search, Filter, Compass, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

function ExploreContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState('all');
  const [destinations, setDestinations] = useState<DestinationItem[]>(SEED_DESTINATIONS);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Themes' },
    { id: 'history', label: 'Royal Heritage' },
    { id: 'spirituality', label: 'Sacred Spirituality' },
    { id: 'nature', label: 'Nature & Hills' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'culture', label: 'Culture & Arts' },
    { id: 'food', label: 'Culinary Trails' },
  ];

  const states = ['all', 'Rajasthan', 'Uttar Pradesh', 'Kerala', 'Ladakh (UT)', 'Karnataka', 'Uttarakhand'];

  useEffect(() => {
    setLoading(true);
    let filtered = [...SEED_DESTINATIONS];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.overview.toLowerCase().includes(q) ||
          d.speciality.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((d) => d.tags.includes(selectedCategory));
    }

    if (selectedState !== 'all') {
      filtered = filtered.filter((d) => d.state === selectedState);
    }

    setDestinations(filtered);
    setLoading(false);
  }, [query, selectedCategory, selectedState]);

  const handleReset = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedState('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Discover Authentic India</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Destinations
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Search places, verified historical accounts, and estimated daily travel costs across India.
          </p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Curated Sample Data • Hackathon Prototype
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city, monument, spice, or state..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* State Filter */}
          <div className="sm:w-56">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'all' ? 'All Indian Regions' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          {(query || selectedCategory !== 'all' || selectedState !== 'all') && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Themes:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{destinations.length}</strong> destination{destinations.length === 1 ? '' : 's'}
        </span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> All facts verified with archaeological and state records
        </span>
      </div>

      {/* Grid */}
      {destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No destinations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find matches for &quot;{query}&quot;. Try adjusting your search keywords or switching filters.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">Loading destinations...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
