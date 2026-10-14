'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Shield,
  Download,
  Trash2,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function SettingsPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Privacy states
  const [consentPersonalization, setConsentPersonalization] = useState(false);
  const [consentActivityHistory, setConsentActivityHistory] = useState(false);
  const [preferredCurrency, setPreferredCurrency] = useState('INR');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // Feedback states
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
        if (data.user.preferences) {
          setConsentPersonalization(data.user.preferences.consentPersonalization ?? false);
          setConsentActivityHistory(data.user.preferences.consentActivityHistory ?? false);
          if (data.user.preferences.defaultCurrency) setPreferredCurrency(data.user.preferences.defaultCurrency);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdatePrivacy = async () => {
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentPersonalization,
          consentActivityHistory,
          defaultCurrency: preferredCurrency,
          preferredLanguage: language,
        }),
      });

      if (res.ok) {
        setStatusMessage({ type: 'success', text: 'Privacy & preference settings updated.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update preferences.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error connecting to server.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadData = () => {
    window.location.href = '/api/user/export';
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') {
      setStatusMessage({ type: 'error', text: 'Please type DELETE exactly to confirm.' });
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmText: deleteConfirmText,
          password: deletePassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      alert('Your SmartYatra account and all associated travel records have been permanently deleted.');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Loading settings...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Privacy Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal information, DPDP data protection choices, and account security.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Profile Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-orange-500" />
          <span>Profile Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Full Name</label>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white">
              {user.name}
            </div>
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Email Address</label>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white">
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & DPDP Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>DPDP Privacy & Consent Controls</span>
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
            Digital Personal Data Protection Act
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Personalization Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <strong className="block text-slate-900 dark:text-white">Personalized Recommendations</strong>
              <p className="text-slate-500 text-[11px]">
                Tailor destination suggestions and itineraries to your indicated interests.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={consentPersonalization}
                onChange={(e) => setConsentPersonalization(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* Activity History Toggle */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <strong className="block text-slate-900 dark:text-white">Use In-App Searches for Recommendations</strong>
              <p className="text-slate-500 text-[11px]">
                Allow searches conducted strictly within this website to refine your match scores.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={consentActivityHistory}
                onChange={(e) => setConsentActivityHistory(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Language & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Default Currency</label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleUpdatePrivacy}
            disabled={actionLoading}
            className="px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs shadow-sm hover:bg-orange-700 transition"
          >
            Save Privacy Choices
          </button>
        </div>
      </div>

      {/* Download My Data */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-500" />
          <span>Download My Travel Data</span>
        </h2>
        <p className="text-xs text-slate-500">
          In alignment with Indian data protection standards, you can download a full, structured machine-readable JSON
          archive of your profile, saved places, planned itineraries, and in-app search history at any time.
        </p>
        <button
          onClick={handleDownloadData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs transition"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Export Data File (.JSON)</span>
        </button>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-4">
        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-base">
          <AlertTriangle className="w-5 h-5" />
          <span>Danger Zone: Permanent Account Deletion</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Deleting your account will permanently remove your profile, all planned trip itineraries, saved destinations,
          preferences, and in-app search logs. This action cannot be reversed.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition"
        >
          <Trash2 className="w-4 h-4" /> Delete My Account
        </button>
      </div>

      {/* Re-Authentication Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
              <Trash2 className="w-5 h-5" /> Confirm Account Deletion
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              To verify your identity and protect against accidental deletion, please re-enter your current password and
              type <strong>DELETE</strong> below.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Type &quot;DELETE&quot;
                </label>
                <input
                  type="text"
                  required
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full py-2 px-3 rounded-xl text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Current Password
                </label>
                <input
                  type="password"
                  required
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2 px-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || deleteConfirmText !== 'DELETE'}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
                >
                  {actionLoading ? 'Deleting...' : 'Permanently Delete Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
