'use client';

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
import { Container } from 'pixi.js';
import useSprite from '../../_hooks/useSprite';
import useSfx from '../../_hooks/useSfx';
import gsap from 'gsap';

export interface LargeButtonProps {
  text: string;
  x?: number;
  y?: number;
  onPress?: () => void;
}

export interface LargeButtonRef {
  show: () => Promise<void>;
  hide: () => Promise<void>;
}

const LargeButton = forwardRef<LargeButtonRef, LargeButtonProps>(
  ({ text, x, y, onPress }, ref) => {
    const containerRef = useRef<Container>(null);
    const sfx = useSfx();
    const buttonTexture = useSprite({
      bundle: 'common',
      id: 'button-large',
    });

    useImperativeHandle(ref, () => ({
      show: async () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.alpha = 0;
        container.scale.set(0.8);

        await gsap.to(container, {
          alpha: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.3,
          ease: 'back.out',
        });
      },
      hide: async () => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        await gsap.to(container, {
          alpha: 0,
          scaleX: 0.8,
          scaleY: 0.8,
          duration: 0.3,
          ease: 'back.in',
        });
      },
    }));

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
            fontSize: 24,
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
          anchor={0.5}
        />
      </pixiContainer>
    );
  }
);

LargeButton.displayName = 'LargeButton';

export default LargeButton;
