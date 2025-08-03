'use client';

import React from 'react';
import useSprite from '../../_hooks/useSprite';

interface LogoProps {
  x?: number;
  y?: number;
}

const Logo: React.FC<LogoProps> = ({ x = 0, y = 0 }) => {
  const sprite = useSprite({
    id: 'logo-game',
  });

  if (!sprite) return null;

  return (
    <pixiContainer x={x} y={y} scale={0.5}>
      <pixiSprite texture={sprite.texture} anchor={0.5} />
    </pixiContainer>
  );
};

export default Logo;
