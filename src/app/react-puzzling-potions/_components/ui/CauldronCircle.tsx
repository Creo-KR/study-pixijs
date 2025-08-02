'use client';

import React from 'react';
import useTexture from '../../_hooks/useTexture';

const CauldronCircle: React.FC = () => {
  const texture = useTexture({
    bundle: 'preload',
    id: 'circle',
  });

  if (!texture) {
    return null;
  }

  return <pixiSprite texture={texture} anchor={0.5} tint={0x2c136c} />;
};

export default CauldronCircle;
