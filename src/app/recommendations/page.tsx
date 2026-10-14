'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SEED_DESTINATIONS, DestinationItem } from '@/data/seed-data';
import { DestinationCard } from '@/components/DestinationCard';
import {
  Sparkles,
  ShieldCheck,
  Check,
  Sliders,
  RotateCcw,
  EyeOff,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function RecommendationsPage() {
  const { t } = useLanguage();

  const [selectedInterests, setSelectedInterests] = useState<string[]>(['history', 'culture']);
  const [consentActivity, setConsentActivity] = useState(false);
  const [personalizationActive, setPersonalizationActive] = useState(true);
  const [savedPlacesSlugs, setSavedPlacesSlugs] = useState<string[]>([]);
  const [userSearches, setUserSearches] = useState<string[]>([]);
  const [matchedDestinations, setMatchedDestinations] = useState<
    { dest: DestinationItem; matchScore: number; matchReasons: string[] }[]
  >([]);

  const interestsList = [
    { id: 'history', label: 'History & Forts', icon: '🏛️' },
    { id: 'spirituality', label: 'Spirituality & River Ghats', icon: '🪔' },
    { id: 'nature', label: 'Nature & Backwaters', icon: '🌿' },
    { id: 'adventure', label: 'Adventure & Mountain Treks', icon: '🏔️' },
    { id: 'food', label: 'Authentic Indian Food', icon: '🍛' },
    { id: 'culture', label: 'Culture & Performing Arts', icon: '🎭' },
    { id: 'shopping', label: 'Handicrafts & Bazaars', icon: '🛍️' },
    { id: 'wildlife', label: 'Wildlife & Sanctuaries', icon: '🦏' },
  ];

  useEffect(() => {
    // Fetch preferences and user activity if logged in
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.preferences) {
          const pref = data.user.preferences;
          if (pref.interests?.length > 0) setSelectedInterests(pref.interests);
          setConsentActivity(pref.consentActivityHistory || false);
        }
      })
      .catch(() => {});

    // Fetch saved places
    fetch('/api/saved-places')
      .then((res) => (res.ok ? res.json() : { savedPlaces: [] }))
      .then((data) => {
        setSavedPlacesSlugs((data.savedPlaces || []).map((s: any) => s.destinationSlug));
      })
      .catch(() => {});

    // Fetch in-app searches
    fetch('/api/searches')
      .then((res) => (res.ok ? res.json() : { searches: [] }))
      .then((data) => {
        setUserSearches((data.searches || []).map((s: any) => s.query.toLowerCase()));
      })
      .catch(() => {});
  }, []);

  // Compute personalized affinity
  useEffect(() => {
    if (!personalizationActive) {
      // Default non-personalized order
      setMatchedDestinations(
        SEED_DESTINATIONS.map((dest) => ({
          dest,
          matchScore: 50,
          matchReasons: ['Standard recommendation (Personalization Disabled)'],
        }))
      );
      return;
    }

    const scored = SEED_DESTINATIONS.map((dest) => {
      let score = 30; // base score
      const reasons: string[] = [];

      // Interest tag matching
      const matchingTags = dest.tags.filter((tag) => selectedInterests.includes(tag));
      if (matchingTags.length > 0) {
        score += matchingTags.length * 20;
        reasons.push(`Matches selected interests: ${matchingTags.join(', ')}`);
      }

      // If user consented to activity history matching
      if (consentActivity) {
        if (savedPlacesSlugs.includes(dest.slug)) {
          score += 15;
          reasons.push('Saved in your personal travel memory');
        }

        const searched = userSearches.some(
          (q) =>
            dest.name.toLowerCase().includes(q) ||
            dest.state.toLowerCase().includes(q) ||
            dest.tags.some((t) => t.includes(q))
        );
        if (searched) {
          score += 15;
          reasons.push('Aligned with your recent in-app searches');
        }
      }

      const finalScore = Math.min(score, 98);
      return { dest, matchScore: finalScore, matchReasons: reasons };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    setMatchedDestinations(scored);
  }, [selectedInterests, consentActivity, personalizationActive, savedPlacesSlugs, userSearches]);

  const toggleInterest = (id: string) => {
    const updated = selectedInterests.includes(id)
      ? selectedInterests.filter((i) => i !== id)
      : [...selectedInterests, id];
    setSelectedInterests(updated);

    // Sync to user preferences
    fetch('/api/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interests: updated }),
    }).catch(() => {});
  };

  const handleToggleConsent = (val: boolean) => {
    setConsentActivity(val);
    fetch('/api/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consentActivityHistory: val }),
    }).catch(() => {});
  };

  const handleResetPreferences = () => {
    setSelectedInterests([]);
    setConsentActivity(false);
    fetch('/api/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interests: [], consentActivityHistory: false }),
    }).catch(() => {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Private & Consent-Driven</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personalized Recommendations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Discover destinations matching your specific travel passions. We never access external app history or contacts.
        </p>
      </div>

      {/* Privacy Consent & Control Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              <span>Select Your Travel Passions</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any theme to refine your personalized match score.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPersonalizationActive(!personalizationActive)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                personalizationActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-600'
              }`}
            >
              {personalizationActive ? 'Personalization: ON' : 'Personalization: OFF'}
            </button>
            <button
              onClick={handleResetPreferences}
              className="p-1.5 text-slate-400 hover:text-red-500 text-xs flex items-center gap-1"
              title="Clear all preferences"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Interests Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {interestsList.map((item) => {
            const isSelected = selectedInterests.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleInterest(item.id)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold text-left transition ${
                  isSelected
                    ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-300 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                    isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Opt-in Activity Consent */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-2.5 max-w-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 dark:text-white block">
                Use In-App Searches & Saved Places for Personalization?
              </span>
              <p className="text-slate-500 text-[11px]">
                Under India&apos;s Digital Personal Data Protection (DPDP) Act, this is 100% opt-in. We only inspect searches
                conducted on this website.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={consentActivity}
              onChange={(e) => handleToggleConsent(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Recommended Places: <strong>{matchedDestinations.length} destinations ranked</strong>
        </span>
        <span className="text-emerald-600 font-semibold">
          High affinity matching active
        </span>
      </div>

      {/* Recommended Destinations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {matchedDestinations.map(({ dest, matchScore, matchReasons }) => (
          <div key={dest.id} className="relative flex flex-col">
            {/* Match Percentage Badge */}
            <div className="absolute -top-3 left-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-black shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>{matchScore}% Match</span>
            </div>

            <DestinationCard destination={dest} />

            {/* Why matched reason */}
            {matchReasons.length > 0 && (
              <div className="mt-2 px-3 py-1.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 text-[11px] text-orange-800 dark:text-orange-300">
                {matchReasons[0]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
