'use client';

import React, { createContext, useContext, useRef, useEffect } from 'react';
import { Application } from 'pixi.js';
import { Navigation } from './utils/navigation';

interface PixiAppContextValue {
  app: Application;
  navigation: Navigation;
}

const PixiAppContext = createContext<PixiAppContextValue>({
  app: {} as Application,
  navigation: {} as Navigation,
});

export const usePixiApp = () => useContext(PixiAppContext);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const appRef = useRef<Application>(null);
  const navigation = useRef<Navigation>(null); // Assuming navigation is defined elsewhere

  useEffect(() => {
    if (!appRef.current) {
      appRef.current = new Application();
      navigation.current = new Navigation(appRef.current);
    }
    return () => {
      appRef.current?.destroy(true, { children: true });
      appRef.current = null;
    };
  }, []);

  return appRef.current && navigation.current ? (
    <PixiAppContext.Provider
      value={{ app: appRef.current, navigation: navigation.current }}
    >
      {children}
    </PixiAppContext.Provider>
  ) : null;
};
