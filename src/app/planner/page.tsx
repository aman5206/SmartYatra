'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SEED_DESTINATIONS } from '@/data/seed-data';
import { GeneratedTripPlan } from '@/lib/ai-service';
import {
  Calendar,
  Sparkles,
  Users,
  Wallet,
  Clock,
  Compass,
  CheckCircle2,
  Bookmark,
  Share2,
  Printer,
  ShieldCheck,
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  Lightbulb,
} from 'lucide-react';

function PlannerContent() {
  const searchParams = useSearchParams();
  const preSelectedDest = searchParams.get('dest') || 'jaipur';

  const [destinationSlug, setDestinationSlug] = useState(preSelectedDest);
  const [durationDays, setDurationDays] = useState(3);
  const [groupType, setGroupType] = useState<'Solo' | 'Couple' | 'Family' | 'Friends'>('Couple');
  const [budgetTier, setBudgetTier] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['history', 'culture']);

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedTripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedTripId, setSavedTripId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const availableInterests = [
    { id: 'history', label: 'History & Forts' },
    { id: 'spirituality', label: 'Spirituality & Temples' },
    { id: 'nature', label: 'Nature & Scenic Hills' },
    { id: 'adventure', label: 'Adventure & Treks' },
    { id: 'food', label: 'Authentic Food' },
    { id: 'culture', label: 'Art & Culture' },
    { id: 'shopping', label: 'Local Bazaars' },
    { id: 'wildlife', label: 'Wildlife Safaris' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaveMessage(null);

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationSlug,
          durationDays,
          groupType,
          budgetTier,
          interests: selectedInterests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate trip plan');
      }

      setPlan(data.plan);
      if (data.savedTripId) {
        setSavedTripId(data.savedTripId);
        setSaveMessage('Trip automatically saved to your dashboard!');
      } else if (!data.isAuthenticated) {
        setSaveMessage('Viewing in guest mode. Sign in to save this trip permanently.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with itinerary service');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered & Transparent Travel Planning</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          SmartYatra Trip Planner
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Craft practical, day-wise morning, afternoon, and evening itineraries tailored to your budget and interests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Destination Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                1. Select Destination
              </label>
              <select
                value={destinationSlug}
                onChange={(e) => setDestinationSlug(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              >
                {SEED_DESTINATIONS.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  2. Trip Duration
                </label>
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                className="w-full accent-orange-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Day (Quick)</span>
                <span>5 Days</span>
                <span>10 Days (Comprehensive)</span>
              </div>
            </div>

            {/* Travel Group Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                3. Travel Group
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Solo', 'Couple', 'Family', 'Friends'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setGroupType(type)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      groupType === type
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                4. Budget Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Budget', 'Moderate', 'Luxury'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setBudgetTier(tier)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      budgetTier === tier
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                5. Selected Interests
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableInterests.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-left transition ${
                      selectedInterests.includes(interest.id)
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-400 text-orange-700 dark:text-orange-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                        selectedInterests.includes(interest.id)
                          ? 'bg-orange-600 border-orange-600 text-white'
                          : 'border-slate-400'
                      }`}
                    >
                      {selectedInterests.includes(interest.id) && '✓'}
                    </div>
                    <span>{interest.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Authentic Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Day-by-Day Itinerary</span>
                </>
              )}
            </button>
          </form>

          {/* Safety Notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transparent AI Policy</span>
            </div>
            <p>
              Prices and timings are realistic estimates. If no AI key is active, SmartYatra uses its curated rule-based
              generator, transparently labeled below.
            </p>
          </div>
        </div>

        {/* Generated Itinerary Display (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saveMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveMessage}</span>
            </div>
          )}

          {plan ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 print:shadow-none print:border-none">
              {/* Itinerary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                      {plan.modelBadge}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{plan.groupType} Trip</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                  </button>
                </div>
              </div>

              {/* Disclaimer Alert */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                {plan.disclaimer}
              </div>

              {/* Day-by-day Itinerary Cards */}
              <div className="space-y-6">
                {plan.days.map((day) => (
                  <div
                    key={day.day}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                  >
                    <div className="px-5 py-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="font-bold text-sm text-orange-900 dark:text-orange-300">
                        Day {day.day}: {day.title}
                      </span>
                    </div>

                    <div className="p-5 space-y-4 text-xs">
                      {/* Morning */}
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                          <Sun className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-slate-900 dark:text-white block font-semibold">
                            Morning:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {day.morning}
                          </p>
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center shrink-0">
                          <Sunset className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-slate-900 dark:text-white block font-semibold">
                            Afternoon:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {day.afternoon}
                          </p>
                        </div>
                      </div>

                      {/* Evening */}
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-slate-900 dark:text-white block font-semibold">
                            Evening:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {day.evening}
                          </p>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500">
                        <div className="flex items-start gap-1">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>Tip:</strong> {day.travelTips}
                          </span>
                        </div>
                        <div className="flex items-start gap-1">
                          <Wallet className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>Budget:</strong> {day.budgetTip}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Packing and Budget summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    Packing Recommendations
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    {plan.packingAdvice.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 space-y-2">
                  <h4 className="font-bold text-xs text-orange-900 dark:text-orange-300 uppercase tracking-wider">
                    Sample Daily Budget
                  </h4>
                  <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                    ₹{plan.estimatedDailyBudgetINR.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-600 dark:text-slate-400">/ day / traveler</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Includes estimated moderate hotel stay, verified regional cuisine, transport, and entry tickets.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Ready to Plan Your Journey
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your preferred destination, duration, and interests on the left, then click &quot;Create
                Day-by-Day Itinerary&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">Loading planner...</div>}>
      <PlannerContent />
    </Suspense>
  );
}
