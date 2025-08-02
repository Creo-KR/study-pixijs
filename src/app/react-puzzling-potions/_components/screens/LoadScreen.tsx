'use client';

import React from 'react';
import BaseScreen from './BaseScreen';
import Cauldron from '../ui/Cauldron';

const assetBundles = ['preload'];

const LoadScreen: React.FC = () => {
  return (
    <BaseScreen assetBundles={assetBundles}>
      <Cauldron />
    </BaseScreen>
  );
};

export default LoadScreen;
