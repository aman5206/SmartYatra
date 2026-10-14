'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Download,
  Trash2,
  FileText,
  Mail,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>DPDP Act-Aligned Privacy Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Plain-Language Privacy Notice
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Last updated: October 2026 • Designed for transparency under India&apos;s Digital Personal Data Protection framework.
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-3">
        <h2 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Core Privacy Principles at SmartYatra</span>
        </h2>
        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No External Browser Tracking:</strong> SmartYatra never reads your browsing history from other websites or apps.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Opt-In Personalization:</strong> Using in-app activity for travel recommendations is strictly opt-in and can be revoked at any time.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Ephemeral Photo Processing:</strong> Uploaded images are analyzed in temporary RAM buffers for caption generation and never stored permanently or published.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Full Control & Portability:</strong> You can download all your data in JSON or delete your account with one click.</span>
          </li>
        </ul>
      </div>

      {/* Structured Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            1. What Information We Collect (Data Minimization)
          </h3>
          <p>We deliberately collect only the minimum data required to deliver authentic travel services:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Account Data:</strong> Name, email address, and an Argon2id cryptographically hashed password. We never store plain-text passwords.</li>
            <li><strong>Travel Preferences (Optional):</strong> Interests selected by you (e.g., heritage, wildlife, spirituality, cuisine).</li>
            <li><strong>In-App Activity:</strong> Saved places and search queries executed inside SmartYatra, retained only to power your Travel Memory.</li>
            <li><strong>Technical Telemetry:</strong> Anonymized rate-limit counters and security audit logs to prevent credential stuffing and automated abuse.</li>
          </ul>
          <p className="text-xs text-slate-500">
            We do NOT collect Aadhaar, passport numbers, driver licenses, banking credentials, or continuous precise GPS tracking.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            2. How Information is Used
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>To construct and save day-by-day travel itineraries.</li>
            <li>To calculate estimated travel budgets in Indian Rupees (INR).</li>
            <li>To provide personalized destination rankings if you explicitly grant consent.</li>
            <li>To process photo caption requests through AI vision or rule-based models.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            3. External Service Providers & Integrations
          </h3>
          <p>
            When specific features are triggered, minimal data may be processed through strictly evaluated external providers:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>AI Processing (Google Gemini):</strong> Only when configured via environment variables, itinerary prompts or image frames are sent for inference with strict token limits. Model code execution is strictly blocked.</li>
            <li><strong>Maps (OpenStreetMap):</strong> Destination map coordinates are displayed via OpenStreetMap public tiles without transmitting your personal account identity.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            4. Data Retention & Erasure Policy
          </h3>
          <p>
            Personal data is retained only while your account remains active. Upon invoking the <strong>Delete Account</strong> feature
            in Settings:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Your user record, saved trips, favorites, and search queries are immediately removed via database cascade.</li>
            <li>Active authentication session tokens are invalidated instantly.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            5. Your Rights as a Data Principal
          </h3>
          <p>You maintain complete agency over your personal travel information:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/settings"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-500 transition space-y-1"
            >
              <strong className="block text-slate-900 dark:text-white text-xs">Right to Portability (Export)</strong>
              <span className="text-[11px] text-slate-500">Download your full data record as JSON from Settings.</span>
            </Link>

            <Link
              href="/settings"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500 transition space-y-1"
            >
              <strong className="block text-slate-900 dark:text-white text-xs">Right to Erasure (Delete)</strong>
              <span className="text-[11px] text-slate-500">Permanently wipe your account and all associated travel records.</span>
            </Link>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            6. Grievance Redressal & Contact
          </h3>
          <p className="text-xs">
            For questions or requests regarding your personal data under the Digital Personal Data Protection Act, contact our designated Data Protection Officer:
          </p>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono">
            privacy@smartyatra.in • Grievance Officer: SmartYatra Data Governance Team
          </div>
        </section>
      </div>
    </div>
  );
}
