'use client';

import { registerCustomEase } from '@/app/puzzling-potions/_components/utils/animation';
import { extend } from '@pixi/react';
import { Container, ObservablePoint, Sprite } from 'pixi.js';
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
import CauldronCircle from './CauldronCircle';

extend({
  Container,
  Sprite,
  Spine,
});

const easeDropJumpOut = registerCustomEase(
  'M0,0,C0,0,0.07,-0.63,0.402,-0.422,0.83,-0.152,1,1,1,1'
);

interface CauldronProps {
  isShadow?: boolean;
  animated?: boolean;
  children?: React.ReactNode;
}

const Cauldron: React.FC<CauldronProps> = ({
  isShadow = false,
  animated = true,
  children,
}) => {
  const containerRef = useRef<Container>(null);

  const shadow = useSprite({
    bundle: 'preload',
    id: 'circle',
  });

  const spine = useSpine({
    skeleton: 'preload/cauldron-skeleton.json',
    atlas: 'preload/cauldron-skeleton.atlas',
  });

  const [contentProps, setContentProps] = useState<{
    x: number;
    y: number;
    rotation: number;
  }>({
    x: 0,
    y: 0,
    rotation: 0,
  });

  const [splashDrops, setSplashDrops] = useState<ReactNode[]>([]);

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

    gsap.killTweensOf(containerRef.current.scale);

    if (animated) {
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

      gsap.killTweensOf(containerRef.current.scale);
      if (animated) {
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
  }, [shadow, spine, animated]);

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
      {splashDrops}
    </pixiContainer>
  );
};

export default Cauldron;
