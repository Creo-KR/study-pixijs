'use client';

import React, { useRef, useCallback } from 'react';
import { Container } from 'pixi.js';
import useSprite from '../../_hooks/useSprite';
import useSfx from '../../_hooks/useSfx';
import gsap from 'gsap';

export interface ImageButtonProps {
  image: string;
  bundle?: string;
  x?: number;
  y?: number;
  scale?: number;
  onPress?: () => void;
}

const ImageButton: React.FC<ImageButtonProps> = ({
  image,
  bundle = 'common',
  x = 0,
  y = 0,
  scale = 1,
  onPress,
}) => {
  const containerRef = useRef<Container>(null);
  const sfx = useSfx();
  const imageTexture = useSprite({ bundle, id: image });

  const handlePointerOver = useCallback(() => {
    if (!containerRef.current) return;

    sfx.play('common/sfx-hover.wav');
    gsap.to(containerRef.current.scale, {
      x: scale * 1.1,
      y: scale * 1.1,
      duration: 0.2,
      ease: 'back.out',
    });
  }, [sfx, scale]);

  const handlePointerOut = useCallback(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current.scale, {
      x: scale,
      y: scale,
      duration: 0.2,
      ease: 'back.out',
    });
  }, [scale]);

  const handlePointerDown = useCallback(() => {
    if (!containerRef.current) return;

    sfx.play('common/sfx-press.wav');
    gsap.to(containerRef.current.scale, {
      x: scale * 0.95,
      y: scale * 0.95,
      duration: 0.1,
      ease: 'back.out',
    });
  }, [sfx, scale]);

  const handlePointerUp = useCallback(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current.scale, {
      x: scale * 1.1,
      y: scale * 1.1,
      duration: 0.1,
      ease: 'back.out',
    });
    onPress?.();
  }, [onPress, scale]);

  if (!imageTexture) return null;

  return (
    <pixiContainer
      ref={containerRef}
      x={x}
      y={y}
      scale={scale}
      interactive
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <pixiSprite texture={imageTexture.texture} anchor={0.5} />
    </pixiContainer>
  );
};

export default ImageButton;
