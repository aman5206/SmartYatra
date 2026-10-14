'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DestinationItem } from '@/data/seed-data';
import {
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Calculator,
  Heart,
  Clock,
  Ticket,
  Plane,
  Train,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Building2,
  Compass,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { language } = useLanguage();

  const [destination, setDestination] = useState<DestinationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/destinations/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setDestination(data.destination);
      })
      .catch(() => {
        setDestination(null);
      })
      .finally(() => setLoading(false));

    // Check if saved
    fetch('/api/saved-places')
      .then((res) => (res.ok ? res.json() : { savedPlaces: [] }))
      .then((data) => {
        const found = (data.savedPlaces || []).some((s: any) => s.destinationSlug === slug);
        setIsSaved(found);
      })
      .catch(() => {});
  }, [slug]);

  const handleToggleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/saved-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationSlug: slug }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.saved);
      } else if (res.status === 401) {
        alert('Please sign in to save this destination to your Travel Memory.');
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Loading destination details...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Destination Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested destination &quot;{slug}&quot; could not be found in our database.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Banner */}
      <div className="relative h-96 sm:h-[480px] w-full bg-slate-900 overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top bar controls */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between">
          <Link
            href="/explore"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs font-semibold backdrop-blur-md transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition"
              title="Copy link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition ${
                isSaved
                  ? 'bg-red-500 text-white'
                  : 'bg-black/50 hover:bg-black/70 text-white hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'Saved in Memory' : 'Save to Memory'}</span>
            </button>
          </div>
        </div>

        {/* Title & Metadata over Banner */}
        <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white max-w-4xl space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-semibold text-orange-300">
              <MapPin className="w-3.5 h-3.5" /> {destination.state}, {destination.country}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full font-bold">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {destination.rating.toFixed(1)}
            </span>
            <span>•</span>
            <span className="text-emerald-300 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Heritage
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === 'hi' && destination.hindiName ? destination.hindiName : destination.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-3xl">
            {destination.overview}
          </p>
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg animate-fade-in">
          Link copied to clipboard!
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Details) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Action CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/planner?dest=${destination.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-md transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Plan Day-by-Day Itinerary</span>
            </Link>
            <Link
              href={`/budget?days=${destination.practicalInfo.idealDays}&style=Comfortable`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Trip Budget</span>
            </Link>
            <Link
              href={`/services?dest=${destination.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shadow-md transition"
            >
              <Building2 className="w-4 h-4" />
              <span>Nearby Services (Hotels, Hospitals)</span>
            </Link>
          </div>

          {/* Verified History Section */}
          <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verified Historical Foundations</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {destination.verifiedHistory}
            </p>
          </div>

          {/* Speciality & Popularity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
                Regional Speciality
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {destination.speciality}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                Why Travelers Love It
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {destination.whyPopular}
              </p>
            </div>
          </div>

          {/* Key Attractions */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Major Attractions & Sights
              </h2>
              <p className="text-xs text-slate-500">
                Opening hours and fees are verified sample estimates. Please confirm at the monument ticket kiosk.
              </p>
            </div>

            <div className="space-y-3">
              {destination.attractions.map((attr) => (
                <div
                  key={attr.name}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-orange-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{attr.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                        {attr.category}
                      </span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{attr.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-500" /> {attr.openingHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-emerald-500" /> {attr.ticketPriceEstimate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Practical Info & Map) */}
        <div className="space-y-6">
          {/* Practical Info Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Practical Traveler Info
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-700 dark:text-slate-300">
                    Best Visiting Season:
                  </span>
                  <span className="text-slate-500">{destination.bestVisitingSeason}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-700 dark:text-slate-300">
                    Recommended Duration:
                  </span>
                  <span className="text-slate-500">{destination.practicalInfo.idealDays} Days</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-700 dark:text-slate-300">
                    Nearest Airport:
                  </span>
                  <span className="text-slate-500">{destination.practicalInfo.nearestAirport}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Train className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-700 dark:text-slate-300">
                    Nearest Railway:
                  </span>
                  <span className="text-slate-500">{destination.practicalInfo.nearestStation}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-700 dark:text-slate-300">
                    Etiquette & Clothing:
                  </span>
                  <span className="text-slate-500">{destination.practicalInfo.clothingAdvice}</span>
                </div>
              </div>
            </div>

            {/* Daily Sample Budget */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Sample Daily Travel Budget
              </span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                ₹{destination.practicalInfo.sampleDailyBudgetINR.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500">/ traveler / day</span>
              </div>
              <p className="text-[10px] text-slate-400">
                [Sample Estimate] Includes standard hotel, local transport, meals, and monument tickets.
              </p>
            </div>
          </div>

          {/* OpenStreetMap Representation */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>OpenStreetMap Location</span>
              </h3>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-medium">
                Open Data
              </span>
            </div>

            <div className="h-44 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <iframe
                title={`OpenStreetMap for ${destination.name}`}
                width="100%"
                height="100%"
                className="border-0 opacity-90"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=70.0%2C15.0%2C85.0%2C30.0&layer=mapnik&marker=26.9%2C75.8`}
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap</a> contributors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
