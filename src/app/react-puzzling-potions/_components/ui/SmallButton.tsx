'use client';

import React, { useRef, useCallback } from 'react';
import { Container } from 'pixi.js';
import useSprite from '../../_hooks/useSprite';
import useSfx from '../../_hooks/useSfx';
import gsap from 'gsap';

export interface SmallButtonProps {
  text: string;
  x?: number;
  y?: number;
  onPress?: () => void;
}

const SmallButton: React.FC<SmallButtonProps> = ({
  text,
  x = 0,
  y = 0,
  onPress,
}) => {
  const containerRef = useRef<Container>(null);
  const sfx = useSfx();
  const buttonTexture = useSprite({ bundle: 'common', id: 'button-small' });

  const handlePointerOver = useCallback(() => {
    if (!containerRef.current) return;

    sfx.play('common/sfx-hover.wav');
    gsap.to(containerRef.current.scale, {
      x: 1.1,
      y: 1.1,
      duration: 0.2,
      ease: 'back.out',
    });
  }, [sfx]);

  const handlePointerOut = useCallback(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current.scale, {
      x: 1,
      y: 1,
      duration: 0.2,
      ease: 'back.out',
    });
  }, []);

  const handlePointerDown = useCallback(() => {
    if (!containerRef.current) return;

    sfx.play('common/sfx-press.wav');
    gsap.to(containerRef.current.scale, {
      x: 0.95,
      y: 0.95,
      duration: 0.1,
      ease: 'back.out',
    });
  }, [sfx]);

  const handlePointerUp = useCallback(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current.scale, {
      x: 1.1,
      y: 1.1,
      duration: 0.1,
      ease: 'back.out',
    });
    onPress?.();
  }, [onPress]);

  if (!buttonTexture) return null;

  return (
    <pixiContainer
      ref={containerRef}
      x={x}
      y={y}
      interactive
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <pixiSprite texture={buttonTexture.texture} anchor={0.5} />
      <pixiText
        text={text}
        style={{
          fill: 0xffffff,
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'bold',
        }}
        anchor={0.5}
      />
    </pixiContainer>
  );
};

export default SmallButton;
