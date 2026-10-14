'use client';

import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Trash2,
  AlertCircle,
  Hash,
  Globe,
  Smile,
  Feather,
  Compass,
  Landmark,
} from 'lucide-react';

export default function CaptionGeneratorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [destinationName, setDestinationName] = useState('');
  const [style, setStyle] = useState<'poetic' | 'adventurous' | 'historical' | 'cultural' | 'witty'>('poetic');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const styleOptions = [
    { id: 'poetic', label: 'Poetic & Lyrical', icon: Feather },
    { id: 'adventurous', label: 'Adventurous', icon: Compass },
    { id: 'historical', label: 'Historical & Heritage', icon: Landmark },
    { id: 'cultural', label: 'Cultural & Sacred', icon: Sparkles },
    { id: 'witty', label: 'Witty & Playful', icon: Smile },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are permitted.');
      return;
    }

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo exceeds maximum upload limit of 5 MB.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Data(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setBase64Data(null);
    setResult(null);
    setError(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!base64Data || !selectedFile) {
      setError('Please select or upload a travel photo first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64Data,
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          style,
          language,
          destinationName: destinationName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate captions');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Error processing photo caption');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, isTag = false) => {
    navigator.clipboard?.writeText(text);
    if (isTag) {
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    } else {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-semibold">
          <Camera className="w-4 h-4" />
          <span>Multilingual AI Photo Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Travel Photo Captions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload your travel memory, select your desired style and language, and craft evocative captions and hashtags.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload & Controls (Left) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                1. Upload Travel Photograph
              </label>

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <img
                    src={previewUrl}
                    alt="Travel preview"
                    className="w-full h-56 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition"
                    title="Remove photograph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-2 text-center text-[11px] text-white/80 bg-black/60 backdrop-blur-xs truncate">
                    {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(0)} KB)
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50/20 transition p-4 text-center">
                  <Upload className="w-8 h-8 text-orange-500 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Click to select or drop your image
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    JPEG, PNG, or WebP up to 5 MB
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Destination Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                2. Destination or Monument Name (Optional)
              </label>
              <input
                type="text"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder="e.g. Amber Fort Jaipur, Varanasi Ghats, Munnar"
                className="w-full py-2 px-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                3. Caption Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                    language === 'en'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                    language === 'hi'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> हिन्दी (Hindi)
                </button>
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                4. Tone & Style
              </label>
              <div className="space-y-1.5">
                {styleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = style === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStyle(opt.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium border text-left transition ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading || !base64Data}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 hover:from-orange-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing & Generating Captions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Captions & Hashtags</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strict Private Photo Processing</span>
            </div>
            <p>
              Uploaded photos are processed in ephemeral server memory for caption generation only. They are not stored,
              cataloged, or published publicly.
            </p>
          </div>
        </div>

        {/* Caption Results (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Badge & Model */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="px-3 py-1 rounded-full font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                  {result.modelBadge}
                </span>
                <span className="text-slate-400 capitalize">{style} Tone</span>
              </div>

              {/* Primary Caption */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Primary Caption
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.caption)}
                    className="flex items-center gap-1 text-orange-600 font-semibold hover:underline"
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  &ldquo;{result.caption}&rdquo;
                </div>
              </div>

              {/* Secondary Option */}
              {result.secondaryOption && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Alternative Option
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.secondaryOption)}
                      className="flex items-center gap-1 text-orange-600 font-semibold hover:underline"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    &ldquo;{result.secondaryOption}&rdquo;
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {result.hashtags && result.hashtags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" /> Curated Travel Hashtags
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.hashtags.join(' '), true)}
                      className="flex items-center gap-1 text-orange-600 font-semibold hover:underline"
                    >
                      {copiedTags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTags ? 'All Copied' : 'Copy All'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    {result.hashtags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-300 border border-slate-200 dark:border-slate-600 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-[11px] text-slate-600 dark:text-slate-400">
                {result.disclaimer}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Upload a Photo to Begin
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your favorite travel snapshot on the left, pick a language and tone, and get evocative captions instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
