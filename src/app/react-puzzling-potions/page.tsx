'use client';

import { Application } from '@pixi/react';
import { useCallback, useState } from 'react';
import { AppProvider, useAppContext } from './_components/AppProvider';
import { Application as PixiApplication, Renderer } from 'pixi.js';
import GameNavigation from './_components/GameNavigation';
import TiledBackground from './_components/ui/backgrounds/TiledBackground';

function PixiApp() {
  const context = useAppContext();
  const [win] = useState<Window | undefined>(() =>
    typeof window !== 'undefined' ? window : undefined
  );
  const isLoading = !context.isInitialized;

  const onInit = useCallback(
    (app: PixiApplication<Renderer>) => {
      setTimeout(() => {
        console.log('[Application] isInitialized');
        return context.setContextValue({
          ...context,
          isInitialized: true,
          app,
        });
      }, 100);
    },
    [context]
  );

  return (
    <div className='min-h-screen'>
      {isLoading && <p>Loading...</p>}
      <Application backgroundColor={0xffffff} resizeTo={win} onInit={onInit}>
        {!isLoading && <GameNavigation background={<TiledBackground />} />}
      </Application>
    </div>
  );
}

export default function ReactPuzzlingPotionsPage() {
  return (
    <AppProvider>
      <PixiApp />
    </AppProvider>
  );
}
