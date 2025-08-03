'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Container } from 'pixi.js';
import useSprite from '../../_hooks/useSprite';
import gsap from 'gsap';

export interface BoardProps {
  onMove: () => void;
  onScoreUpdate: (score: number) => void;
  onGameComplete: () => void;
  disabled?: boolean;
  x?: number;
  y?: number;
}

export interface BoardRef {
  show: () => Promise<void>;
  hide: () => Promise<void>;
  restart: () => void;
}

const Board = forwardRef<BoardRef, BoardProps>(
  ({ onMove, onScoreUpdate, disabled = false, x = 0, y = 0 }, ref) => {
    const containerRef = useRef<Container>(null);
    const shelfBlock = useSprite({ bundle: 'game', id: 'shelf-block' });

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
          duration: 0.6,
          ease: 'back.out',
          delay: 0.1,
        });
      },
      hide: async () => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        await gsap.to(container, {
          alpha: 0,
          scaleX: 0.8,
          scaleY: 0.8,
          duration: 0.4,
          ease: 'back.in',
        });
      },
      restart: () => {
        onScoreUpdate(0);
      },
    }));

    const handleBoardClick = () => {
      if (!disabled) {
        onMove();
        onScoreUpdate(Math.floor(Math.random() * 100));
      }
    };

    if (!shelfBlock) return null;

    return (
      <pixiContainer ref={containerRef} x={x} y={y}>
        <pixiContainer interactive onPointerTap={handleBoardClick}>
          <pixiSprite texture={shelfBlock.texture} anchor={0.5} scale={2} />
          <pixiText
            text='GAME BOARD'
            style={{
              fill: 0xffffff,
              fontSize: 24,
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

Board.displayName = 'Board';

export default Board;
