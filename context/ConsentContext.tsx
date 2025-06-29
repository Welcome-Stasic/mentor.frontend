'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

type ConsentContextType = {
  consentGiven: boolean;
  setConsent: () => void;
  loading: boolean;
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const consentDateStr = getCookie('user_consent_date') as string | undefined;

    if (consentDateStr) {
      const savedDate = new Date(consentDateStr);
      const now = new Date();

      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfSavedDay = new Date(
        savedDate.getFullYear(),
        savedDate.getMonth(),
        savedDate.getDate(),
      );

      const diffMs = startOfToday.getTime() - startOfSavedDay.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays >= 30) {
        setConsentGiven(true);
      }
    } else {
      setConsentGiven(true);
    }
    setLoading(false);
  }, []);

  const setConsent = () => {
    const nowISO = new Date().toISOString();
    setCookie('user_consent_date', nowISO, {
      maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    });
    setConsentGiven(true);
  };

  return (
    <ConsentContext.Provider value={{ consentGiven, setConsent, loading }}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within ConsentProvider');
  return context;
};
