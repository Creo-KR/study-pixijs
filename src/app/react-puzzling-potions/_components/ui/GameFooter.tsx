'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Container } from 'pixi.js';
import useSprite from '../../_hooks/useSprite';
import gsap from 'gsap';

export interface GameFooterProps {
  onRestart: () => void;
  x?: number;
  y?: number;
}

export interface GameFooterRef {
  show: () => Promise<void>;
  hide: () => Promise<void>;
}

const GameFooter = forwardRef<GameFooterRef, GameFooterProps>(
  ({ onRestart, x = 0, y = 0 }, ref) => {
    const containerRef = useRef<Container>(null);
    const buttonLarge = useSprite({ bundle: 'common', id: 'button-large' });

    useImperativeHandle(ref, () => ({
      show: async () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.alpha = 0;
        container.y = 50;

        await gsap.to(container, {
          alpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out',
          delay: 0.2,
        });
      },
      hide: async () => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        await gsap.to(container, {
          alpha: 0,
          y: 50,
          duration: 0.3,
          ease: 'back.in',
        });
      },
    }));

    if (!buttonLarge) return null;

    return (
      <pixiContainer ref={containerRef} x={x} y={y}>
        {/* Restart Button */}
        <pixiContainer interactive onPointerTap={onRestart}>
          <pixiSprite texture={buttonLarge.texture} anchor={0.5} />
          <pixiText
            text='RESTART'
            style={{
              fill: 0xffffff,
              fontSize: 20,
              fontFamily: 'Arial',
              fontWeight: 'bold',
            }}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>
    );
  }
);

GameFooter.displayName = 'GameFooter';

export default GameFooter;
