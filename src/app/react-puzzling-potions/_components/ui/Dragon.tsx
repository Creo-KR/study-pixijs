'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Container } from 'pixi.js';
import useSpine from '../../_hooks/useSpine';
import gsap from 'gsap';

export interface DragonProps {
  x?: number;
  y?: number;
  animation?: 'dragon-idle' | 'dragon-bubbles' | 'dragon-transition';
}

export interface DragonRef {
  show: () => Promise<void>;
  hide: () => Promise<void>;
  playIdle: () => void;
}

const spineOptions = {
  skeleton: 'common/dragon-skeleton.json',
  atlas: 'common/dragon-skeleton.atlas',
};

const Dragon: React.FC<DragonProps> = ({
  x = 0,
  y = 0,
  animation = 'dragon-idle',
}) => {
  const containerRef = useRef<Container>(null);
  const spine = useSpine(spineOptions);

  // useImperativeHandle(ref, () => ({
  //   show: async () => {
  //     if (!containerRef.current) return;

  //     const container = containerRef.current;
  //     container.alpha = 0;
  //     container.scale.set(0.8);

  //     await gsap.to(container, {
  //       alpha: 1,
  //       scaleX: 1,
  //       scaleY: 1,
  //       duration: 0.8,
  //       ease: 'back.out',
  //     });
  //   },
  //   hide: async () => {
  //     if (!containerRef.current) return;

  //     const container = containerRef.current;

  //     await gsap.to(container, {
  //       alpha: 0,
  //       scaleX: 0.8,
  //       scaleY: 0.8,
  //       duration: 0.5,
  //       ease: 'back.in',
  //     });
  //   },
  // }));

  if (!spine) return null;

  return (
    <pixiContainer ref={containerRef} x={x} y={y}>
      <pixiSpine
        ref={spineRef => {
          spineRef?.state.setAnimation(0, animation, true);
        }}
        skeletonData={spine.skeleton.data}
        autoUpdate
        scale={0.3}
        x={-30}
        y={130}
      />
    </pixiContainer>
  );
};

export default Dragon;
