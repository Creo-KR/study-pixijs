'use client';

import { usePixiApp } from '../AppProvider';
import { getMasterVolume, setMasterVolume } from '../utils/audio';

export default function useAudio() {
  const { bgm, sfx, isInitialized } = usePixiApp();

  return {
    bgm,
    sfx,
    isInitialized,
    getMasterVolume,
    setMasterVolume,
  };
}
