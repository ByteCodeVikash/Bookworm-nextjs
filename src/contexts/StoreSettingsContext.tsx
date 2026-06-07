// src/contexts/StoreSettingsContext.tsx
// App-level context providing store settings and categories to all components.
// Fetches once on app mount — consumed by Header, Footer, and other components.

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchStoreSettings, fetchCategories, StoreSettings } from "@/utils/storeApi";
import { Category } from "@/types";

interface StoreSettingsContextValue {
  settings: StoreSettings;
  categories: Category[];
  isLoaded: boolean;
}

const StoreSettingsContext = createContext<StoreSettingsContextValue>({
  settings: {},
  categories: [],
  isLoaded: false,
});

export const StoreSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([fetchStoreSettings(), fetchCategories()])
      .then(([s, c]) => {
        if (!active) return;
        setSettings(s);
        setCategories(c);
      })
      .catch(console.error)
      .finally(() => {
        if (active) setIsLoaded(true);
      });
    return () => { active = false; };
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, categories, isLoaded }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => useContext(StoreSettingsContext);
