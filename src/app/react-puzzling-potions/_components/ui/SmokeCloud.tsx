'use client';

import { Texture } from 'pixi.js';
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import gsap from 'gsap';
import SmokeCloudCircle from './SmokeCloudCircle';
import useScreen from '../../_hooks/useScreen';

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
const spacing = 60;

const SmokeCloud = forwardRef<SmokeCloudRef, SmokeCloudProps>(
  ({ height = 100, x = 0, y = 0 }, ref) => {
    const screen = useScreen();
    const [currentHeight, setCurrentHeight] = useState(height);
    const [circles, setCircles] = useState<SmokeCloudCircle[]>([]);

    // Initialize circles when width changes
    useEffect(() => {
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

    return (
      <pixiContainer x={x} y={y}>
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
            <SmokeCloudCircle key={index} tint={color} {...circle} />
          ))}
        </pixiContainer>
      </pixiContainer>
    );
  }
);

SmokeCloud.displayName = 'SmokeCloud';

export default SmokeCloud;
