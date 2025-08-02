import { useMemo } from 'react';
import { Texture, TextureSourceLike } from 'pixi.js';
import { useAppContext } from '../_components/AppProvider';

interface UseTextureProps {
  bundle?: string;
  id: TextureSourceLike;
  skipCache?: boolean;
}

export default function useTexture({ bundle, id, skipCache }: UseTextureProps) {
  const { areBundlesLoaded } = useAppContext();

  return useMemo(
    () =>
      !bundle || areBundlesLoaded([bundle])
        ? Texture.from(id, skipCache)
        : null,
    [areBundlesLoaded, bundle, id, skipCache]
  );
}
