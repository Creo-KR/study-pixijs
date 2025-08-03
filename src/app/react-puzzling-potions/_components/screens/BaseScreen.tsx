'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../AppProvider';

export interface BaseScreenProps {
  visible?: boolean;
  children?: React.ReactNode;
  assetBundles?: string[];
  onShow?: () => void;
  onHide?: () => void;
}

const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  assetBundles,
  onShow,
  onHide,
  ...props
}) => {
  const { loadBundles, areBundlesLoaded } = useAppContext();
  const isLoading = useRef<boolean>(undefined);
  const [visible, setVisible] = useState(false);

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

  useEffect(() => {
    setVisible(props.visible ?? true);
  }, [props.visible]);

  useEffect(() => {
    if (isLoading.current) return;

    if (visible) {
      onShow?.();
    } else {
      onHide?.();
    }
  }, [visible, onShow, onHide]);

  if (isLoading.current !== false) {
    return null;
  }

  return <pixiContainer>{children}</pixiContainer>;
};

export default BaseScreen;
