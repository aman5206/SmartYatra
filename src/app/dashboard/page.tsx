'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DestinationCard } from '@/components/DestinationCard';
import { DestinationItem } from '@/data/seed-data';
import {
  User,
  Calendar,
  Bookmark,
  Search,
  Settings,
  Shield,
  Trash2,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/auth/login');
          return;
        }
        setUser(data.user);

        // Fetch user data in parallel
        return Promise.all([
          fetch('/api/trips').then((r) => (r.ok ? r.json() : { trips: [] })),
          fetch('/api/saved-places').then((r) => (r.ok ? r.json() : { savedPlaces: [] })),
          fetch('/api/searches').then((r) => (r.ok ? r.json() : { searches: [] })),
        ]);
      })
      .then((results) => {
        if (results) {
          const [tripData, savedData, searchData] = results;
          setTrips(tripData.trips || []);
          setSavedPlaces(savedData.savedPlaces || []);
          setSearches(searchData.searches || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      const res = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      if (res.ok) {
        setTrips(trips.filter((t) => t.id !== tripId));
      } else {
        alert('Could not delete trip.');
      }
    } catch {
      alert('Error deleting trip.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Loading your travel dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/planner"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-sm transition"
          >
            <Calendar className="w-4 h-4" /> Plan New Trip
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
          >
            <Settings className="w-4 h-4" /> Privacy & Settings
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">Saved Destinations</span>
          <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
            {savedPlaces.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">Planned Itineraries</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {trips.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">In-App Searches</span>
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {searches.length}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 block">DPDP Data Privacy</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
            Protected & Exportable
          </span>
        </div>
      </div>

      {/* Section 1: My Trips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>My Planned Itineraries</span>
          </h2>
          <Link href="/planner" className="text-xs text-orange-600 font-semibold hover:underline">
            + Create Itinerary
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                      {trip.destinationName}
                    </span>
                    <span className="text-slate-400">
                      {new Date(trip.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{trip.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{trip.durationDays} Days</span>
                    <span>•</span>
                    <span>{trip.groupType}</span>
                    <span>•</span>
                    <span className="font-medium text-emerald-600">{trip.budgetTier} Tier</span>
                  </div>

                  {/* Sample days list preview */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <strong>Itinerary Highlights:</strong>
                    {Array.isArray(trip.itinerary) &&
                      trip.itinerary.slice(0, 2).map((d: any, idx: number) => (
                        <p key={idx} className="truncate text-[11px] text-slate-500">
                          Day {d.day || idx + 1}: {d.title || d.morning}
                        </p>
                      ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/destinations/${trip.destinationSlug}`}
                    className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
                  >
                    View Destination Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition"
                    title="Delete trip itinerary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">No trips planned yet.</p>
            <Link
              href="/planner"
              className="inline-block px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs"
            >
              Plan Your First Trip
            </Link>
          </div>
        )}
      </div>

      {/* Section 2: Saved Places */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-orange-600" />
            <span>Saved Places ({savedPlaces.length})</span>
          </h2>
          <Link href="/memory" className="text-xs text-orange-600 font-semibold hover:underline">
            View All in Travel Memory
          </Link>
        </div>

        {savedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlaces.slice(0, 3).map((item) =>
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
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">No destinations saved in your Travel Memory yet.</p>
            <Link
              href="/explore"
              className="inline-block px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs"
            >
              Explore & Save Places
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
