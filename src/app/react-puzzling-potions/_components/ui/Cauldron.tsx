'use client';

import { Container } from 'pixi.js';
import { Spine } from '@pixi/spine-pixi';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import useSprite from '../../_hooks/useSprite';
import useSpine from '../../_hooks/useSpine';
import gsap from 'gsap';
import { randomRange } from '@/app/puzzling-potions/_components/utils/random';
import CauldronCircle from './CauldronCircle';

const shadowOptions = {
  bundle: 'preload',
  id: 'circle',
};

const spineOptions = {
  skeleton: 'preload/cauldron-skeleton.json',
  atlas: 'preload/cauldron-skeleton.atlas',
};

interface CauldronProps {
  x?: number;
  y?: number;
  isShadow?: boolean;
  isShowHideAnimate?: boolean;
  children?: React.ReactNode;
  splashDrops?: number;
  onPlaySplash?: (x: number, numDrops?: number) => void;
  onPlayWobble?: () => void;
}

export interface CauldronRef {
  playWobble: () => Promise<void>;
  playSplash: (x: number, numDrops?: number) => Promise<void>;
}

const Cauldron = forwardRef<CauldronRef, CauldronProps>(
  (
    {
      x = 0,
      y = 0,
      isShadow = false,
      isShowHideAnimate = true,
      children,
      splashDrops,
      onPlaySplash,
      onPlayWobble,
    },
    ref
  ) => {
    const visible = useRef<boolean>(false);
    const containerRef = useRef<Container>(null);
    const spineRef = useRef<Spine | null>(null);

    const shadow = useSprite(shadowOptions);
    const spine = useSpine(spineOptions);

    const [contentProps, setContentProps] = useState<{
      x: number;
      y: number;
      rotation: number;
    }>({
      x: 0,
      y: 0,
      rotation: 0,
    });

    // Wobble animation
    const playWobble = useCallback(async () => {
      if (!spineRef.current) return;

      gsap.killTweensOf(spineRef.current.scale);
      const scaleX = randomRange(1.1, 1.2);
      const scaleY = randomRange(0.8, 0.9);

      await gsap.to(spineRef.current.scale, {
        x: scaleX,
        y: scaleY,
        duration: 0.05,
        ease: 'linear',
      });

      await gsap.to(spineRef.current.scale, {
        x: 1,
        y: 1,
        duration: 0.8,
        ease: 'elastic.out',
      });

      onPlayWobble?.();
    }, [onPlayWobble]);

    // Splash animation
    const playSplash = useCallback(
      async (x: number, numDrops = 6) => {
        await playWobble();
        onPlaySplash?.(x, numDrops);
      },
      [playWobble, onPlaySplash]
    );

    const [drops, setDrops] = useState<React.ReactNode[]>([]);

    useEffect(() => {
      if (!splashDrops || splashDrops <= 0) return;

      const newDrops = [];
      for (let i = 0; i < splashDrops; i++) {
        const duration = randomRange(0.4, 0.6);
        const x = randomRange(-10, 10);
        const to = {
          x: x + randomRange(-100, 100),
          y: randomRange(30, 70),
        };
        const scale = randomRange(0.03, 0.07);

        newDrops.push(
          <CauldronCircle
            key={i}
            x={x}
            scale={scale}
            duration={duration}
            to={to}
          />
        );
      }
      setDrops(newDrops);
    }, [splashDrops]);

    const handleRender = useCallback(() => {
      if (!children || !spine) return;

      const bone = spine.skeleton.bones[1];
      setContentProps({
        x: bone.ax,
        y: -bone.ay - 5,
        rotation: bone.arotation * -0.015,
      });
    }, [children, spine]);

    useEffect(() => {
      if (!shadow || !spine || !containerRef.current) return;

      if (visible.current) return;
      visible.current = true;

      const container = containerRef.current;
      gsap.killTweensOf(container.scale);

      if (isShowHideAnimate) {
        container.scale.set(0);
        gsap.to(container.scale, {
          x: 1,
          y: 1,
          duration: 0.3,
          ease: 'back.out',
        });
      } else {
        container.scale.set(1);
      }

      return () => {
        if (!container) return;
        visible.current = false;

        gsap.killTweensOf(container.scale);
        if (isShowHideAnimate) {
          gsap.to(container.scale, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'back.in',
          });
        } else {
          container.scale.set(0);
        }
      };
    }, [shadow, spine, isShowHideAnimate]);

    // Expose methods through ref
    useImperativeHandle(
      ref,
      () => ({
        playWobble,
        playSplash,
      }),
      [playWobble, playSplash]
    );

    if (!shadow || !spine) {
      return null;
    }

    return (
      <pixiContainer ref={containerRef} onRender={handleRender} x={x} y={y}>
        <pixiContainer>
          <pixiSprite
            texture={shadow.texture}
            anchor={0.5}
            width={180}
            height={40}
            tint={0x262626}
            alpha={0.2}
            y={40}
            visible={isShadow}
          />
          <pixiSpine
            ref={ref => {
              ref?.state.setAnimation(0, 'animation', true);
            }}
            y={50}
            skeletonData={spine.skeleton.data}
            autoUpdate
          >
            {children ? (
              <pixiContainer {...contentProps}>{children}</pixiContainer>
            ) : null}
          </pixiSpine>
        </pixiContainer>
        {drops}
      </pixiContainer>
    );
  }
);

Cauldron.displayName = 'Cauldron';

export default Cauldron;
