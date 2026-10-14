'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { MapPin, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white">{t('brandName')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('tagline')}. Starting across timeless Indian destinations and architected to expand worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>DPDP Act-Aligned Privacy Protection</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Explore & Plan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-orange-400 transition">
                  {t('navExplore')} Destinations
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-orange-400 transition">
                  {t('navPlanner')}
                </Link>
              </li>
              <li>
                <Link href="/budget" className="hover:text-orange-400 transition">
                  {t('navBudget')}
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-orange-400 transition">
                  Personalized {t('navRecommendations')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Features & Memory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/memory" className="hover:text-orange-400 transition">
                  {t('navMemory')} (In-App Only)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-orange-400 transition">
                  {t('navServices')} & Emergency
                </Link>
              </li>
              <li>
                <Link href="/caption-generator" className="hover:text-orange-400 transition">
                  {t('navCaptions')} Generator
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-orange-400 transition">
                  Data Privacy & Export
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Compliance Notice */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Privacy & Trust
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Cross-App Tracking</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {t('footerDisclaimer')}
              </p>
              <Link
                href="/privacy"
                className="inline-block text-[11px] text-orange-400 underline hover:text-orange-300"
              >
                Read Plain-Language Privacy Notice →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SmartYatra. Made for mindful travelers.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Transparent AI & Verified Records
            </span>
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/settings" className="hover:text-slate-300">
              Account Controls
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
