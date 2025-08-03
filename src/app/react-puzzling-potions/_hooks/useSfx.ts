'use client';

import { PlayOptions, sound } from '@pixi/sound';
import { useAppContext } from '../_components/AppProvider';

export default function useSfx(options?: PlayOptions) {
  const { volume } = useAppContext();

  const play = (alias: string) => {
    const finalVolume = volume * (options?.volume ?? 1);
    sound.play(alias, { ...options, volume: finalVolume });
  };

  return { play };
}
