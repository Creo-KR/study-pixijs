'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Container } from 'pixi.js';
import useSprite from '../../_hooks/useSprite';
import gsap from 'gsap';

export interface GameHeaderProps {
  time: number;
  score: number;
  moves: number;
  level: number;
  onPause: () => void;
  x?: number;
  y?: number;
}

export interface GameHeaderRef {
  show: () => Promise<void>;
  hide: () => Promise<void>;
}

const GameHeader = forwardRef<GameHeaderRef, GameHeaderProps>(
  ({ time, score, moves, level, onPause, x = 0, y = 0 }, ref) => {
    const containerRef = useRef<Container>(null);
    const header = useSprite({ bundle: 'game', id: 'game-header' });
    const pauseButton = useSprite({ bundle: 'common', id: 'icon-pause' });

    useImperativeHandle(ref, () => ({
      show: async () => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.alpha = 0;
        container.y = -50;

        await gsap.to(container, {
          alpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out',
        });
      },
      hide: async () => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        await gsap.to(container, {
          alpha: 0,
          y: -50,
          duration: 0.3,
          ease: 'back.in',
        });
      },
    }));

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!header || !pauseButton) return null;

    return (
      <pixiContainer ref={containerRef} x={x} y={y}>
        {/* Header Background */}
        <pixiSprite texture={header.texture} anchor={0.5} />

        {/* Time Display */}
        <pixiText
          text={formatTime(time)}
          style={{
            fill: 0xffffff,
            fontSize: 20,
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
          anchor={0.5}
          x={-150}
        />

        {/* Score Display */}
        <pixiText
          text={score.toString()}
          style={{
            fill: 0xffd700,
            fontSize: 24,
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
          anchor={0.5}
          x={-50}
        />

        {/* Moves Display */}
        <pixiText
          text={moves.toString()}
          style={{
            fill: 0x87ceeb,
            fontSize: 20,
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
          anchor={0.5}
          x={50}
        />

        {/* Level Display */}
        <pixiText
          text={`Lv.${level}`}
          style={{
            fill: 0xff69b4,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: 'bold',
          }}
          anchor={0.5}
          x={120}
        />

        {/* Pause Button */}
        <pixiContainer x={180} interactive onPointerTap={onPause}>
          <pixiSprite texture={pauseButton.texture} anchor={0.5} scale={0.8} />
        </pixiContainer>
      </pixiContainer>
    );
  }
);

GameHeader.displayName = 'GameHeader';

export default GameHeader;
