'use client';

import { ConsentContext } from "@/context/ConsentContext";
import { useContext } from "react";

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within ConsentProvider');
  return context;
};