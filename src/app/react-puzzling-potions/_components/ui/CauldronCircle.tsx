'use client';

import React, { useEffect, useRef } from 'react';
import useTexture from '../../_hooks/useTexture';
import { Sprite } from 'pixi.js';
import { registerCustomEase } from '@/app/puzzling-potions/_components/utils/animation';
import gsap from 'gsap';

const easeDropJumpOut = registerCustomEase(
  'M0,0,C0,0,0.07,-0.63,0.402,-0.422,0.83,-0.152,1,1,1,1'
);

interface CauldronCircleProps {
  x?: number;
  y?: number;
  scale?: number;
  duration?: number;
  to?: { x: number; y: number };
}

const CauldronCircle: React.FC<CauldronCircleProps> = ({
  x = 0,
  y = -45,
  scale = 1,
  duration = 1,
  to = { x: 0, y: 0 },
}) => {
  const spriteRef = useRef<Sprite>(null);
  const texture = useTexture({
    bundle: 'preload',
    id: 'circle',
  });

  useEffect(() => {
    if (!texture || !spriteRef.current) return;

    gsap.killTweensOf(spriteRef.current);
    gsap.killTweensOf(spriteRef.current.scale);
    spriteRef.current.scale.set(scale);
    spriteRef.current.alpha = 1;
    gsap.to(spriteRef.current.scale, {
      x: scale * 3,
      y: scale * 3,
      duration,
      ease: 'linear',
    });
    gsap.to(spriteRef.current, {
      alpha: 0,
      duration: 0.1,
      ease: 'linear',
      delay: duration - 0.1,
    });
    gsap.to(spriteRef.current, { x: to.x, duration, ease: 'linear' });
    gsap.to(spriteRef.current, {
      y: to.y,
      duration,
      ease: easeDropJumpOut,
    });
  }, [texture, scale, duration, to]);

  if (!texture) {
    return null;
  }

  return (
    <pixiSprite
      ref={spriteRef}
      texture={texture}
      anchor={0.5}
      tint={0x2c136c}
      x={x}
      y={y}
    />
  );
};

export default CauldronCircle;
