'use client';

import React, { useCallback } from 'react';
import BaseScreen, { BaseScreenProps } from './BaseScreen';

const assetBundles = ['home', 'common'];

const Screen: React.FC<BaseScreenProps> = ({ visible, onShow, onHide }) => {
  // Show animation
  const handleShow = useCallback(async () => {
    onShow?.();
  }, [onShow]);

  // Hide animation
  const handleHide = useCallback(async () => {
    onHide?.();
  }, [onHide]);

  return (
    <BaseScreen
      visible={visible}
      assetBundles={assetBundles}
      onShow={handleShow}
      onHide={handleHide}
    ></BaseScreen>
  );
};

export default Screen;
