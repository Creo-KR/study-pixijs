'use client';

import { Application } from 'pixi.js';
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { useAssets } from '../_hooks/useAssets';
import './pixi-react'; // Import to extend all PIXI components globally

export interface AppContext extends ReturnType<typeof useAssets> {
  app: Application;
  isInitialized: boolean;
  setContextValue: (context: AppContext) => void;
  screen: {
    width: number;
    height: number;
  };
}

const defaultContextValue: AppContext = {
  app: {} as Application,
  isInitialized: false,
  setContextValue() {},
  screen: {
    width: 800,
    height: 600,
  },

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
  const [screen, setScreen] = useState({
    width: 800,
    height: 600,
  });

  const assets = useAssets();

  // Listen to app resize events
  useEffect(() => {
    if (!contextValue.app?.renderer) return;

    const handleResize = () => {
      setScreen({
        width: contextValue.app.screen.width,
        height: contextValue.app.screen.height,
      });
    };

    // Listen to resize events
    contextValue.app.renderer.on('resize', handleResize);

    // Update initial size
    if (contextValue.app.screen) {
      handleResize();
    }

    // Cleanup
    return () => {
      contextValue.app.renderer.off('resize', handleResize);
    };
  }, [contextValue.app]);

  const memoizedValue = useMemo(
    () => ({ ...contextValue, setContextValue, ...assets, screen }),
    [contextValue, assets, screen]
  );

  return (
    <AppContext.Provider value={memoizedValue}>{children}</AppContext.Provider>
  );
};
