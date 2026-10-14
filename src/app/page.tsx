'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { SEED_DESTINATIONS } from '@/data/seed-data';
import { DestinationCard } from '@/components/DestinationCard';
import {
  Search,
  Sparkles,
  Calendar,
  Calculator,
  ShieldCheck,
  Compass,
  ArrowRight,
  Bookmark,
  Camera,
  MapPin,
  CheckCircle2,
  Heart,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push('/explore');
      return;
    }
    // Also record search anonymously / session
    fetch('/api/searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery.trim() }),
    }).catch(() => {});

    router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const categories = [
    { id: 'history', label: 'Royal Heritage', icon: '🏛️', count: '1,200+ Sites' },
    { id: 'spirituality', label: 'Sacred Ghats & Temples', icon: '🪔', count: '84 Holy Ghats' },
    { id: 'nature', label: 'Lush Hills & Backwaters', icon: '🌿', count: 'Western Ghats' },
    { id: 'adventure', label: 'High Passes & Rafting', icon: '🏔️', count: '17,000+ ft' },
    { id: 'food', label: 'Culinary Trails', icon: '🍛', count: 'Centuries of Flavors' },
    { id: 'culture', label: 'Living Traditions', icon: '🎭', count: 'Folk & Festivals' },
  ];

  const featuredExperiences = [
    {
      title: 'Maha Ganga Aarti at Dusk',
      location: 'Varanasi, Uttar Pradesh',
      description: 'Witness seven priests chant Vedic hymns by the holy riverfront with multi-tiered brass lamps.',
      badge: 'Verified Spiritual Tradition',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      slug: 'varanasi',
    },
    {
      title: 'Amber Fort & Hall of Mirrors',
      location: 'Jaipur, Rajasthan',
      description: 'Explore the Sheesh Mahal where a single candle flame is reflected across thousands of Belgian mirrors.',
      badge: 'UNESCO Heritage Fort',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      slug: 'jaipur',
    },
    {
      title: 'Vembanad Lake Houseboat Cruise',
      location: 'Alleppey, Kerala',
      description: 'Drift past emerald paddy fields, coconut palms, and peaceful village shores in a traditional wooden craft.',
      badge: 'Signature Backwater Eco-Tour',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      slug: 'munnar',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 shadow-xs text-xs font-semibold text-orange-700 dark:text-orange-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act-Aligned • Verified History • No Third-Party Tracking</span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {t('heroTitle')}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-orange-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('heroSearchPlaceholder')}
                className="w-full px-3 py-2 text-sm bg-transparent border-0 focus:ring-0 focus:outline-hidden text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                {t('searchBtn')}
              </button>
            </form>

            {/* Quick Themes */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">{t('quickFilters')}</span>
              {['Jaipur', 'Varanasi', 'Munnar', 'Hampi', 'Ladakh', 'Rishikesh'].map((place) => (
                <button
                  key={place}
                  onClick={() => router.push(`/destinations/${place.toLowerCase()}`)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-slate-700 hover:text-orange-600 transition"
                >
                  {place}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6 text-left">
            <Link
              href="/planner"
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center justify-between">
                <span>AI Trip Planner</span>
                <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Day-by-day morning, afternoon, and evening itineraries generated from your budget and interests.
              </p>
            </Link>

            <Link
              href="/budget"
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center justify-between">
                <span>Budget Calculator</span>
                <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Transparent accommodation, transport, food, and activities breakdown in Indian Rupees (INR).
              </p>
            </Link>

            <Link
              href="/recommendations"
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center justify-between">
                <span>Personalized For You</span>
                <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select your passion for spirituality, wildlife, forts, or food with 100% private consent controls.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Destinations Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Timeless Treasures</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Popular Indian Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curated locations with verified historical foundations, authentic specialities, and sample budgets.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 self-start sm:self-auto"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SEED_DESTINATIONS.slice(0, 6).map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* Themes & Travel Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Explore by Travel Theme
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Find places aligned with your personal interests. Each category is verified for authenticity.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:shadow-md transition text-center space-y-2 group"
            >
              <div className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-orange-600">
                {cat.label}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Featured Experiences & Verified Traditions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immersive cultural milestones preserved through centuries of living heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredExperiences.map((exp) => (
            <div
              key={exp.title}
              className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"
            >
              <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded bg-black/70 text-white backdrop-blur-xs">
                  {exp.badge}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{exp.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
                <Link
                  href={`/destinations/${exp.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Explore Destination Details <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Promise Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20">
              Responsible Indian Tourism
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">Your Travel Journey, Strictly Private</h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              SmartYatra never scans your external browser history, contacts, or location without permission. Your
              saved destinations and in-app itineraries belong exclusively to you, with one-click data export and account
              deletion.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/privacy"
              className="px-5 py-2.5 rounded-xl bg-white text-orange-700 font-bold text-xs text-center shadow-md hover:bg-slate-100 transition"
            >
              Read Privacy Notice
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 rounded-xl bg-black/30 border border-white/40 text-white font-bold text-xs text-center hover:bg-black/40 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
