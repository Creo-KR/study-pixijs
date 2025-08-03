'use client';

import React from 'react';
import useTexture from '../../_hooks/useTexture';

interface PixiLogoProps {
  x?: number;
  y?: number;
}

const PixiLogo: React.FC<PixiLogoProps> = ({ x = 0, y = 0 }) => {
  const texture = useTexture({
    bundle: 'preload',
    id: 'logo-pixi',
  });

  if (!texture) return null;

  return (
    <pixiContainer x={x} y={y}>
      <pixiSprite texture={texture} anchor={0.5} />
    </pixiContainer>
  );
};

export default PixiLogo;
