'use client';

import React, { useCallback, useRef } from 'react';
import { Container } from 'pixi.js';
import BaseScreen, { BaseScreenProps } from './BaseScreen';
import useScreen from '../../_hooks/useScreen';
import useSprite from '../../_hooks/useSprite';
import Logo from '../ui/Logo';
import RippleButton from '../ui/RippleButton';
import LargeButton from '../ui/LargeButton';
import SmallButton from '../ui/SmallButton';
import ImageButton from '../ui/ImageButton';
import Dragon from '../ui/Dragon';
import gsap from 'gsap';

const assetBundles = ['home', 'common'];

// Custom ease curve for reveal animation
const easeSoftBackOut =
  'M0,0,C0,0,0.05,0.228,0.09,0.373,0.12,0.484,0.139,0.547,0.18,0.654,0.211,0.737,0.235,0.785,0.275,0.864,0.291,0.896,0.303,0.915,0.325,0.944,0.344,0.97,0.356,0.989,0.38,1.009,0.413,1.039,0.428,1.073,0.604,1.074,0.72,1.074,0.822,1.035,0.91,1.011,0.943,1.002,1,1,1,1';

const HomeScreen: React.FC<BaseScreenProps> = ({ visible, onShow, onHide }) => {
  const screen = useScreen();
  const baseRef = useRef<Container>(null);
  const baseSprite = useSprite({ bundle: 'common', id: 'rounded-rectangle' });

  const playRevealAnimation = useCallback(async () => {
    if (!baseRef.current) return;

    const base = baseRef.current;
    const duration = 1;

    gsap.killTweensOf(base);
    gsap.killTweensOf(base.pivot);

    // Make the base cover the entire screen initially
    base.scale.y = (screen.height * 1.25) / 200;
    base.pivot.y = screen.height;

    // Animate to reveal the screen
    gsap.to(base.scale, {
      y: 1,
      duration,
      ease: easeSoftBackOut,
    });

    await gsap.to(base.pivot, {
      y: 0,
      duration,
      ease: easeSoftBackOut,
    });
  }, [screen.height]);

  // Show animation
  const handleShow = useCallback(async () => {
    if (!baseRef.current) return;

    // Play reveal animation
    await playRevealAnimation();

    onShow?.();
  }, [onShow, playRevealAnimation]);

  // Hide animation
  const handleHide = useCallback(async () => {
    if (!baseRef.current) return;

    const base = baseRef.current;

    // Hide animation
    gsap.to(base, { y: -200, duration: 0.3, ease: 'back.in' });
    await gsap.to(base, { alpha: 0, duration: 0.2 });

    onHide?.();
  }, [onHide]);

  const handlePlayClick = useCallback(() => {
    // Navigate to game screen
    console.log('Navigate to game screen');
  }, []);

  const handleInfoClick = useCallback(() => {
    // Show info popup
    console.log('Show info popup');
  }, []);

  const handleSettingsClick = useCallback(() => {
    // Show settings popup
    console.log('Show settings popup');
  }, []);

  const handleGithubClick = useCallback(() => {
    window.open('https://github.com/pixijs/open-games', '_blank');
  }, []);

  const handlePixiClick = useCallback(() => {
    window.open('https://pixijs.com/', '_blank');
  }, []);

  return (
    <BaseScreen
      visible={visible}
      assetBundles={assetBundles}
      onShow={handleShow}
      onHide={handleHide}
    >
      {/* Logo */}
      <Logo x={screen.width * 0.5} y={screen.height * 0.2} />

      {/* Dragon Character */}
      <Dragon x={screen.width * 0.5} y={screen.height * 0.5} />

      {/* Base Background */}
      <pixiContainer ref={baseRef} x={0} y={screen.height - 140}>
        {baseSprite && (
          <pixiSprite
            texture={baseSprite.texture}
            width={screen.width}
            height={200}
            tint={0x2c136c}
          />
        )}
      </pixiContainer>

      {/* Play Button */}
      <LargeButton
        text='PLAY'
        x={screen.width * 0.5}
        y={screen.height - 130}
        onPress={handlePlayClick}
      />

      {/* Info Button */}
      <RippleButton
        image='icon-info'
        ripple='icon-info-stroke'
        x={30}
        y={30}
        onPress={handleInfoClick}
      />

      {/* Settings Button */}
      <RippleButton
        image='icon-settings'
        ripple='icon-settings-stroke'
        x={screen.width - 30}
        y={30}
        onPress={handleSettingsClick}
      />

      {/* GitHub Button */}
      <SmallButton
        text='GITHUB'
        x={screen.width - 50}
        y={screen.height - 40}
        onPress={handleGithubClick}
      />

      {/* PixiJS Button */}
      <ImageButton
        image='logo-pixi'
        bundle='preload'
        x={50}
        y={screen.height - 40}
        scale={0.75}
        onPress={handlePixiClick}
      />
    </BaseScreen>
  );
};

export default HomeScreen;
