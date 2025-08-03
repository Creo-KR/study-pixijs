'use client';

import { Texture } from 'pixi.js';
import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useAppContext } from '../AppProvider';
import useTexture from '../../_hooks/useTexture';
import gsap from 'gsap';

interface SmokeCloudCircle {
  x: number;
  y: number;
  step: number;
  speed: number;
  scale: number;
  alpha: number;
}

interface SmokeCloudProps {
  height?: number;
  x?: number;
  y?: number;
}

export interface SmokeCloudRef {
  animateHeight: (
    targetHeight: number,
    duration?: number,
    delay?: number
  ) => Promise<void>;
}

const color = 0x2c136c;

const SmokeCloud = forwardRef<SmokeCloudRef, SmokeCloudProps>(
  ({ height = 100, x = 0, y = 0 }, ref) => {
    const { app, screen } = useAppContext();
    const [currentHeight, setCurrentHeight] = useState(height);
    const [circles, setCircles] = useState<SmokeCloudCircle[]>([]);

    const circleTexture = useTexture({
      bundle: 'preload',
      id: 'circle',
    });

    // Initialize circles when width changes
    useEffect(() => {
      const spacing = 60;
      const numCircles = Math.ceil(screen.width / spacing) + 1;
      const newCircles: SmokeCloudCircle[] = [];

      for (let i = 0; i < numCircles; i++) {
        newCircles.push({
          x: spacing * i,
          y: 0,
          step: Math.random() * 100,
          speed: Math.random() * 0.5 + 0.5,
          scale: 0.5 + Math.random() * 0.5,
          alpha: 1,
        });
      }

      setCircles(newCircles);
    }, [screen.width]);

    const handleRender = useCallback(() => {
      if (!app?.ticker) return;

      const delta = app.ticker.deltaTime;

      setCircles(prevCircles =>
        prevCircles.map(circle => ({
          ...circle,
          step: circle.step + delta * 0.1 * circle.speed,
          scale: Math.sin(circle.step) * 0.4 + (0.5 + Math.random() * 0.5),
        }))
      );
    }, [app]);

    // Expose methods through ref
    useImperativeHandle(
      ref,
      () => ({
        animateHeight: async (
          targetHeight: number,
          duration = 1,
          delay = 0
        ) => {
          return new Promise<void>(resolve => {
            gsap.to(
              { height: currentHeight },
              {
                height: targetHeight,
                duration,
                delay,
                ease: 'quad.in',
                onUpdate: function () {
                  setCurrentHeight(this.targets()[0].height);
                },
                onComplete: () => {
                  resolve();
                },
              }
            );
          });
        },
      }),
      [currentHeight]
    );

    if (!circleTexture) return null;

    return (
      <pixiContainer x={x} y={y} onRender={handleRender}>
        {/* Base rectangle */}
        <pixiSprite
          texture={Texture.WHITE}
          width={screen.width}
          height={currentHeight}
          tint={color}
        />

        {/* Animated circles */}
        <pixiContainer y={currentHeight}>
          {circles.map((circle, index) => (
            <pixiSprite
              key={index}
              texture={circleTexture}
              x={circle.x}
              y={0}
              anchor={0.5}
              scale={circle.scale}
              alpha={circle.alpha}
              tint={color}
            />
          ))}
        </pixiContainer>
      </pixiContainer>
    );
  }
);

SmokeCloud.displayName = 'SmokeCloud';

export default SmokeCloud;
