'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Application } from 'pixi.js';
import { Navigation } from './utils/navigation';
import { BGM, SFX } from './utils/audio';
import { initAssets } from './utils/assets';
import { UserSettings } from './utils/userSettings';

export interface PixiAppContext {
  app: Application;
  navigation: Navigation | null;
  bgm: BGM | null;
  sfx: SFX | null;
  userSettings: UserSettings | null;
  isInitialized: boolean;
  setContextValue: (context: PixiAppContext) => void;
}

const defaultContext: PixiAppContext = {
  app: {} as Application,
  navigation: null,
  bgm: null,
  sfx: null,
  userSettings: null,
  isInitialized: false,
  setContextValue() {},
};

const PixiAppContext = createContext<PixiAppContext>(defaultContext);

export const usePixiApp = () => useContext(PixiAppContext);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [contextValue, setContextValue] =
    useState<PixiAppContext>(defaultContext);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    let currentApp: Application | null = null;

    const initializeApp = async () => {
      try {
        const app = new Application();
        currentApp = app;

        await app.init({
          resolution: Math.max(window.devicePixelRatio, 2),
          backgroundColor: 0xffffff,
        });

        canvasContainerRef.current?.appendChild(app.canvas);

        if (!mounted && typeof app.destroy === 'function') {
          app.destroy(true, { children: true });
          return;
        }

        await initAssets();

        const bgm = new BGM();
        const sfx = new SFX();

        setContextValue({
          ...contextValue,
          app,
          bgm,
          sfx,
          isInitialized: true,
          setContextValue,
        });
      } catch (error) {
        console.error('Failed to initialize PIXI app:', error);
      }
    };

    initializeApp();

    return () => {
      mounted = false;
      if (typeof currentApp?.destroy === 'function') {
        // currentApp.destroy(true, { children: true });
      }
    };
  }, [contextValue]);

  useEffect(() => {
    if (!contextValue.userSettings) {
      setContextValue({
        ...contextValue,
        userSettings: new UserSettings(contextValue),
      });
    }
  }, [contextValue]);

  const memoizedValue = useMemo(() => contextValue, [contextValue]);

  return (
    <PixiAppContext.Provider value={memoizedValue}>
      {!memoizedValue.isInitialized ? (
        <div className='loading-screen'>
          <p>Loading...</p>
        </div>
      ) : (
        <div ref={canvasContainerRef}>{children}</div>
      )}
    </PixiAppContext.Provider>
  );
};
