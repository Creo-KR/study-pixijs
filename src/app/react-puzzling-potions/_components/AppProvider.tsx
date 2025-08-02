import { Application, Container } from 'pixi.js';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from 'react';
import { useAssets } from '../_hooks/useAssets';
import { extend } from '@pixi/react';

extend({ Container });

export interface AppContext extends ReturnType<typeof useAssets> {
  app: Application;
  isInitialized: boolean;
  setContextValue: (context: AppContext) => void;
}

const defaultContextValue: AppContext = {
  app: {} as Application,
  isInitialized: false,
  setContextValue() {},

  loadedBundles: [],
  async loadBundles() {},
  areBundlesLoaded() {
    return false;
  },
};

const AppContext = createContext<AppContext>(defaultContextValue);

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [contextValue, setContextValue] =
    useState<AppContext>(defaultContextValue);

  const assets = useAssets();

  const memoizedValue = useMemo(
    () => ({ ...contextValue, setContextValue, ...assets }),
    [contextValue, assets]
  );

  return (
    <AppContext.Provider value={memoizedValue}>{children}</AppContext.Provider>
  );
};
