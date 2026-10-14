import Link from 'next/link';
import { Compass, ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            404 • Destination Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Lost on the Yatra Path?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page or destination you are searching for might have moved or is not yet mapped on SmartYatra.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            href="/explore"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Search className="w-4 h-4" /> Explore Verified Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
