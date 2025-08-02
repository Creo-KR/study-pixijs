import React, { createContext, useContext, useRef, useEffect } from 'react';
import { Application } from 'pixi.js';

interface PixiAppContextValue {
  app: Application | null;
}

const PixiAppContext = createContext<PixiAppContextValue>({ app: null });

export const usePixiApp = () => useContext(PixiAppContext);

interface AppProviderProps {
  children: React.ReactNode;
  options?: ConstructorParameters<typeof Application>[0];
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  options,
}) => {
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!appRef.current) {
      appRef.current = new Application(options);
    }
    return () => {
      appRef.current?.destroy(true, { children: true });
      appRef.current = null;
    };
  }, [options]);

  return (
    <PixiAppContext.Provider value={{ app: appRef.current }}>
      {children}
    </PixiAppContext.Provider>
  );
};
