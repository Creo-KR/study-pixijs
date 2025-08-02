'use client';

import { useCallback, useEffect } from 'react';
import { usePixiApp } from '../AppProvider';
import { sound } from '@pixi/sound';

export default function useAppEvent() {
  const { app, navigation } = usePixiApp();

  const resize = useCallback(() => {
    if (!app || !navigation) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minWidth = 375;
    const minHeight = 700;

    // Calculate renderer and canvas sizes based on current dimensions
    const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
    const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
    const scale = scaleX > scaleY ? scaleX : scaleY;
    const width = windowWidth * scale;
    const height = windowHeight * scale;

    // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
    app.renderer.canvas.style.width = `${windowWidth}px`;
    app.renderer.canvas.style.height = `${windowHeight}px`;
    window.scrollTo(0, 0);

    // Update renderer  and navigation screens dimensions
    app.renderer.resize(width, height);
    navigation.resize(width, height);
  }, [app, navigation]);

  const visibilityChange = useCallback(() => {
    if (document.hidden) {
      sound.pauseAll();
      navigation?.blur();
    } else {
      sound.resumeAll();
      navigation?.focus();
    }
  }, [navigation]);

  useEffect(() => {
    resize();

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibilityChange);
    };
  }, [resize, visibilityChange]);
}
