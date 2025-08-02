'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '../AppProvider';

export interface BaseScreenProps {
  children?: React.ReactNode;
  assetBundles?: string[];
}

const BaseScreen: React.FC<BaseScreenProps> = ({ children, assetBundles }) => {
  const isLoading = useRef<boolean>(undefined);
  const { app, loadBundles, areBundlesLoaded } = useAppContext();

  const checkBundlesLoaded = useCallback(async () => {
    if (isLoading.current) return;
    if (!assetBundles || areBundlesLoaded(assetBundles)) {
      isLoading.current = false;
      return;
    }
    isLoading.current = true;
    await loadBundles(assetBundles);
    isLoading.current = false;
  }, [assetBundles, areBundlesLoaded, loadBundles]);

  useEffect(() => {
    if (isLoading.current !== undefined) return;

    checkBundlesLoaded();
  }, [checkBundlesLoaded]);

  if (isLoading.current !== false) {
    return null;
  }

  return (
    <pixiContainer x={300} y={300}>
      {children}
    </pixiContainer>
  );
};

export default BaseScreen;
