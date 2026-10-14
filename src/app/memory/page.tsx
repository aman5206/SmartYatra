'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DestinationCard } from '@/components/DestinationCard';
import { DestinationItem } from '@/data/seed-data';
import {
  Bookmark,
  Search,
  Trash2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function TravelMemoryPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'saved' | 'searches'>('saved');
  const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/saved-places').then((r) => (r.ok ? r.json() : { savedPlaces: [] })),
      fetch('/api/searches').then((r) => (r.ok ? r.json() : { searches: [] })),
    ])
      .then(([savedData, searchData]) => {
        setSavedPlaces(savedData.savedPlaces || []);
        setSearches(searchData.searches || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleClearSearches = async () => {
    if (!confirm('Are you sure you want to clear your in-app search history?')) return;
    try {
      const res = await fetch('/api/searches', { method: 'DELETE' });
      if (res.ok) {
        setSearches([]);
        setMessage('In-app search history permanently wiped.');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          <Bookmark className="w-4 h-4" />
          <span>Website Activity Only</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Travel Memory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Review destinations you&apos;ve favorited and search journeys conducted exclusively on SmartYatra.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-amber-800 dark:text-amber-300 block">
            Strict In-App Privacy Boundary
          </strong>
          <span>
            SmartYatra only displays searches and favorites recorded directly on this platform. We never access your
            device&apos;s browser history, cookies from other websites, or external applications.
          </span>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-700 text-xs font-medium">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'border-orange-600 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Places ({savedPlaces.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('searches')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'searches'
              ? 'border-orange-600 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>In-App Searches ({searches.length})</span>
        </button>
      </div>

      {/* Tab 1: Saved Places */}
      {activeTab === 'saved' && (
        <div>
          {savedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {savedPlaces.map((item) =>
                item.destination ? (
                  <DestinationCard
                    key={item.id}
                    destination={item.destination as DestinationItem}
                    initialSaved={true}
                  />
                ) : null
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                No Saved Places Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the heart icon on any destination card to save places to your personal travel memory.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700"
              >
                <span>Explore Destinations</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Searches */}
      {activeTab === 'searches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Recent search terms logged within this application:
            </span>
            {searches.length > 0 && (
              <button
                onClick={handleClearSearches}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Search History
              </button>
            )}
          </div>

          {searches.length > 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {searches.map((s) => (
                <div
                  key={s.id}
                  className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-orange-500" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block text-sm">
                        &quot;{s.query}&quot;
                      </strong>
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(s.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/explore?q=${encodeURIComponent(s.query)}`}
                    className="flex items-center gap-1 text-orange-600 font-semibold text-xs hover:underline"
                  >
                    Repeat Search <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                No Search History Recorded
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When you search for places in SmartYatra while logged in, your recent queries will be cataloged here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
