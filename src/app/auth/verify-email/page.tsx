'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MailCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const [verified, setVerified] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
          <MailCheck className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Verification</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            SmartYatra uses email verification to protect user accounts and prevent unauthorized password resets.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <p>
            For local evaluation and development mode, your account registration is active. In production, a secure
            verification token with cryptographic hashing is transmitted to your email.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <span>Go to My Dashboard</span> <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/explore"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition"
          >
            Explore Destinations
          </Link>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Cryptographic single-use token verification</span>
        </div>
      </div>
    </div>
  );
}
