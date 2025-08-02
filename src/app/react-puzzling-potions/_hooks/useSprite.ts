'use client';

import { useMemo } from 'react';
import { Sprite, TextureSourceLike } from 'pixi.js';
import { useAppContext } from '../_components/AppProvider';

interface UseSpriteProps {
  bundle?: string;
  id: TextureSourceLike;
  skipCache?: boolean;
}

export default function useSprite({ bundle, id, skipCache }: UseSpriteProps) {
  const { areBundlesLoaded } = useAppContext();

  return useMemo(
    () =>
      !bundle || areBundlesLoaded([bundle]) ? Sprite.from(id, skipCache) : null,
    [areBundlesLoaded, bundle, id, skipCache]
  );
}
