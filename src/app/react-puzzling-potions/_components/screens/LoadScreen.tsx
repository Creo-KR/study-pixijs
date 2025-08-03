'use client';

import React, { useState, useRef, useCallback } from 'react';
import Cauldron, { CauldronRef } from '../ui/Cauldron';
import PixiLogo from '../ui/PixiLogo';
import SmokeCloud, { SmokeCloudRef } from '../ui/SmokeCloud';
import gsap from 'gsap';
import BaseScreen from './BaseScreen';
import useScreen from '../../_hooks/useScreen';
import { Text } from 'pixi.js';

const assetBundles = ['preload'];

const i18n = {
  loadingMessage: 'Game Brewing',
  loadingDone: "We're Ready!",
};

interface LoadScreenProps {
  onShow?: () => void;
  onHide?: () => void;
}

const LoadScreen: React.FC<LoadScreenProps> = () => {
  const screen = useScreen();

  const [loadingMessage, setLoadingMessage] = useState(i18n.loadingMessage);
  const [messageAlpha, setMessageAlpha] = useState(1);

  const cauldronRef = useRef<CauldronRef>(null);
  const smokeCloudRef = useRef<SmokeCloudRef>(null);
  const messageRef = useRef<Text>(null);

  // Show animation
  const show = useCallback(async () => {
    if (messageRef.current) {
      gsap.killTweensOf(messageRef.current);
      gsap.set(messageRef.current, { alpha: 1 });
    }
    setMessageAlpha(1);
  }, []);

  // Hide animation
  const hide = useCallback(async () => {
    // Change then hide the loading message
    setLoadingMessage(i18n.loadingDone);

    if (messageRef.current) {
      gsap.killTweensOf(messageRef.current);
      gsap.to(messageRef.current, {
        alpha: 0,
        duration: 0.3,
        ease: 'linear',
        delay: 0.5,
        onUpdate: () => {
          if (messageRef.current) {
            setMessageAlpha(messageRef.current.alpha);
          }
        },
      });
    }

    // Make the cloud cover the entire screen
    if (smokeCloudRef.current) {
      await smokeCloudRef.current.animateHeight(screen.height, 1, 0.5);
    }
  }, [screen.height]);

  return (
    <BaseScreen assetBundles={assetBundles}>
      {/* Cauldron */}
      <Cauldron
        ref={cauldronRef}
        x={screen.width * 0.5}
        y={screen.height * 0.5}
      />

      {/* Loading Message */}
      <pixiText
        ref={messageRef}
        text={loadingMessage}
        style={{
          fill: 0x5c5c5c,
          fontFamily: 'Verdana',
          align: 'center',
        }}
        anchor={0.5}
        x={screen.width * 0.5}
        y={screen.height * 0.75}
        alpha={messageAlpha}
      />

      {/* PixiJS Logo */}
      <PixiLogo x={screen.width * 0.5} y={screen.height - 50} />

      {/* Smoke Cloud */}
      <SmokeCloud ref={smokeCloudRef} height={100} x={0} y={0} />
    </BaseScreen>
  );
};

export default LoadScreen;
