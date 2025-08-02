'use client';

import React, { useEffect, useState } from 'react';
import BaseScreen from './BaseScreen';
import Cauldron from '../ui/Cauldron';
import { randomRange } from '@/app/puzzling-potions/_components/utils/random';
import CauldronCircle from '../ui/CauldronCircle';

const assetBundles = ['preload'];

const LoadScreen: React.FC = () => {
  const [splashDrops, setSplashDrops] = useState<number>(0);

  useEffect(() => {
    setInterval(() => {
      const drops = randomRange(1, 3);
      setSplashDrops(drops);
    }, 1000);
  }, []);

  return (
    <BaseScreen assetBundles={assetBundles}>
      <Cauldron splashDrops={splashDrops} />
    </BaseScreen>
  );
};

export default LoadScreen;
