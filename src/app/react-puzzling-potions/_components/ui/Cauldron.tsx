'use client';

import { extend } from '@pixi/react';
import { Container, Sprite } from 'pixi.js';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useSprite from '../../_hooks/useSprite';
import useSpine from '../../_hooks/useSpine';
import { Spine } from '@pixi/spine-pixi';
import gsap from 'gsap';
import { randomRange } from '@/app/puzzling-potions/_components/utils/random';
import CauldronCircle from './CauldronCircle';

extend({
  Container,
  Sprite,
  Spine,
});

const shadowOptions = {
  bundle: 'preload',
  id: 'circle',
};

const spineOptions = {
  skeleton: 'preload/cauldron-skeleton.json',
  atlas: 'preload/cauldron-skeleton.atlas',
};

interface CauldronProps {
  isShadow?: boolean;
  isShowHideAnimate?: boolean;
  children?: React.ReactNode;
  splashDrops?: number;
}

const Cauldron: React.FC<CauldronProps> = ({
  isShadow = false,
  isShowHideAnimate = true,
  children,
  splashDrops,
}) => {
  const visible = useRef<boolean>(false);
  const containerRef = useRef<Container>(null);

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

    gsap.killTweensOf(containerRef.current.scale);

    if (isShowHideAnimate) {
      containerRef.current.scale.set(0);
      gsap.to(containerRef.current.scale, {
        x: 1,
        y: 1,
        duration: 0.3,
        ease: 'back.out',
      });
    } else {
      containerRef.current.scale.set(1);
    }

    return () => {
      if (!containerRef.current) return;
      visible.current = false;

      gsap.killTweensOf(containerRef.current.scale);
      if (isShowHideAnimate) {
        gsap.to(containerRef.current.scale, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'back.in',
        });
      } else {
        containerRef.current.scale.set(0);
      }
    };
  }, [shadow, spine, isShowHideAnimate]);

  if (!shadow || !spine) {
    return null;
  }

  return (
    <pixiContainer ref={containerRef} onRender={handleRender}>
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
          ref={ref => ref?.state.setAnimation(0, 'animation', true)}
          skeletonData={spine.skeleton.data}
          autoUpdate
          y={50}
        >
          {children ? (
            <pixiContainer {...contentProps}>{children}</pixiContainer>
          ) : null}
        </pixiSpine>
      </pixiContainer>
      {drops}
    </pixiContainer>
  );
};

export default Cauldron;
