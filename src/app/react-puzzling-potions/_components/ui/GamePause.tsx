'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Container } from 'pixi.js';
import useSprite from '../../_hooks/useSprite';
import gsap from 'gsap';

export interface GamePauseProps {
  visible: boolean;
  onResume: () => void;
  onRestart: () => void;
  x?: number;
  y?: number;
}

export interface GamePauseRef {
  show: () => Promise<void>;
  hide: () => Promise<void>;
}

const GamePause = forwardRef<GamePauseRef, GamePauseProps>(
  ({ visible, onResume, onRestart, x = 0, y = 0 }, ref) => {
    const containerRef = useRef<Container>(null);
    const background = useSprite({ bundle: 'common', id: 'rounded-rectangle' });
    const buttonLarge = useSprite({ bundle: 'common', id: 'button-large' });

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
          duration: 0.5,
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

    if (!background || !buttonLarge) return null;

    return (
      <pixiContainer ref={containerRef} x={x} y={y} visible={visible}>
        {/* Background */}
        <pixiSprite
          texture={background.texture}
          anchor={0.5}
          scale={3}
          tint={0x000000}
          alpha={0.8}
        />

        {/* Title */}
        <pixiText
          text='GAME PAUSED'
          style={{
            fill: 0xffffff,
            fontSize: 36,
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
          anchor={0.5}
          y={-60}
        />

        {/* Resume Button */}
        <pixiContainer y={20} interactive onPointerTap={onResume}>
          <pixiSprite texture={buttonLarge.texture} anchor={0.5} />
          <pixiText
            text='RESUME'
            style={{
              fill: 0xffffff,
              fontSize: 20,
              fontFamily: 'Arial',
              fontWeight: 'bold',
            }}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Restart Button */}
        <pixiContainer y={80} interactive onPointerTap={onRestart}>
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

GamePause.displayName = 'GamePause';

export default GamePause;
