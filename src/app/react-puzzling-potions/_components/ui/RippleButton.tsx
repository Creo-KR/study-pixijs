'use client';

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useTexture from '../../_hooks/useTexture';
import useSprite from '../../_hooks/useSprite';
import useSfx from '../../_hooks/useSfx';
import gsap from 'gsap';
import { FancyButton } from '@pixi/ui';
import { Sprite } from 'pixi.js';
import { waitFor } from '@/app/puzzling-potions/_components/utils/asyncUtils';

interface RippleButtonProps {
  visible?: boolean;
  isShowHideAnimate?: boolean;
  image: string;
  ripple: string;
  x?: number;
  y?: number;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  visible = true,
  isShowHideAnimate = true,
  image,
  ripple,
  ...props
}) => {
  const sfx = useSfx();
  const buttonRef = useRef<FancyButton>(null);
  const imageSprite = useSprite({
    id: image,
  });
  const rippleTexture = useTexture({
    id: ripple,
  });

  const [ripples, setRipples] = useState<ReactNode[]>([]);

  useEffect(() => {
    if (!imageSprite) return;
    imageSprite.x = 0;
    imageSprite.y = 0;
    imageSprite.interactiveChildren = false;
  }, [imageSprite]);

  useEffect(() => {
    if (!buttonRef.current || !imageSprite) return;

    if (visible) {
      gsap.killTweensOf(buttonRef.current.scale);
      gsap.killTweensOf(imageSprite);
      buttonRef.current.visible = true;
      buttonRef.current.eventMode = 'dynamic';
      if (isShowHideAnimate) {
        console.log('test!');
        imageSprite.alpha = 0;
        buttonRef.current.scale.set(1.5);
        gsap.to(imageSprite, {
          alpha: 1,
          duration: 0.3,
          ease: 'linear',
        });
        gsap.to(buttonRef.current.scale, {
          x: 1,
          y: 1,
          duration: 0.3,
          ease: 'sine.out',
        });
      } else {
        imageSprite.alpha = 1;
        buttonRef.current.scale.set(1);
      }
    } else {
      buttonRef.current.eventMode = 'none';
      gsap.killTweensOf(buttonRef.current.scale);
      gsap.killTweensOf(imageSprite);
      if (isShowHideAnimate) {
        gsap.to(imageSprite, { alpha: 0, duration: 0.3, ease: 'linear' });
        gsap.to(buttonRef.current.scale, {
          x: 1.5,
          y: 1.5,
          duration: 0.3,
          ease: 'sine.out',
        });
      } else {
        imageSprite.alpha = 0;
        buttonRef.current.scale.set(0);
      }
      buttonRef.current.visible = false;
    }
  }, [visible, isShowHideAnimate, imageSprite]);

  const playRipples = useCallback(async () => {
    if (!rippleTexture) return;

    for (let i = 0; i < 3; i++) {
      const handleRendered = async (ref: Sprite | null) => {
        if (!ref) return;

        gsap.killTweensOf(ref.scale);
        gsap.killTweensOf(ref);
        gsap.to(ref.scale, { x: 3, y: 3, duration: 0.6, ease: 'linear' });
        await gsap.to(ref, { alpha: 0, duration: 0.6, ease: 'linear' });
        ref.parent.removeChild(ref);
      };

      const ripple = (
        <pixiSprite
          key={i}
          ref={ref => {
            handleRendered(ref);
          }}
          texture={rippleTexture}
          anchor={0.5}
          scale={1}
          alpha={0.5}
        />
      );

      setRipples(prev => [...prev, ripple]);
      await waitFor(0.2);
    }
  }, [rippleTexture]);

  const handleHover = useCallback(() => {
    if (!buttonRef.current) return;

    sfx.play('common/sfx-hover.wav');
    gsap.to(buttonRef.current?.scale, {
      x: 1.2,
      y: 1.2,
      duration: 0.2,
      ease: 'back.out',
    });
  }, [sfx]);

  const handleOut = useCallback(() => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current?.scale, {
      x: 1,
      y: 1,
      duration: 0.2,
      ease: 'back.out',
    });
  }, []);

  const handleDown = useCallback(() => {
    sfx.play('common/sfx-press.wav');
    playRipples();
  }, [sfx, playRipples]);

  if (!imageSprite) return null;

  return (
    <pixiFancyButton
      ref={buttonRef}
      defaultView={imageSprite}
      onMouseOver={handleHover}
      onMouseOut={handleOut}
      onMouseDown={handleDown}
      anchor={0.5}
      {...props}
    >
      {ripples}
    </pixiFancyButton>
  );
};

export default RippleButton;
