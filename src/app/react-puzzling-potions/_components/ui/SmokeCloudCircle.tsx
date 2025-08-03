'use client';

import React, { useCallback, useRef, useState } from 'react';
import useTexture from '../../_hooks/useTexture';
import { Sprite } from 'pixi.js';
import { PixiReactElementProps } from '@pixi/react';
import { useAppContext } from '../AppProvider';

interface SmokeCloudCircleProps extends PixiReactElementProps<typeof Sprite> {
  step?: number;
  speed?: number;
}

const SmokeCloudCircle: React.FC<SmokeCloudCircleProps> = ({
  speed = 1,
  ...props
}) => {
  const { app } = useAppContext();
  const spriteRef = useRef<Sprite>(null);
  const texture = useTexture({
    bundle: 'preload',
    id: 'circle',
  });

  const [step, setStep] = useState(props.step || 1);
  const [scale, setScale] = useState(props.scale);

  const handleRender = useCallback(() => {
    const delta = app.ticker.deltaTime;
    setStep(prev => prev + delta * 0.1 * speed);
    setScale(Math.sin(step) * 0.4 + 1);
  }, [app.ticker, step, speed]);

  if (!texture) {
    return null;
  }

  return (
    <pixiSprite
      ref={spriteRef}
      texture={texture}
      anchor={0.5}
      {...props}
      scale={scale}
      onRender={handleRender}
    />
  );
};

export default SmokeCloudCircle;
