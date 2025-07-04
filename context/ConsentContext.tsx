'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

type ConsentContextType = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  isBannerShow: boolean;
  setConsent: (data: { necessary: boolean; analytics: boolean; marketing: boolean }) => void;
  loading: boolean;
};

const ONE_YEAR = 60 * 60 * 24 * 365;

export const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const [necessary, setNecessary] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const [isBannerShow, setBannerShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUserConsent = async () => {
    setLoading(true);

    const necessaryCookie = getCookie('necessary_cookies');
    const analyticsCookie = getCookie('analytics_cookies');
    const marketingCookie = getCookie('marketing_cookies');
    const consentDateStr = getCookie('consent_cookies') as string | undefined;

    try {
      if (consentDateStr) {
        const savedDate = new Date(consentDateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24));
        setBannerShow(diffDays >= 30);
      } else {
        setBannerShow(true);
      }

      setNecessary(necessaryCookie === 'true');
      setAnalytics(analyticsCookie === 'true');
      setMarketing(marketingCookie === 'true');
    } catch {
      setNecessary(true);
      setAnalytics(true);
      setMarketing(true);
      setBannerShow(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserConsent();
  }, []);

  const setConsent = (data: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
    const nowISO = new Date().toISOString();
    setCookie('necessary_cookies', String(data.necessary), { maxAge: ONE_YEAR });
    setCookie('analytics_cookies', String(data.analytics), { maxAge: ONE_YEAR });
    setCookie('marketing_cookies', String(data.marketing), { maxAge: ONE_YEAR });
    setCookie('consent_cookies', nowISO, { maxAge: ONE_YEAR });

    setNecessary(data.necessary);
    setAnalytics(data.analytics);
    setMarketing(data.marketing);
    setBannerShow(true);
  };

  return (
    <ConsentContext.Provider
      value={{
        necessary,
        analytics,
        marketing,
        isBannerShow,
        setConsent,
        loading,
      }}>
      {children}
    </ConsentContext.Provider>
  );
};
