'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  brandName: { en: 'SmartYatra', hi: 'स्मार्टयात्रा' },
  tagline: {
    en: 'Personalized, AI-Powered Travel Journeys Across India & Beyond',
    hi: 'भारत और विश्व भर में आपकी व्यक्तिगत, एआई-संचालित यात्रा',
  },
  navExplore: { en: 'Explore', hi: 'स्थान खोजें' },
  navPlanner: { en: 'AI Trip Planner', hi: 'एआई यात्रा योजना' },
  navBudget: { en: 'Budget Calculator', hi: 'बजट कैलकुलेटर' },
  navRecommendations: { en: 'For You', hi: 'आपके लिए' },
  navMemory: { en: 'Travel Memory', hi: 'यात्रा स्मृति' },
  navServices: { en: 'Nearby Services', hi: 'आस-पास सेवाएं' },
  navCaptions: { en: 'AI Captions', hi: 'एआई कैप्शन' },
  navDashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  navLogin: { en: 'Log In', hi: 'लॉग इन' },
  navRegister: { en: 'Sign Up', hi: 'रजिस्टर करें' },
  navLogout: { en: 'Log Out', hi: 'लॉग आउट' },
  navSettings: { en: 'Settings', hi: 'सेटिंग्स' },
  navPrivacy: { en: 'Privacy Notice', hi: 'गोपनीयता नीति' },

  // Hero
  heroTitle: {
    en: 'Discover Timeless Heritage & Plan Authentic Journeys',
    hi: 'प्राचीन धरोहर को खोजें और अपनी अविस्मरणीय यात्रा की योजना बनाएं',
  },
  heroSubtitle: {
    en: 'Verified histories, transparent budget estimates, and private AI assistance tailored to your personal interests.',
    hi: 'प्रमाणित इतिहास, पारदर्शी बजट अनुमान और आपकी व्यक्तिगत प्राथमिकताओं के अनुरूप सुरक्षित एआई सहायता।',
  },
  heroSearchPlaceholder: {
    en: 'Search places (e.g. Jaipur, Varanasi, Munnar, Hampi)...',
    hi: 'स्थान खोजें (जैसे जयपुर, वाराणसी, मुन्नार, हम्पी)...',
  },
  searchBtn: { en: 'Search', hi: 'खोजें' },
  quickFilters: { en: 'Popular Themes:', hi: 'लोकप्रिय विषय:' },

  // Badges & Labels
  verifiedFact: { en: 'Verified Heritage Record', hi: 'प्रमाणित ऐतिहासिक विवरण' },
  sampleEstimate: { en: 'Sample Estimate', hi: 'अनुमानित व्यय' },
  aiBadge: { en: 'AI-Powered', hi: 'एआई-संचालित' },
  demoBadge: { en: 'Demo / Non-AI Fallback', hi: 'डेमो / नॉन-एआई मोड' },
  savePlace: { en: 'Save to Memory', hi: 'मेमोरी में सहेजें' },
  savedPlace: { en: 'Saved in Memory', hi: 'सहेजा गया' },

  // Footer
  footerDisclaimer: {
    en: 'SmartYatra strictly respects user privacy. In-app searches and travel plans are kept private to your account. No third-party browser tracking.',
    hi: 'स्मार्टयात्रा उपयोगकर्ता की गोपनीयता का पूर्ण सम्मान करता है। वेबसाइट पर की गई खोजें केवल आपके खाते में सुरक्षित रहती हैं। कोई अनधिकृत ट्रैकिंग नहीं।',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof DICTIONARY) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => DICTIONARY[key]?.en || String(key),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('smartyatra_lang') as Language;
    if (saved === 'en' || saved === 'hi') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smartyatra_lang', lang);
  };

  const t = (key: keyof typeof DICTIONARY): string => {
    const item = DICTIONARY[key];
    if (!item) return String(key);
    return item[language] || item.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
