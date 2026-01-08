'use client';

import api from '@/libs/axios';
import { Settings } from '@/types/dashboard/settings';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';


// Context value type
interface GlobalContextType {
  settings: Settings | null;
  loadingSettings: boolean;
}

// Create context with default value
const GlobalContext = createContext<GlobalContextType>({
  settings: null,
  loadingSettings: true,
});

// Provider Component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);

  // Fetch public settings
  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      const res = await api.get<Settings>("settings/public");
      setSettings(res.data);
    } catch {
      setSettings(null);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <GlobalContext.Provider value={{ settings, loadingSettings }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook to use context
export const useValues = () => {
  return useContext(GlobalContext);
};
