'use client';

import type { PlayOptions, sound as Sound } from '@pixi/sound';
import { useAppContext } from '../_components/AppProvider';
import { useMemo } from 'react';

let sound: typeof Sound | null = null;
async function loadModule() {
  if (sound) return;

  sound = (await import('@pixi/sound')).sound; // Lazy import
}

export default function useSfx(options?: PlayOptions) {
  const { volume } = useAppContext();
  loadModule();

  const play = (alias: string) => {
    const finalVolume = volume * (options?.volume ?? 1);
    sound?.play(alias, { ...options, volume: finalVolume });
  };

  return { play };
}
